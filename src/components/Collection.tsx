'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import ClothButton from './ClothButton';

const collections = [
  {
    id: 1,
    name: 'Silk Evening Dress',
    price: '$890',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
  },
  {
    id: 2,
    name: 'Cashmere Coat',
    price: '$1,250',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
  },
  {
    id: 3,
    name: 'Noir Collection',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80',
  },
  {
    id: 4,
    name: 'Velvet Blazer',
    price: '$720',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  },
  {
    id: 5,
    name: 'Midnight Gown',
    price: '$1,450',
    image: 'https://images.unsplash.com/photo-1518577915332-c2a19f149a75?w=500&q=80',
  },
  {
    id: 6,
    name: 'Classic Noir',
    price: '$540',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80',
  },
  {
    id: 7,
    name: 'Shadow Suit',
    price: '$980',
    image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=500&q=80',
  },
  {
    id: 8,
    name: 'Evening Elegance',
    price: '$760',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
  },
];

const CARD_WIDTH = 260;
const GAP = 24;
const ITEM_WIDTH = CARD_WIDTH + GAP;

export default function Collection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 300, damping: 40 });

  const totalWidth = collections.length * ITEM_WIDTH;
  const maxDrag = -(totalWidth - containerWidth + 100);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (isDragging) return;

    let animationId: number;
    let direction = -1;
    const speed = 0.3;

    const autoScroll = () => {
      const currentX = x.get();

      if (currentX <= maxDrag) {
        direction = 1;
      } else if (currentX >= 0) {
        direction = -1;
      }

      x.set(currentX + direction * speed);
      animationId = requestAnimationFrame(autoScroll);
    };

    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, [isDragging, x, maxDrag]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setTimeout(() => setIsDragging(false), 100);
  };

  const scrollTo = (direction: 'left' | 'right') => {
    const currentX = x.get();
    const moveAmount = ITEM_WIDTH * 3;
    const newX = direction === 'left'
      ? Math.min(0, currentX + moveAmount)
      : Math.max(maxDrag, currentX - moveAmount);

    animate(x, newX, { type: 'spring', stiffness: 300, damping: 40 });
  };

  return (
    <section id="collection" className="py-32 bg-[#0a0a0a] scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <motion.h2
          className="text-4xl md:text-5xl font-light text-center mb-4 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Featured Collection
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 text-xs tracking-[4px] uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Drag to explore
        </motion.p>
      </div>

      {/* Gallery */}
      <div ref={containerRef} className="relative px-6 md:px-12">
        {/* Navigation Arrows */}
        <button
          onClick={() => scrollTo('left')}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#1a1a1a] hover:bg-[#b8a589] transition-all duration-300 flex items-center justify-center border border-[#333] hover:border-[#b8a589]"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={() => scrollTo('right')}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#1a1a1a] hover:bg-[#b8a589] transition-all duration-300 flex items-center justify-center border border-[#333] hover:border-[#b8a589]"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Draggable Track */}
        <div className="overflow-hidden py-6">
          <motion.div
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            style={{ x: smoothX }}
            drag="x"
            dragConstraints={{ left: maxDrag, right: 0 }}
            dragElastic={0.05}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {collections.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 group"
                style={{ width: CARD_WIDTH }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111] rounded-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105 brightness-[0.85] group-hover:brightness-100"
                    sizes="260px"
                    draggable={false}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/80 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3
                      className="text-lg text-white/90 group-hover:text-white mb-1 transition-colors"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[#b8a589] text-sm tracking-wider">{item.price}</p>
                  </div>

                  {/* Subtle Border */}
                  <div className="absolute inset-0 rounded-sm border border-white/5 group-hover:border-[#b8a589]/30 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Edge Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-20" />
      </div>

      <motion.div
        className="text-center mt-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ClothButton text="View All" color="#333333" width={180} height={50} />
      </motion.div>
    </section>
  );
}
