'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ClothButton from './ClothButton';

// Dynamic import to avoid SSR issues with Three.js
const InfiniteGallery = dynamic(() => import('./InfiniteGallery'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#b8a589] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const collections = [
  {
    src: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
    name: 'Silk Evening Dress',
    price: '$890',
  },
  {
    src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    name: 'Cashmere Coat',
    price: '$1,250',
  },
  {
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    name: 'Linen Ensemble',
    price: '$680',
  },
  {
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    name: 'Velvet Blazer',
    price: '$720',
  },
  {
    src: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    name: 'Wool Trousers',
    price: '$450',
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    name: 'Summer Dress',
    price: '$560',
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    name: 'Classic Blouse',
    price: '$340',
  },
  {
    src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    name: 'Knit Sweater',
    price: '$420',
  },
];

export default function Collection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="collection" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <h2
        className="text-4xl md:text-5xl font-light text-center mb-4 tracking-wide px-6"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Featured Collection
      </h2>
      <p className="text-center text-gray-500 text-sm tracking-[3px] uppercase mb-8 px-6">
        Scroll or use arrow keys to explore
      </p>

      {/* 3D Gallery */}
      <div className="relative">
        <InfiniteGallery
          images={collections}
          speed={1.2}
          visibleCount={10}
          className="h-[600px] w-full"
          onActiveChange={setActiveIndex}
        />

        {/* Active item info overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
          <div className="bg-black/70 backdrop-blur-md px-10 py-5 rounded-lg border border-white/10">
            <h3
              className="text-2xl md:text-3xl mb-2 text-white"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {collections[activeIndex]?.name}
            </h3>
            <p className="text-[#b8a589] text-lg tracking-wider">
              {collections[activeIndex]?.price}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 right-8 text-right text-xs text-gray-500 hidden md:block">
          <p>Mouse wheel to scroll</p>
          <p className="opacity-60">Auto-plays after 3s</p>
        </div>
      </div>

      <div className="text-center mt-12">
        <ClothButton text="View All" color="#444444" width={200} height={55} />
      </div>
    </section>
  );
}
