'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  },
];

export default function Collection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % collections.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + collections.length) % collections.length);
  };

  // Auto-play
  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(goNext, 4000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="collection" className="py-32 px-6 md:px-12 bg-[#0a0a0a]">
      <h2
        className="text-4xl md:text-5xl font-light text-center mb-4 tracking-wide"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Featured Collection
      </h2>
      <p className="text-center text-gray-500 text-sm tracking-[3px] uppercase mb-16">
        Handpicked pieces for the season
      </p>

      {/* 3D Carousel */}
      <div
        ref={containerRef}
        className="relative max-w-6xl mx-auto h-[500px] perspective-[1200px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {collections.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);

            // Calculate 3D transform
            const rotateY = offset * 45;
            const translateX = offset * 280;
            const translateZ = -absOffset * 200;
            const scale = 1 - absOffset * 0.15;
            const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.3;
            const zIndex = collections.length - absOffset;

            return (
              <div
                key={item.id}
                className="absolute w-[300px] md:w-[350px] h-[420px] md:h-[480px] cursor-pointer transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => goToSlide(index)}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl shadow-black/50 group">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Item info */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <h3
                      className="text-xl md:text-2xl mb-2 text-white"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[#b8a589] text-base tracking-wide">{item.price}</p>
                  </div>

                  {/* Highlight border for active */}
                  {index === activeIndex && (
                    <div className="absolute inset-0 border-2 border-[#b8a589]/50 rounded-lg pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-[#b8a589]/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-[#b8a589]/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-[#b8a589]/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-[#b8a589]/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-3 mt-10">
        {collections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-[#b8a589] w-8'
                : 'bg-gray-600 hover:bg-gray-500 w-2'
            }`}
          />
        ))}
      </div>

      <div className="text-center mt-14">
        <ClothButton text="View All" color="#444444" width={200} height={55} />
      </div>
    </section>
  );
}
