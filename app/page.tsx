'use client';

import { useState } from 'react';
import marketData from '../market-data.json';

type Market = {
  id: string;
  question: string;
  description: string;
  category: string;
  currentBelief: number;
  delta: number;
  deltaDirection: 'up' | 'down' | 'stable';
  participants: number;
  status: 'open' | 'closing_soon' | 'resolved';
  imageUrl: string;
  closingDate: string;
};

function TrendIcon({ direction }: { direction: 'up' | 'down' | 'stable' }) {
  if (direction === 'up') {
    return (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 4L4 12M4 12H10M4 12V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function StatusBadge({ status }: { status: 'open' | 'closing_soon' | 'resolved' }) {
  const styles = {
    open: 'badge-open',
    closing_soon: 'badge-closing-soon',
    resolved: 'badge-resolved'
  };

  const labels = {
    open: 'OPEN',
    closing_soon: 'CLOSING SOON',
    resolved: 'RESOLVED'
  };

  return (
    <span className={styles[status]} role="status">
      {labels[status]}
    </span>
  );
}

function BeliefIndicator({ delta, direction }: { delta: number; direction: 'up' | 'down' | 'stable' }) {
  const trendClass = {
    up: 'trend-increasing',
    down: 'trend-decreasing',
    stable: 'trend-stable'
  }[direction];

  const labels = {
    up: 'Rising',
    down: 'Falling',
    stable: 'Steady'
  };

  const sign = direction === 'up' ? '+' : direction === 'down' ? '' : '~';
  
  return (
    <div className={trendClass}>
      <TrendIcon direction={direction} />
      <span className="text-body-small font-medium">
        {sign}{Math.abs(delta).toFixed(1)}%
      </span>
      <span className="sr-only">{labels[direction]}</span>
    </div>
  );
}

function HeroMarketCard({ market }: { market: Market }) {
  return (
    <article className="card">
      {/* Image */}
      <div className="w-full h-80 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <span className="text-text-tertiary text-body-small font-medium">{market.category}</span>
      </div>
      
      <div className="p-8 lg:p-10">
        {/* Metadata row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <StatusBadge status={market.status} />
            <span className="text-label text-text-tertiary uppercase tracking-wider font-semibold">
              {market.category}
            </span>
          </div>
          <BeliefIndicator delta={market.delta} direction={market.deltaDirection} />
        </div>

        {/* Headline */}
        <h1 className="text-headline-1 mb-6">
          {market.question}
        </h1>

        {/* Description */}
        <p className="text-body-large text-text-secondary leading-relaxed mb-8">
          {market.description}
        </p>

        {/* Stats */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-body-small text-text-secondary mb-2">Current Belief</div>
            <div className="number text-number-hero text-text-primary">
              {market.currentBelief}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-body-small text-text-secondary">
              {market.participants.toLocaleString()} people positioned
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="btn-primary w-full" aria-label={`View market: ${market.question}`}>
          View Market
        </button>
      </div>
    </article>
  );
}

function MarketCard({ market }: { market: Market }) {
  return (
    <article className="card h-full flex flex-col">
      {/* Image */}
      <div className="w-full h-56 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
        <span className="text-text-tertiary text-caption font-medium">{market.category}</span>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Metadata row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <StatusBadge status={market.status} />
            <span className="text-label text-text-tertiary uppercase tracking-wider font-semibold">
              {market.category}
            </span>
          </div>
          <BeliefIndicator delta={market.delta} direction={market.deltaDirection} />
        </div>

        {/* Headline */}
        <h3 className="text-headline-4 mb-4 flex-grow">
          {market.question}
        </h3>

        {/* Stats */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-caption text-text-secondary mb-1">Current Belief</div>
            <div className="number text-number-medium text-text-primary">
              {market.currentBelief}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-caption text-text-secondary">
              {market.participants.toLocaleString()} positioned
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="btn-primary w-full text-body-small py-2.5" aria-label={`View market: ${market.question}`}>
          View Market
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'browse' | 'trending' | 'closing'>('browse');
  const markets = marketData.markets as Market[];
  const heroMarket = markets[0];
  
  // Filter markets based on active tab
  const filteredMarkets = (() => {
    switch (activeTab) {
      case 'trending':
        return markets.slice(1).filter(m => Math.abs(m.delta) > 2);
      case 'closing':
        return markets.slice(1).filter(m => m.status === 'closing_soon');
      default:
        return markets.slice(1, 7); // Browse: show first 6
    }
  })();

  const tabs = [
    { id: 'browse' as const, label: 'Browse' },
    { id: 'trending' as const, label: 'Trending' },
    { id: 'closing' as const, label: 'Closing Soon' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <h1 className="text-headline-2">Currents</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Market */}
        <section className="mb-12 md:mb-16">
          <HeroMarketCard market={heroMarket} />
        </section>

        {/* Section Header with Tabs */}
        <div className="mb-8">
          <h2 className="text-headline-2 mb-6">Markets</h2>
          
          {/* Tabs */}
          <div className="border-b border-border" role="tablist">
            <div className="flex gap-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    pb-4 text-body font-medium transition-colors relative
                    ${activeTab === tab.id 
                      ? 'text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Grid */}
        <section 
          role="tabpanel" 
          id={`panel-${activeTab}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMarkets.length > 0 ? (
            filteredMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-body text-text-secondary">
                No markets in this category yet.
              </p>
            </div>
          )}
        </section>

        {/* View More */}
        {filteredMarkets.length > 0 && (
          <div className="mt-10 text-center">
            <button className="btn-secondary">
              View All Markets
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-caption text-text-secondary text-center">
            Currents Prototype — Editorial prediction markets
          </p>
        </div>
      </footer>
    </div>
  );
}
