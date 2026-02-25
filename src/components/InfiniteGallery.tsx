'use client';

import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ImageItem {
  src: string;
  alt?: string;
  name?: string;
  price?: string;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 6;
const MAX_VERTICAL_OFFSET = 4;

const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        float curveIntensity = scrollForce * 0.25;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.015;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.01;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 1.5;
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 6.0;
          float waveAmplitude = sin(wavePhase) * 0.08;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          float secondaryWave = sin(pos.x * 5.0 + time * 10.0) * 0.025 * dampening;
          flagWave += secondaryWave;
        }
        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        float curveHighlight = abs(scrollForce) * 0.04;
        color.rgb += vec3(curveHighlight * 0.08);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
};

function ImagePlane({
  texture,
  position,
  scale,
  material,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
    }
  }, [material, texture]);

  useEffect(() => {
    if (material && material.uniforms) {
      material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    }
  }, [material, isHovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 10,
  onActiveChange,
}: {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  onActiveChange?: (index: number) => void;
}) {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const lastInteraction = useRef(Date.now());

  const fadeSettings = {
    fadeIn: { start: 0.05, end: 0.2 },
    fadeOut: { start: 0.45, end: 0.5 },
  };

  const blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.45, end: 0.5 },
    maxBlur: 6.0,
  };

  const textures = useTexture(images.map((img) => img.src));

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  );

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < visibleCount; i++) {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const horizontalRadius = (i % 3) * 1.0;
      const verticalRadius = ((i + 1) % 4) * 0.6;

      const x = (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET) / 3;
      const y = (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4;

      positions.push({ x, y });
    }

    return positions;
  }, [visibleCount]);

  const totalImages = images.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  const planesData = useRef<PlaneData[]>(
    Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }))
  );

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
  }, [depthRange, spatialPositions, totalImages, visibleCount]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      setScrollVelocity((prev) => prev + event.deltaY * 0.008 * speed);
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    },
    [speed]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        setScrollVelocity((prev) => prev - 1.5 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        setScrollVelocity((prev) => prev + 1.5 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      }
    },
    [speed]
  );

  useEffect(() => {
    const canvas = document.querySelector('#gallery-canvas canvas');
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleWheel, handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) {
        setAutoPlay(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (autoPlay) {
      const idleSeconds = (Date.now() - lastInteraction.current) / 1000;
      const ramp = Math.min(idleSeconds / 5, 3);
      const autoSpeed = 0.2 + ramp * 0.5;
      setScrollVelocity((prev) => prev + autoSpeed * delta);
    }

    setScrollVelocity((prev) => prev * 0.95);

    const time = state.clock.getElapsedTime();
    materials.forEach((material) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.scrollForce.value = scrollVelocity;
      }
    });

    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;

    let closestZ = -Infinity;
    let closestImageIndex = 0;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }
      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;
      plane.x = spatialPositions[i]?.x ?? 0;
      plane.y = spatialPositions[i]?.y ?? 0;

      const normalizedPosition = plane.z / totalRange;
      let opacity = 1;

      if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
        const fadeInProgress = (normalizedPosition - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
        opacity = fadeInProgress;
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0;
      } else if (normalizedPosition >= fadeSettings.fadeOut.start && normalizedPosition <= fadeSettings.fadeOut.end) {
        const fadeOutProgress = (normalizedPosition - fadeSettings.fadeOut.start) / (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
        opacity = 1 - fadeOutProgress;
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0;
      }

      opacity = Math.max(0, Math.min(1, opacity));

      let blur = 0;
      if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
        const blurInProgress = (normalizedPosition - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start);
        blur = blurSettings.maxBlur * (1 - blurInProgress);
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur;
      } else if (normalizedPosition >= blurSettings.blurOut.start && normalizedPosition <= blurSettings.blurOut.end) {
        const blurOutProgress = (normalizedPosition - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start);
        blur = blurSettings.maxBlur * blurOutProgress;
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur;
      }

      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      const material = materials[i];
      if (material && material.uniforms) {
        material.uniforms.opacity.value = opacity;
        material.uniforms.blurAmount.value = blur;
      }

      // Track closest image for active display
      const worldZ = plane.z - depthRange / 2;
      if (worldZ > closestZ && opacity > 0.5) {
        closestZ = worldZ;
        closestImageIndex = plane.imageIndex;
      }
    });

    if (onActiveChange) {
      onActiveChange(closestImageIndex);
    }
  });

  if (images.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const textureArray = Array.isArray(textures) ? textures : [textures];
        const texture = textureArray[plane.imageIndex];
        const material = materials[i];
        if (!texture || !material) return null;

        const worldZ = plane.z - depthRange / 2;
        const img = texture.image as HTMLImageElement | undefined;
        const aspect = img ? img.width / img.height : 3 / 4;
        const baseScale = 2.5;
        const scale: [number, number, number] = aspect > 1
          ? [baseScale * aspect, baseScale, 1]
          : [baseScale, baseScale / aspect, 1];

        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, worldZ]}
            scale={scale}
            material={material}
          />
        );
      })}
    </>
  );
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  className?: string;
  onActiveChange?: (index: number) => void;
}

export default function InfiniteGallery({
  images,
  speed = 1,
  visibleCount = 10,
  className = 'h-[600px] w-full',
  onActiveChange,
}: InfiniteGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#111]`}>
        <p className="text-gray-400">WebGL not supported</p>
      </div>
    );
  }

  return (
    <div id="gallery-canvas" className={className}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GalleryScene
          images={images}
          speed={speed}
          visibleCount={visibleCount}
          onActiveChange={onActiveChange}
        />
      </Canvas>
    </div>
  );
}
