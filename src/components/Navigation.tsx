'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-16 py-6 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-sm' : 'bg-gradient-to-b from-[#0a0a0a]/90 to-transparent'
      }`}
    >
      <Link
        href="/"
        className="font-[var(--font-cormorant)] text-2xl font-light tracking-[8px] text-white"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        VELVET
      </Link>

      <ul className="hidden md:flex gap-10 list-none">
        <li>
          <Link
            href="#collection"
            className="text-gray-400 no-underline text-xs tracking-widest uppercase transition-colors hover:text-white"
          >
            Collection
          </Link>
        </li>
        <li>
          <Link
            href="#about"
            className="text-gray-400 no-underline text-xs tracking-widest uppercase transition-colors hover:text-white"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="#contact"
            className="text-gray-400 no-underline text-xs tracking-widest uppercase transition-colors hover:text-white"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Mobile menu button */}
      <button className="md:hidden text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </nav>
  );
}
