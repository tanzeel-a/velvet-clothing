'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
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

// Duplicate for infinite scroll effect
const extendedCollections = [...collections, ...collections];

function CollectionCard({ item, index }: { item: typeof collections[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="flex-shrink-0 w-[300px] md:w-[350px] group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] rounded-lg">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="350px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[#b8a589] text-xs tracking-[3px] uppercase mb-2">
            New Arrival
          </p>
          <h3
            className="text-xl text-white mb-2"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {item.name}
          </h3>
          <p className="text-[#b8a589] text-lg">{item.price}</p>
        </motion.div>

        <motion.div
          className="absolute inset-0 border-2 border-[#b8a589] rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export default function Collection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
          Handpicked pieces for the season
        </motion.p>
      </div>

      {/* Continuous Scroll Gallery */}
      <div ref={containerRef} className="relative h-[600px]">
        <motion.div
          className="absolute top-0 left-0 flex gap-8 px-8"
          style={{ x: smoothX }}
        >
          {extendedCollections.map((item, index) => (
            <CollectionCard key={`${item.id}-${index}`} item={item} index={index % collections.length} />
          ))}
        </motion.div>
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
