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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#b8a589]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
        <div className="flex justify-between items-center py-6 md:py-8">
          {/* Logo */}
          <Link
            href="/"
            className="group relative"
          >
            <span
              className="text-2xl md:text-3xl font-light tracking-[10px] text-white transition-colors duration-300 group-hover:text-[#b8a589]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              VELVET
            </span>
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#b8a589] transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-12 list-none">
            {['Collection', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="group relative text-gray-400 no-underline text-xs tracking-[3px] uppercase transition-colors duration-300 hover:text-white"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#b8a589] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Cart/Menu Icon */}
          <div className="flex items-center gap-6">
            {/* Shopping bag icon */}
            <button className="hidden md:block text-gray-400 hover:text-[#b8a589] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden text-white hover:text-[#b8a589] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom border on scroll */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="h-full bg-gradient-to-r from-transparent via-[#b8a589]/20 to-transparent" />
      </div>
    </nav>
  );
}
