'use client';

import Image from 'next/image';
import ClothButton from './ClothButton';

export default function About() {
  return (
    <section id="about" className="py-32 px-8 md:px-16 bg-[#111111]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 max-w-6xl mx-auto items-center">
        <div className="relative h-[500px] lg:h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
            alt="About VELVET"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h3
            className="text-3xl md:text-4xl font-light mb-8"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Crafted With Purpose
          </h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            At VELVET, we believe that clothing is more than fabric sewn together.
            It&apos;s an expression of identity, a statement of values, and a commitment
            to quality that stands the test of time.
          </p>
          <p className="text-gray-400 leading-relaxed mb-10">
            Each piece in our collection is thoughtfully designed and ethically
            produced, using only the finest materials sourced from sustainable
            suppliers around the world.
          </p>
          <ClothButton text="Our Story" color="#b8a589" width={180} height={50} />
        </div>
      </div>
    </section>
  );
}
