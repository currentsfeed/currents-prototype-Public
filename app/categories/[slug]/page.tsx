'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Market {
  id: string;
  question: string;
  description: string;
  category: string;
  currentBelief: number;
  delta: number;
  deltaDirection: string;
  participants: number;
  status: string;
  imageUrl: string;
  closingDate: string;
}

interface CategoryData {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  marketCount: number;
  markets: Market[];
}

type FilterType = 'all' | 'open' | 'resolved';
type SortType = 'popular' | 'recent' | 'belief';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('popular');

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/categories/${slug}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('Category not found');
          } else {
            setError('Failed to load category');
          }
          return;
        }

        const categoryData = await res.json();
        setData(categoryData);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug]);

  // Filter and sort markets
  const filteredMarkets = data?.markets.filter(market => {
    if (filter === 'all') return true;
    return market.status === filter;
  }) || [];

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    if (sort === 'popular') return b.participants - a.participants;
    if (sort === 'belief') return b.currentBelief - a.currentBelief;
    // For 'recent', keep original order (mock data)
    return 0;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 w-64 bg-neutral-800 rounded mb-4" />
            <div className="h-6 w-96 bg-neutral-800 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-neutral-800 rounded" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-3xl font-bold mb-4">{error || 'Category not found'}</h1>
          <p className="text-neutral-400 mb-8">
            This category doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Home
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{data.emoji}</span>
            <div>
              <h1 className="text-4xl font-bold">{data.name}</h1>
              <p className="text-neutral-400">{data.marketCount} markets</p>
            </div>
          </div>
          <p className="text-lg text-neutral-300">{data.description}</p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-900 border border-neutral-800 hover:border-orange-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'open'
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-900 border border-neutral-800 hover:border-orange-500'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'resolved'
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-900 border border-neutral-800 hover:border-orange-500'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Sort */}
          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="belief">Highest Belief</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Markets Grid */}
        {sortedMarkets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-2">No markets found</h2>
            <p className="text-neutral-400">
              {filter === 'all'
                ? 'This category has no markets yet.'
                : `No ${filter} markets in this category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMarkets.map(market => (
              <Link
                key={market.id}
                href={`/markets/${market.id}`}
                className="block bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-orange-500 transition-all"
              >
                {/* Market Image */}
                <div className="relative aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    {data.emoji}
                  </div>
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    {market.currentBelief}% YES
                  </div>
                  {market.status === 'resolved' && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Resolved
                    </div>
                  )}
                </div>
                
                {/* Market Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {market.question}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <span>{market.participants.toLocaleString()} participants</span>
                    <span className={`flex items-center gap-1 ${
                      market.deltaDirection === 'up' ? 'text-green-500' :
                      market.deltaDirection === 'down' ? 'text-red-500' :
                      'text-neutral-400'
                    }`}>
                      {market.deltaDirection === 'up' && '↑'}
                      {market.deltaDirection === 'down' && '↓'}
                      {market.delta > 0 && `${market.delta}%`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
