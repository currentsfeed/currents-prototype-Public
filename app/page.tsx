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

function HeroMarket({ market }: { market: Market }) {
  const yesPercent = market.currentBelief;
  const noPercent = 100 - market.currentBelief;
  
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden rounded-2xl">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      <div className="hero-gradient absolute inset-0" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
        {/* Top badges */}
        <div className="flex items-center gap-3">
          <span className="badge badge-category">{market.category}</span>
          {market.status === 'closing_soon' && (
            <span className="badge badge-closing">Closing Soon</span>
          )}
        </div>
        
        {/* Bottom content */}
        <div>
          <h1 className="text-headline-hero text-white mb-6 max-w-4xl">
            {market.question}
          </h1>
          
          <p className="text-body mb-8 max-w-2xl">
            {market.description}
          </p>
          
          {/* YES/NO Chart */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-green-positive text-sm font-semibold">YES</span>
                <span className="text-green-positive text-2xl font-bold">{yesPercent}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-negative text-2xl font-bold">{noPercent}%</span>
                <span className="text-red-negative text-sm font-semibold">NO</span>
              </div>
            </div>
            
            <div className="probability-bar">
              <div className="flex h-full">
                <div className="probability-fill-yes" style={{ width: `${yesPercent}%` }} />
                <div className="probability-fill-no" style={{ width: `${noPercent}%` }} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-caption">
            <span>{market.participants.toLocaleString()} votes</span>
            <span>•</span>
            <span>{new Date(market.closingDate).toLocaleDateString()}</span>
            <button className="text-cta-primary hover:underline ml-2">Place Answer →</button>
          </div>
        </div>
        
        {/* Large percentage overlay (top right) */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
          <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="percentage-large text-white">{yesPercent}%</div>
            <div className="text-caption">Lean to Yes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketCard({ market, size = 'medium' }: { market: Market; size?: 'small' | 'medium' | 'large' }) {
  const yesPercent = market.currentBelief;
  const noPercent = 100 - market.currentBelief;
  
  const heightClass = size === 'large' ? 'h-[400px]' : size === 'medium' ? 'h-[350px]' : 'h-[300px]';
  
  return (
    <article className={`card-dark relative ${heightClass} flex flex-col`}>
      {/* Image background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-50" />
      <div className="hero-gradient absolute inset-0" />
      
      {/* Content */}
      <div className="relative flex flex-col h-full p-6 justify-between">
        {/* Top badges */}
        <div className="flex items-center justify-between">
          <span className="badge badge-category">{market.category}</span>
          <div className="percentage-medium text-white">{yesPercent}%</div>
        </div>
        
        {/* Bottom content */}
        <div>
          <h3 className="text-headline-medium text-white mb-4 leading-tight">
            {market.question}
          </h3>
          
          {/* YES/NO Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-green-positive text-xs font-semibold">YES</span>
                <span className="text-green-positive text-lg font-bold">{yesPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-negative text-lg font-bold">{noPercent}%</span>
                <span className="text-red-negative text-xs font-semibold">NO</span>
              </div>
            </div>
            
            <div className="probability-bar">
              <div className="flex h-full">
                <div className="probability-fill-yes" style={{ width: `${yesPercent}%` }} />
                <div className="probability-fill-no" style={{ width: `${noPercent}%` }} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-caption">
            <span>{market.participants.toLocaleString()} votes</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function StreamItem({ market }: { market: Market }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-dark-card rounded-xl hover:bg-dark-elevated transition-colors">
      <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate mb-1">
          {market.question}
        </h4>
        <div className="flex items-center gap-2 text-caption">
          <span>{market.category}</span>
          <span>•</span>
          <span>{market.participants.toLocaleString()} votes</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <div className="text-lg font-bold text-white">{market.currentBelief}%</div>
          <div className="text-xs text-green-positive">+{Math.abs(market.delta).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const markets = marketData.markets as Market[];
  
  const categories = ['All', 'Politics', 'Technology', 'Entertainment', 'Sports', 'Finance', 'Media'];
  
  const filteredMarkets = activeCategory === 'All' 
    ? markets 
    : markets.filter(m => m.category.toLowerCase() === activeCategory.toLowerCase());
  
  const heroMarket = filteredMarkets[0];
  const gridMarkets = filteredMarkets.slice(1, 9);
  const streamMarkets = filteredMarkets.slice(9, 15);
  
  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-primary/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cta-primary rounded-full" />
                <h1 className="text-xl font-bold text-white">Currents</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                {['Currents', 'Feed', 'All Markets'].map((item) => (
                  <button
                    key={item}
                    className={item === 'Currents' ? 'tab tab-active' : 'tab'}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="btn-secondary text-sm">Sign In</button>
              <button className="btn-primary text-sm">Sign Up</button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Market */}
        <section className="mb-12">
          <HeroMarket market={heroMarket} />
        </section>
        
        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? 'tab tab-active' : 'tab'}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Market Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {gridMarkets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </section>
        
        {/* The Stream */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">The Stream</h2>
            <button className="text-cta-primary text-sm font-semibold hover:underline">
              View all →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streamMarkets.map(market => (
              <StreamItem key={market.id} market={market} />
            ))}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-caption">
            <p>Where collective knowledge creates the present moment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
