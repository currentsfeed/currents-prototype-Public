'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MarketChart } from '@/components/MarketChart';
import { DistributionBar } from '@/components/DistributionBar';
import { MarketCard } from '@/components/MarketCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

interface MarketDetailData {
  id: string;
  slug: string;
  question: string;
  description: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  imageUrl: string;
  status: 'active' | 'resolved' | 'disputed';
  endDate: string;
  createdAt: string;
  createdBy: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  probability: {
    current: number;
    history: Array<{
      timestamp: string;
      value: number;
    }>;
  };
  positions: {
    yes: { users: number; volume: number };
    no: { users: number; volume: number };
  };
  resolution: {
    outcome: 'yes' | 'no' | null;
    resolvedAt: string | null;
    resolutionSource: string | null;
  };
  relatedMarkets: Array<{
    id: string;
    slug: string;
    question: string;
    imageUrl: string;
    probabilityCurrent: number;
    category: {
      name: string;
      slug: string;
    };
  }>;
  userPosition: {
    side: 'yes' | 'no';
    amount: number;
    entryProbability: number;
    pnl: number;
  } | null;
}

export default function MarketDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [market, setMarket] = useState<MarketDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    async function fetchMarket() {
      try {
        setLoading(true);
        const response = await fetch(`/api/markets/${slug}?timeRange=${timeRange}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch market');
        }

        const data = await response.json();
        setMarket(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setMarket(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMarket();
  }, [slug, timeRange]);

  // Loading state
  if (loading) {
    return <MarketDetailSkeleton />;
  }

  // Error state (404 or other)
  if (error || !market) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔍❌</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Market not found
          </h1>
          <p className="text-neutral-600 mb-6">
            This market might have been removed or the link is incorrect.
          </p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Explore Markets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Resolved market state
  const isResolved = market.status === 'resolved';
  const outcomeColor = market.resolution.outcome === 'yes' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Category Tag */}
          <Link 
            href={`/categories/${market.category.slug}`}
            className="inline-block"
          >
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{
                backgroundColor: `${market.category.color}1A`,
                color: market.category.color
              }}
            >
              {market.category.name}
            </span>
          </Link>

          {/* Resolved Badge (if applicable) */}
          {isResolved && (
            <div className={`mt-4 inline-block px-6 py-3 rounded-lg font-bold text-lg ${
              market.resolution.outcome === 'yes' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              Resolved: {market.resolution.outcome?.toUpperCase()}
            </div>
          )}

          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-4 leading-tight">
            {market.question}
          </h1>

          {/* Hero Image */}
          <div className="mt-6 relative w-full aspect-video rounded-xl overflow-hidden">
            <Image
              src={market.imageUrl}
              alt={market.question}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Probability & Status */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div 
                className={`inline-flex items-center px-6 py-4 rounded-xl font-mono text-5xl font-bold ${
                  market.probability.current >= 50 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {market.probability.current}% YES
              </div>
            </div>

            <div className="text-neutral-600">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {market.status === 'active' && (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                  </>
                )}
                {market.status === 'resolved' && (
                  <>
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Resolved
                  </>
                )}
                {market.status === 'disputed' && (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Disputed
                  </>
                )}
              </div>
              <div className="text-sm mt-1">
                {isResolved 
                  ? `Ended ${new Date(market.resolution.resolvedAt!).toLocaleDateString()}`
                  : `Ends ${new Date(market.endDate).toLocaleDateString()}`
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Analysis Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-4">
            The Analysis
          </h2>
          <div className="prose prose-lg max-w-none text-neutral-600">
            {market.description}
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-neutral-400">
            <span>by {market.createdBy.username}</span>
            <span>•</span>
            <span>Published {new Date(market.createdAt).toLocaleDateString()}</span>
          </div>
        </section>

        {/* Chart Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-4">
            Probability Over Time
          </h2>
          
          {/* Time Range Selector */}
          <div className="flex gap-2 mb-4">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {range === '7d' ? '7D' : range === '30d' ? '30D' : 'All'}
              </button>
            ))}
          </div>

          {market.probability.history.length > 0 ? (
            <MarketChart data={market.probability.history} />
          ) : (
            <div className="bg-neutral-100 rounded-xl p-12 text-center text-neutral-500 italic">
              Collecting data... Check back soon to see historical trends.
            </div>
          )}
        </section>

        {/* Positions Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-4">
            The Positions
          </h2>
          
          <DistributionBar
            yesPercentage={
              (market.positions.yes.volume / 
              (market.positions.yes.volume + market.positions.no.volume)) * 100 || 50
            }
          />

          <div className="mt-4 space-y-2 text-neutral-600">
            <div>
              <strong>
                {market.positions.yes.users + market.positions.no.users}
              </strong>{' '}
              users have taken positions
            </div>
            <div>
              <strong>
                ${(market.positions.yes.volume + market.positions.no.volume).toLocaleString()}
              </strong>{' '}
              in total volume
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400 italic">
            <span>🔒</span>
            <span>Individual positions are private</span>
          </div>
        </section>

        {/* User Position (if authenticated) */}
        {market.userPosition && (
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-neutral-900 mb-2">Your Position</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <div>
                Side: <strong className="uppercase">{market.userPosition.side}</strong>
              </div>
              <div>
                Amount: <strong>${market.userPosition.amount.toFixed(2)}</strong>
              </div>
              <div>
                Entry: <strong>{market.userPosition.entryProbability}%</strong>
              </div>
              <div className={market.userPosition.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                P&L: <strong>${market.userPosition.pnl.toFixed(2)}</strong>
              </div>
            </div>
          </section>
        )}

        {/* Related Markets */}
        {market.relatedMarkets.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-4">
              Related Markets
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {market.relatedMarkets.map((relatedMarket) => (
                <MarketCard
                  key={relatedMarket.id}
                  slug={relatedMarket.slug}
                  question={relatedMarket.question}
                  imageUrl={relatedMarket.imageUrl}
                  probability={relatedMarket.probabilityCurrent}
                  category={relatedMarket.category.name}
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link 
                href={`/categories/${market.category.slug}`}
                className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-2"
              >
                View all {market.category.name} markets →
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA (Mobile) */}
      {!isResolved && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-neutral-200 md:hidden z-50">
          <Button variant="primary" size="lg" fullWidth>
            Take Position
          </Button>
        </div>
      )}
    </div>
  );
}

// Loading skeleton
function MarketDetailSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 mt-4" />
          <Skeleton className="h-10 w-full mt-2" />
          <Skeleton className="w-full aspect-video mt-6 rounded-xl" />
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-16 w-40 rounded-xl" />
            <Skeleton className="h-16 w-32 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
