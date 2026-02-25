'use client';

import Image from 'next/image';
import ClothButton from './ClothButton';

export default function About() {
  return (
    <section id="about" className="py-40 px-8 md:px-20 bg-[#111111]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl mx-auto items-center">
        {/* Image with decorative frame */}
        <div className="relative">
          <div className="relative h-[550px] lg:h-[700px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
              alt="About VELVET"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 border-l-2 border-t-2 border-[#b8a589]/40" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r-2 border-b-2 border-[#b8a589]/40" />
        </div>

        {/* Content */}
        <div className="lg:pl-8">
          <p className="text-[#b8a589] text-xs tracking-[4px] uppercase mb-6">Our Philosophy</p>
          <h3
            className="text-4xl md:text-5xl font-light mb-10 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Crafted With
            <br />
            <span className="text-[#b8a589]">Purpose</span>
          </h3>
          <p className="text-gray-400 leading-[2] mb-8 text-lg">
            At VELVET, we believe that clothing is more than fabric sewn together.
            It&apos;s an expression of identity, a statement of values, and a commitment
            to quality that stands the test of time.
          </p>
          <p className="text-gray-400 leading-[2] mb-12 text-lg">
            Each piece in our collection is thoughtfully designed and ethically
            produced, using only the finest materials sourced from sustainable
            suppliers around the world.
          </p>

          {/* Stats */}
          <div className="flex gap-12 mb-12">
            <div>
              <p className="text-3xl text-[#b8a589] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>15+</p>
              <p className="text-xs text-gray-500 tracking-wider uppercase mt-1">Years</p>
            </div>
            <div>
              <p className="text-3xl text-[#b8a589] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>50+</p>
              <p className="text-xs text-gray-500 tracking-wider uppercase mt-1">Artisans</p>
            </div>
            <div>
              <p className="text-3xl text-[#b8a589] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>100%</p>
              <p className="text-xs text-gray-500 tracking-wider uppercase mt-1">Sustainable</p>
            </div>
          </div>

          <ClothButton text="Our Story" color="#b8a589" width={200} height={55} />
        </div>
      </div>
    </section>
  );
}
