'use client';

import { useState } from 'react';
import ClothButton from './ClothButton';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  return (
    <section id="contact" className="py-40 px-8 md:px-16 bg-[#0a0a0a] min-h-[80vh] flex items-center justify-center scroll-mt-24">
      <div className="max-w-2xl w-full text-center">
        <h2
          className="text-4xl md:text-6xl font-light mb-6 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Stay Connected
        </h2>
        <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-10">
          Join our world of refined fashion
        </p>
        <p className="text-gray-400 leading-relaxed mb-12 text-lg">
          Be the first to know about new collections, exclusive events, and special
          offers curated just for you.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="email-input" className="sr-only">Email address</label>
          <input
            id="email-input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address for newsletter"
            className="px-8 py-5 bg-transparent border border-gray-700 text-white text-sm w-full sm:w-96 outline-none transition-all focus:border-[#b8a589] focus:shadow-[0_0_20px_rgba(184,165,137,0.2)]"
          />
          <ClothButton text="Subscribe" color="#b8a589" width={180} height={55} />
        </form>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-8" aria-hidden="true">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#b8a589]/30 to-transparent" />
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#b8a589]/50 to-transparent" />
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#b8a589]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
