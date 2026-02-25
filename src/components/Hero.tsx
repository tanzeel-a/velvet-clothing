'use client';

import Image from 'next/image';
import ClothButton from './ClothButton';

export default function Hero() {
  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
        alt="Fashion"
        fill
        className="object-cover opacity-60 brightness-[0.7] contrast-[1.1]"
        priority
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <p className="text-xs tracking-[6px] uppercase text-[#b8a589] mb-5 animate-fade-in-up">
          Spring Collection 2025
        </p>
        <h1
          className="text-5xl md:text-7xl font-light leading-tight mb-8 tracking-wide animate-fade-in-up-delay-1"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Elegance Woven
          <br />
          Into Every Thread
        </h1>
        <p className="text-base font-light text-gray-300 leading-relaxed mb-12 max-w-2xl mx-auto animate-fade-in-up-delay-2">
          Discover our curated collection of timeless pieces, crafted with precision
          and designed for those who appreciate the art of fine clothing.
        </p>
        <div className="flex gap-8 justify-center flex-wrap animate-fade-in-up-delay-3">
          <ClothButton text="Shop Now" color="#b8a589" width={180} height={55} />
          <ClothButton text="Explore" color="#ffffff" width={180} height={55} isBorder />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-gray-500 text-[0.65rem] tracking-[3px] uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-gray-500 to-transparent scroll-line" />
      </div>
    </section>
  );
}
