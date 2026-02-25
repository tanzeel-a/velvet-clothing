'use client';

import Image from 'next/image';
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
];

export default function Collection() {
  return (
    <section id="collection" className="py-32 px-8 md:px-16 bg-[#0a0a0a]">
      <h2
        className="text-4xl md:text-5xl font-light text-center mb-5 tracking-wide"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Featured Collection
      </h2>
      <p className="text-center text-gray-500 text-sm tracking-[3px] uppercase mb-16">
        Handpicked pieces for the season
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {collections.map((item) => (
          <div
            key={item.id}
            className="collection-item relative overflow-hidden aspect-[3/4] group cursor-pointer"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h3
                className="text-xl mb-1"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {item.name}
              </h3>
              <p className="text-[#b8a589] text-sm tracking-wide">{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <ClothButton text="View All" color="#333333" width={200} height={55} />
      </div>
    </section>
  );
}
