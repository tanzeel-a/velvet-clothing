'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import ClothButton from './ClothButton';

const collections = [
  {
    id: 1,
    name: 'Silk Evening Dress',
    price: '$890',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
  },
  {
    id: 2,
    name: 'Cashmere Coat',
    price: '$1,250',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  },
  {
    id: 3,
    name: 'Linen Ensemble',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  },
  {
    id: 4,
    name: 'Velvet Blazer',
    price: '$720',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  },
  {
    id: 5,
    name: 'Summer Dress',
    price: '$450',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    id: 6,
    name: 'Classic Blouse',
    price: '$340',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  },
];

export default function Collection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="collection" className="py-32 bg-[#0a0a0a] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2
          className="text-4xl md:text-5xl font-light text-center mb-4 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Featured Collection
        </h2>
        <p className="text-center text-gray-500 text-sm tracking-[3px] uppercase mb-16">
          Handpicked pieces for the season
        </p>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/80 hover:bg-[#b8a589] transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-[#b8a589] ${
            !canScrollLeft ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/80 hover:bg-[#b8a589] transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-[#b8a589] ${
            !canScrollRight ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {collections.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[320px] md:w-[380px] snap-center group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] rounded-lg">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 320px, 380px"
                  priority={index < 3}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[#b8a589] text-xs tracking-[3px] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    New Arrival
                  </p>
                  <h3
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[#b8a589] text-lg tracking-wide">{item.price}</p>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-[#b8a589]/0 group-hover:border-[#b8a589]/50 rounded-lg transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      </div>

      <div className="text-center mt-16">
        <ClothButton text="View All" color="#444444" width={200} height={55} />
      </div>
    </section>
  );
}
