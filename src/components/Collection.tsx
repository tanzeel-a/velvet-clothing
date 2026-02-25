'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 600;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 0;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xb8a589, 1, 20);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // Load textures and create cards
    const textureLoader = new THREE.TextureLoader();
    const radius = 5;
    const cards: THREE.Mesh[] = [];

    collections.forEach((item, index) => {
      const texture = textureLoader.load(item.image);
      texture.colorSpace = THREE.SRGBColorSpace;

      // Card geometry with slight curve
      const geometry = new THREE.PlaneGeometry(2.5, 3.5, 20, 20);

      // Apply slight curve to vertices
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = Math.sin(x * 0.5) * 0.15;
        positions.setZ(i, z);
      }
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1,
      });

      const card = new THREE.Mesh(geometry, material);

      // Position cards in a circle
      const angle = (index / collections.length) * Math.PI * 2;
      card.position.x = Math.sin(angle) * radius;
      card.position.z = Math.cos(angle) * radius - radius;
      card.rotation.y = -angle;

      card.userData = { index, angle };

      scene.add(card);
      cards.push(card);
    });

    cardsRef.current = cards;
    setIsInitialized(true);

    // Animation loop
    const animate = () => {
      // Smooth rotation
      currentRotationRef.current += (targetRotationRef.current - currentRotationRef.current) * 0.08;

      // Update card positions
      cards.forEach((card, index) => {
        const baseAngle = (index / collections.length) * Math.PI * 2;
        const angle = baseAngle + currentRotationRef.current;

        card.position.x = Math.sin(angle) * radius;
        card.position.z = Math.cos(angle) * radius - radius;
        card.rotation.y = -angle;

        // Scale based on z position (closer = bigger)
        const scale = THREE.MathUtils.mapLinear(card.position.z, -radius * 2, 0, 0.7, 1.2);
        card.scale.setScalar(scale);

        // Opacity based on position
        const opacity = THREE.MathUtils.mapLinear(card.position.z, -radius * 2, 0, 0.3, 1);
        (card.material as THREE.MeshStandardMaterial).opacity = opacity;
        (card.material as THREE.MeshStandardMaterial).transparent = true;
      });

      // Find active card (closest to front)
      let closestZ = -Infinity;
      let closestIndex = 0;
      cards.forEach((card, index) => {
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

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    // Drag/scroll interaction
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastXRef.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - lastXRef.current;
      targetRotationRef.current += delta * 0.005;
      lastXRef.current = e.clientX;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      targetRotationRef.current += e.deltaY * 0.002;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      lastXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.touches[0].clientX - lastXRef.current;
      targetRotationRef.current += delta * 0.005;
      lastXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
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
  }, [isInitialized]);

  const goToCard = (index: number) => {
    const targetAngle = -(index / collections.length) * Math.PI * 2;
    targetRotationRef.current = targetAngle;
  };

  const goNext = () => {
    targetRotationRef.current -= (1 / collections.length) * Math.PI * 2;
  };

  const goPrev = () => {
    targetRotationRef.current += (1 / collections.length) * Math.PI * 2;
  };

  return (
    <section id="collection" className="py-32 px-8 md:px-20 bg-[#0a0a0a]">
      <h2
        className="text-4xl md:text-5xl font-light text-center mb-5 tracking-wide"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Featured Collection
      </h2>
      <p className="text-center text-gray-500 text-sm tracking-[3px] uppercase mb-12">
        Drag or scroll to explore
      </p>

      {/* 3D Gallery */}
      <div className="relative max-w-6xl mx-auto">
        <div
          ref={containerRef}
          className="w-full h-[600px] cursor-grab active:cursor-grabbing"
        />

        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#b8a589]/30 transition-colors flex items-center justify-center backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#b8a589]/30 transition-colors flex items-center justify-center backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Active item info */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <h3
            className="text-2xl mb-2 text-white"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {collections[activeIndex]?.name}
          </h3>
          <p className="text-[#b8a589] text-lg tracking-wide">
            {collections[activeIndex]?.price}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-[#b8a589] w-8'
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <ClothButton text="View All" color="#333333" width={200} height={55} />
      </div>
    </section>
  );
}
