'use client';

import dynamic from 'next/dynamic';
import ClothButton from './ClothButton';

const InfiniteGallery = dynamic(() => import('./InfiniteGallery'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#b8a589] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm tracking-wider">Loading gallery...</p>
      </div>
    </div>
  ),
});

const collectionImages = [
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
  'https://images.unsplash.com/photo-1485968579169-a6e9dc7d4b9e?w=800&q=80',
];

export default function Collection() {
  return (
    <section id="collection" className="py-24 bg-[#0a0a0a] scroll-mt-24 overflow-hidden">
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
      <InfiniteGallery
        images={collectionImages}
        speed={1.2}
        visibleCount={12}
        className="h-[600px] w-full"
      />

      {/* Instructions */}
      <div className="text-center mt-6 px-6">
        <p className="text-gray-600 text-xs tracking-wider">
          Use mouse wheel or arrow keys to navigate • Auto-plays after 3 seconds
        </p>
      </div>

      <div className="text-center mt-10">
        <ClothButton text="View All" color="#444444" width={200} height={55} />
      </div>
    </section>
  );
}
