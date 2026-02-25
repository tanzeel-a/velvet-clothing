'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ClothButton from './ClothButton';

const collections = [
  {
    id: 1,
    name: 'Silk Evening Dress',
    price: '$890',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=900&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Cashmere Coat',
    price: '$1,250',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=900&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Linen Ensemble',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=900&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Velvet Blazer',
    price: '$720',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=900&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Summer Collection',
    price: '$450',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop&q=80',
  },
];

export default function Collection() {
  const [position, setPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const itemCount = collections.length;

  const normalizePosition = useCallback((pos: number) => {
    const normalized = pos % itemCount;
    return normalized < 0 ? normalized + itemCount : normalized;
  }, [itemCount]);

  const activeIndex = Math.round(normalizePosition(position)) % itemCount;

  const goNext = useCallback(() => {
    setPosition(prev => prev + 1);
  }, []);

  const goPrev = useCallback(() => {
    setPosition(prev => prev - 1);
  }, []);

  const goToSlide = useCallback((index: number) => {
    const currentNormalized = normalizePosition(position);
    let diff = index - currentNormalized;

    if (diff > itemCount / 2) diff -= itemCount;
    if (diff < -itemCount / 2) diff += itemCount;

    setPosition(prev => prev + diff);
  }, [position, normalizePosition, itemCount]);

  useEffect(() => {
    if (isHovered || isDragging) return;

    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, goNext]);

  useEffect(() => {
    if (isDragging) return;

    const animate = () => {
      if (Math.abs(velocityRef.current) > 0.001) {
        setPosition(prev => prev + velocityRef.current);
        velocityRef.current *= 0.95;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    lastXRef.current = clientX;
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = (lastXRef.current - clientX) * 0.003;
    velocityRef.current = delta;
    setPosition(prev => prev + delta);
    lastXRef.current = clientX;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      setPosition(prev => prev + e.deltaX * 0.002);
    }
  };

  const getCardStyle = (index: number) => {
    const normalizedPos = normalizePosition(position);

    let offset = index - normalizedPos;

    if (offset > itemCount / 2) offset -= itemCount;
    if (offset < -itemCount / 2) offset += itemCount;

    const absOffset = Math.abs(offset);
    const rotateY = offset * 40;
    const translateX = offset * 300;
    const translateZ = -absOffset * 180;
    const scale = Math.max(0.6, 1 - absOffset * 0.12);
    const opacity = absOffset > 2.5 ? 0 : Math.max(0, 1 - absOffset * 0.35);
    const zIndex = 100 - Math.round(absOffset * 10);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <section id="collection" className="py-32 px-6 md:px-12 bg-[#0a0a0a] scroll-mt-24">
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
        className="relative max-w-6xl mx-auto h-[520px] md:h-[580px]"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleDragEnd();
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onWheel={handleWheel}
      >
        <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
          {collections.map((item, index) => {
            const style = getCardStyle(index);

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  ...style,
                  transformStyle: 'preserve-3d',
                  width: '280px',
                  height: '420px',
                }}
                onClick={() => !isDragging && goToSlide(index)}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl shadow-black/50 group bg-[#1a1a1a]">
                  {/* Fixed aspect ratio container */}
                  <div className="absolute inset-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 320px"
                      priority={index < 3}
                    />
                  </div>

                  {/* Gradient overlay */}
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

                  {/* Active border */}
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
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-full bg-black/60 hover:bg-[#b8a589]/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-[#b8a589]/50"
          aria-label="Previous item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-full bg-black/60 hover:bg-[#b8a589]/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-[#b8a589]/50"
          aria-label="Next item"
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
            aria-label={`Go to item ${index + 1}`}
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
