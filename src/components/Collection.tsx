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
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
  },
  {
    id: 2,
    name: 'Cashmere Coat',
    price: '$1,250',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  },
  {
    id: 3,
    name: 'Linen Ensemble',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  },
  {
    id: 4,
    name: 'Velvet Blazer',
    price: '$720',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  },
  {
    id: 5,
    name: 'Summer Dress',
    price: '$450',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    id: 6,
    name: 'Classic Blouse',
    price: '$340',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  },
];

const CARD_WIDTH = 350;
const GAP = 32;
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

  // Auto-scroll when not interacting
  useEffect(() => {
    if (isDragging) return;

    let animationId: number;
    let direction = -1;
    const speed = 0.5;

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
    const moveAmount = ITEM_WIDTH * 2;
    const newX = direction === 'left'
      ? Math.min(0, currentX + moveAmount)
      : Math.max(maxDrag, currentX - moveAmount);

    animate(x, newX, { type: 'spring', stiffness: 300, damping: 40 });
  };

  return (
    <section id="collection" className="py-32 bg-[#0a0a0a] scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
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
          className="text-center text-gray-500 text-sm tracking-[3px] uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Drag to explore • Click arrows to navigate
        </motion.p>
      </div>

      {/* Gallery */}
      <div ref={containerRef} className="relative px-6 md:px-12">
        {/* Navigation Arrows */}
        <button
          onClick={() => scrollTo('left')}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/80 hover:bg-[#b8a589] transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-[#b8a589] hover:scale-110"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={() => scrollTo('right')}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/80 hover:bg-[#b8a589] transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-[#b8a589] hover:scale-110"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Draggable Track */}
        <div className="overflow-hidden py-8">
          <motion.div
            className="flex gap-8 cursor-grab active:cursor-grabbing"
            style={{ x: smoothX }}
            drag="x"
            dragConstraints={{ left: maxDrag, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {collections.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 group"
                style={{ width: CARD_WIDTH }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -15, scale: 1.02 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] rounded-xl shadow-2xl shadow-black/50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="350px"
                    draggable={false}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <p className="text-[#b8a589] text-xs tracking-[4px] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        New Arrival
                      </p>
                      <h3
                        className="text-2xl text-white mb-2"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-[#b8a589] text-xl tracking-wide">{item.price}</p>
                    </motion.div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-xl border-2 border-[#b8a589]/0 group-hover:border-[#b8a589]/60 transition-all duration-500 group-hover:shadow-[inset_0_0_30px_rgba(184,165,137,0.1)]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Edge Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-20" />
      </div>

      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ClothButton text="View All" color="#444444" width={200} height={55} />
      </motion.div>
    </section>
  );
}
