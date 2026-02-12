'use client';

import Link from 'next/link';
import Image from 'next/image';

interface MarketCardProps {
  slug: string;
  question: string;
  imageUrl: string;
  probability: number;
  category: string;
}

export function MarketCard({
  slug,
  question,
  imageUrl,
  probability,
  category
}: MarketCardProps) {
  return (
    <Link href={`/markets/${slug}`}>
      <div className="group bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={question}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Probability Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full font-mono font-bold text-sm shadow-md">
            {probability}% YES
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
            {category}
          </div>
          <h3 className="font-bold text-neutral-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {question}
          </h3>
        </div>
      </div>
    </Link>
  );
}
