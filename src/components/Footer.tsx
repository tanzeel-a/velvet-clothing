import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-16 px-8 bg-[#050505] text-center">
      <div
        className="text-xl tracking-[6px] mb-8"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        VELVET
      </div>

      <div className="flex justify-center gap-10 mb-8">
        <Link
          href="#"
          className="text-gray-600 no-underline text-xs tracking-widest uppercase transition-colors hover:text-white"
        >
          Instagram
        </Link>
        <Link
          href="#"
          className="text-gray-600 no-underline text-xs tracking-widest uppercase transition-colors hover:text-white"
        >
          Pinterest
        </Link>
        <Link
          href="#"
          className="text-gray-600 no-underline text-xs tracking-widest uppercase transition-colors hover:text-white"
        >
          Twitter
        </Link>
      </div>

      <p className="text-gray-700 text-[0.7rem] tracking-wide">
        &copy; 2025 VELVET. All rights reserved.
      </p>
    </footer>
  );
}
