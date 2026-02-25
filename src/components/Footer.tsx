import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 pb-12 px-8 bg-[#050505] text-center">
      <div
        className="text-2xl tracking-[8px] mb-10"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        VELVET
      </div>

      <div className="flex justify-center gap-12 mb-10">
        <Link
          href="#"
          className="text-gray-500 no-underline text-xs tracking-widest uppercase transition-colors hover:text-[#b8a589]"
        >
          Instagram
        </Link>
        <Link
          href="#"
          className="text-gray-500 no-underline text-xs tracking-widest uppercase transition-colors hover:text-[#b8a589]"
        >
          Pinterest
        </Link>
        <Link
          href="#"
          className="text-gray-500 no-underline text-xs tracking-widest uppercase transition-colors hover:text-[#b8a589]"
        >
          Twitter
        </Link>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-xs text-gray-600">
        <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
        <span>|</span>
        <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
        <span>|</span>
        <Link href="#" className="hover:text-gray-400 transition-colors">Shipping</Link>
      </div>

      <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto mb-8" />

      <p className="text-gray-700 text-[0.7rem] tracking-wide mb-8">
        &copy; 2025 VELVET. All rights reserved.
      </p>

      {/* Extra bottom padding space */}
      <div className="h-8" />
    </footer>
  );
}
