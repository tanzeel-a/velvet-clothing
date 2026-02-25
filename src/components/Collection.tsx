'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import ClothButton from './ClothButton';

const collections = [
  {
    id: 1,
    name: 'Silk Evening Dress',
    price: '$890',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
  },
  {
    id: 2,
    name: 'Cashmere Coat',
    price: '$1,250',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
  },
  {
    id: 3,
    name: 'Linen Ensemble',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  },
  {
    id: 4,
    name: 'Velvet Blazer',
    price: '$720',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  },
  {
    id: 5,
    name: 'Wool Trousers',
    price: '$450',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
  },
];

export default function Collection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cardsRef = useRef<THREE.Mesh[]>([]);
  const animationRef = useRef<number>(0);
  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const autoRotateRef = useRef(true);

  const initScene = useCallback(() => {
    if (!containerRef.current || rendererRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 550;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 0.5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xb8a589, 0.3);
    backLight.position.set(-5, 0, -5);
    scene.add(backLight);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    const radius = 6;
    const cards: THREE.Mesh[] = [];
    let loadedCount = 0;

    collections.forEach((item, index) => {
      // Create placeholder while loading
      const geometry = new THREE.PlaneGeometry(2.8, 3.8, 1, 1);

      const material = new THREE.MeshStandardMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
      });

      const card = new THREE.Mesh(geometry, material);

      // Position in circle
      const angle = (index / collections.length) * Math.PI * 2;
      card.position.x = Math.sin(angle) * radius;
      card.position.z = Math.cos(angle) * radius - radius;
      card.rotation.y = -angle;

      card.userData = { index, baseAngle: angle };

      scene.add(card);
      cards.push(card);

      // Load texture
      textureLoader.load(
        item.image,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const newMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.6,
            metalness: 0.05,
            transparent: true,
            opacity: 1,
          });
          card.material = newMaterial;

          loadedCount++;
          if (loadedCount === collections.length) {
            setIsLoaded(true);
          }
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          loadedCount++;
          if (loadedCount === collections.length) {
            setIsLoaded(true);
          }
        }
      );
    });

    cardsRef.current = cards;

    // Animation
    const animate = () => {
      // Auto rotate when not interacting
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current += 0.001;
      }

      // Smooth rotation
      currentRotationRef.current += (targetRotationRef.current - currentRotationRef.current) * 0.06;

      // Update cards
      let closestZ = -Infinity;
      let closestIndex = 0;

      cards.forEach((card, index) => {
        const baseAngle = card.userData.baseAngle as number;
        const angle = baseAngle + currentRotationRef.current;

        card.position.x = Math.sin(angle) * radius;
        card.position.z = Math.cos(angle) * radius - radius;
        card.rotation.y = -angle;

        // Scale and opacity based on Z
        const normalizedZ = (card.position.z + radius * 2) / (radius * 2);
        const scale = 0.6 + normalizedZ * 0.5;
        card.scale.setScalar(scale);

        const material = card.material as THREE.MeshStandardMaterial;
        material.opacity = 0.4 + normalizedZ * 0.6;

        if (card.position.z > closestZ) {
          closestZ = card.position.z;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    // Interaction handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      lastXRef.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - lastXRef.current;
      targetRotationRef.current += delta * 0.004;
      lastXRef.current = e.clientX;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        autoRotateRef.current = true;
      }, 3000);
    };

    const handleWheel = (e: WheelEvent) => {
      autoRotateRef.current = false;
      targetRotationRef.current += e.deltaY * 0.001;
      setTimeout(() => {
        autoRotateRef.current = true;
      }, 3000);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      lastXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.touches[0].clientX - lastXRef.current;
      targetRotationRef.current += delta * 0.004;
      lastXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        autoRotateRef.current = true;
      }, 3000);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = initScene();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initScene]);

  const goToCard = (index: number) => {
    autoRotateRef.current = false;
    const targetAngle = -(index / collections.length) * Math.PI * 2;
    // Find closest rotation to avoid spinning all the way around
    const diff = targetAngle - currentRotationRef.current;
    const normalized = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    targetRotationRef.current = currentRotationRef.current + normalized;
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 3000);
  };

  const goNext = () => {
    autoRotateRef.current = false;
    targetRotationRef.current -= (1 / collections.length) * Math.PI * 2;
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 3000);
  };

  const goPrev = () => {
    autoRotateRef.current = false;
    targetRotationRef.current += (1 / collections.length) * Math.PI * 2;
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 3000);
  };

  return (
    <section id="collection" className="py-32 px-6 md:px-12 bg-[#0a0a0a]">
      <h2
        className="text-4xl md:text-5xl font-light text-center mb-4 tracking-wide"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Featured Collection
      </h2>
      <p className="text-center text-gray-500 text-sm tracking-[3px] uppercase mb-10">
        Drag or scroll to explore
      </p>

      {/* 3D Gallery */}
      <div className="relative max-w-6xl mx-auto">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-[#b8a589] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full h-[550px] cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        />

        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-[#b8a589]/40 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-[#b8a589]/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-[#b8a589]/40 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-[#b8a589]/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Active item info */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center bg-black/60 backdrop-blur-sm px-8 py-4 rounded-lg border border-white/10">
          <h3
            className="text-xl md:text-2xl mb-1 text-white"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {collections[activeIndex]?.name}
          </h3>
          <p className="text-[#b8a589] text-base tracking-wide">
            {collections[activeIndex]?.price}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-3 mt-6">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-[#b8a589] w-8'
                  : 'bg-gray-600 hover:bg-gray-500 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-14">
        <ClothButton text="View All" color="#444444" width={200} height={55} />
      </div>
    </section>
  );
}
