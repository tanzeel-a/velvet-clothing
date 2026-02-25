'use client';

import { useState } from 'react';
import ClothButton from './ClothButton';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  return (
    <section id="contact" className="py-32 px-8 md:px-16 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-light mb-5 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Stay Connected
        </h2>
        <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-8">
          Join our world of refined fashion
        </p>
        <p className="text-gray-500 leading-relaxed mb-10">
          Be the first to know about new collections, exclusive events, and special
          offers curated just for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-8 py-4 bg-transparent border border-gray-700 text-white text-sm w-full sm:w-80 outline-none transition-colors focus:border-[#b8a589]"
          />
          <ClothButton text="Subscribe" color="#b8a589" width={160} height={50} />
        </div>
      </div>
    </section>
  );
}
