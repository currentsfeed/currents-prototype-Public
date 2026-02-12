'use client';

import { useState } from 'react';
import marketData from '../market-data.json';
import AuthModal from '../components/AuthModal';
import PositionModal from '../components/PositionModal';

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
    <section className="hero">
      <div className="hero-image" />
      <div className="hero-gradient" />
      
      <div className="hero-content">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="badge badge-category">{market.category}</span>
            {market.status === 'closing_soon' && (
              <span className="badge badge-closing">CLOSING SOON</span>
            )}
          </div>
          
          <h1 className="text-hero mb-4">
            {market.question}
          </h1>
          
          <p className="text-body mb-8 max-w-2xl">
            {market.description}
          </p>
        </div>
        
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-green)' }}>YES</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--accent-green)' }}>{yesPercent}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold" style={{ color: 'var(--accent-red)' }}>{noPercent}%</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-red)' }}>NO</span>
              </div>
            </div>
            
            <div className="probability-bar">
              <div className="probability-bar-inner">
                <div className="probability-fill-yes" style={{ width: `${yesPercent}%` }} />
                <div className="probability-fill-no" style={{ width: `${noPercent}%` }} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-small">
            <span>{market.participants.toLocaleString()} votes</span>
            <span>•</span>
            <span>{market.closingDate}</span>
            <button 
              onClick={() => { setSelectedMarket(market); setIsPositionModalOpen(true); }}
              className="ml-2 font-semibold" 
              style={{ color: 'var(--accent-brand)' }}
            >
              Place Answer →
            </button>
          </div>
        </div>
      </div>
      
      <div className="hero-percentage">
        <div className="percentage-hero">{yesPercent}%</div>
        <div className="text-small mt-2">Lean to Yes</div>
      </div>
    </section>
  );
}

function MarketCard({ market }: { market: Market }) {
  const yesPercent = market.currentBelief;
  const noPercent = 100 - market.currentBelief;
  
  return (
    <article className="market-card">
      <div className="card-image" />
      <div className="card-gradient" />
      
      <div className="card-content">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-category">{market.category}</span>
            <div className="percentage-medium">{yesPercent}%</div>
          </div>
          
          <h3 className="text-h3 mb-4">{market.question}</h3>
        </div>
        
        <div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>YES</span>
                <span className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>{yesPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: 'var(--accent-red)' }}>{noPercent}%</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-red)' }}>NO</span>
              </div>
            </div>
            
            <div className="probability-bar">
              <div className="probability-bar-inner">
                <div className="probability-fill-yes" style={{ width: `${yesPercent}%` }} />
                <div className="probability-fill-no" style={{ width: `${noPercent}%` }} />
              </div>
            </div>
          </div>
          
          <div className="text-small">
            {market.participants.toLocaleString()} votes
          </div>
        </div>
      </div>
    </article>
  );
}

function StreamItem({ market }: { market: Market }) {
  return (
    <div className="stream-item">
      <div className="stream-thumbnail" />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold mb-1 truncate">{market.question}</h4>
        <div className="text-small">
          {market.category} • {market.participants.toLocaleString()} votes
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <div className="text-xl font-bold mb-1">{market.currentBelief}%</div>
        <div className="text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>
          +{Math.abs(market.delta).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  
  const markets = marketData.markets as Market[];
  
  const categories = ['All', 'Politics', 'Technology', 'Entertainment', 'Sports', 'Finance', 'Media'];
  
  const filteredMarkets = activeCategory === 'All' 
    ? markets 
    : markets.filter(m => m.category.toLowerCase() === activeCategory.toLowerCase());
  
  const heroMarket = filteredMarkets[0];
  const gridMarkets = filteredMarkets.slice(1, 9);
  const streamMarkets = filteredMarkets.slice(9, 15);
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="header">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{ background: 'var(--accent-brand)' }} />
                <span className="text-xl font-bold">Currents</span>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                <button className="tab tab-active">Currents</button>
                <button className="tab">Feed</button>
                <button className="tab">All Markets</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }}
                className="btn-secondary text-sm px-4 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                className="btn-primary text-sm px-4 py-2"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Hero Market */}
        <HeroMarket market={heroMarket} />
        
        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 pb-2">
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
        <section 
          className="grid gap-6 mb-16"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
          }}
        >
          {gridMarkets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </section>
        
        {/* The Stream */}
        {streamMarkets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2">The Stream</h2>
              <button className="text-sm font-semibold" style={{ color: 'var(--accent-brand)' }}>
                View all →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {streamMarkets.map(market => (
                <StreamItem key={market.id} market={market} />
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t mt-16" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <p className="text-center text-small">
            Where collective knowledge creates the present moment
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
      
      {selectedMarket && (
        <PositionModal
          isOpen={isPositionModalOpen}
          onClose={() => setIsPositionModalOpen(false)}
          marketId={selectedMarket.id}
          marketQuestion={selectedMarket.question}
          initialProbability={selectedMarket.currentBelief}
        />
      )}
    </div>
  );
}
