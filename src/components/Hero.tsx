'use client';

import Image from 'next/image';
import ClothButton from './ClothButton';

export default function Hero() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-24">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
        alt="Fashion"
        fill
        className="object-cover opacity-50 brightness-[0.6] contrast-[1.1]"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/90" />

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-px h-40 bg-gradient-to-b from-[#b8a589]/50 to-transparent hidden lg:block" />
      <div className="absolute top-60 right-10 w-px h-32 bg-gradient-to-b from-[#b8a589]/30 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-8 md:px-12">
        <p className="text-xs md:text-sm tracking-[8px] uppercase text-[#b8a589] mb-8 animate-fade-in-up">
          Spring Collection 2025
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-10 tracking-wide animate-fade-in-up-delay-1"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Elegance Woven
          <br />
          <span className="text-[#b8a589]">Into Every Thread</span>
        </h1>
        <p className="text-base md:text-lg font-light text-gray-300 leading-relaxed mb-14 max-w-2xl mx-auto animate-fade-in-up-delay-2">
          Discover our curated collection of timeless pieces, crafted with precision
          and designed for those who appreciate the art of fine clothing.
        </p>
        <div className="flex gap-6 md:gap-10 justify-center flex-wrap animate-fade-in-up-delay-3">
          <ClothButton text="Shop Now" color="#b8a589" width={200} height={60} />
          <ClothButton text="Explore" color="#ffffff" width={200} height={60} isBorder />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-gray-400 text-[0.65rem] tracking-[4px] uppercase">Scroll</span>
        <div className="w-px h-20 bg-gradient-to-b from-[#b8a589]/70 to-transparent scroll-line" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
