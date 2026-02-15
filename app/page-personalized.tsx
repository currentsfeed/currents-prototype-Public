'use client';

import { useState, useEffect } from 'react';
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

type FeedSection = {
  type: 'personalized' | 'trending' | 'exploration';
  title: string;
  subtitle?: string;
  markets: Market[];
};

type PersonalizedFeedResponse = {
  hero: Market;
  sections: FeedSection[];
  metadata: {
    composed: string;
    userId: string;
    userProfile: string;
    diversityScore: number;
  };
};

function HeroMarket({ market, onPlaceAnswer }: { market: Market; onPlaceAnswer: (market: Market) => void }) {
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
              onClick={() => onPlaceAnswer(market)}
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

function MarketCard({ market, onPlaceAnswer, reason }: { market: Market; onPlaceAnswer: (market: Market) => void; reason?: string }) {
  const yesPercent = market.currentBelief;
  const noPercent = 100 - market.currentBelief;
  
  return (
    <article 
      className="market-card cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => onPlaceAnswer(market)}
    >
      <div className="card-image" />
      <div className="card-gradient" />
      
      <div className="card-content">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-category">{market.category}</span>
            <div className="percentage-medium">{yesPercent}%</div>
          </div>
          
          <h3 className="text-h3 mb-4">{market.question}</h3>
          
          {reason && (
            <p className="text-xs mb-2 opacity-60">{reason}</p>
          )}
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

export default function PersonalizedHome() {
  const [activeProfile, setActiveProfile] = useState('user-crypto-1');
  const [feedData, setFeedData] = useState<PersonalizedFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  
  const profiles = [
    { id: 'guest', name: 'Guest' },
    { id: 'user-crypto-1', name: 'Crypto Enthusiast' },
    { id: 'user-politics-1', name: 'Politics Junkie' },
    { id: 'user-sports-1', name: 'Sports Fan' },
    { id: 'user-tech-1', name: 'Tech Nerd' },
    { id: 'user-generalist-1', name: 'Generalist' }
  ];
  
  useEffect(() => {
    fetchFeed();
  }, [activeProfile]);
  
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feed/personalized?userId=${activeProfile}`);
      const data = await response.json();
      setFeedData(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePlaceAnswer = (market: Market) => {
    setSelectedMarket(market);
    setIsPositionModalOpen(true);
  };
  
  const getReasonForMarket = (sectionType: string, category: string): string => {
    if (sectionType === 'personalized') {
      return `Because you're interested in ${category}`;
    } else if (sectionType === 'trending') {
      return `Trending on Currents`;
    } else {
      return `New topic to explore`;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="text-2xl mb-2">Loading your personalized feed...</div>
          <div className="text-small opacity-60">Analyzing your interests</div>
        </div>
      </div>
    );
  }
  
  if (!feedData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center text-red-500">Failed to load feed</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      
      {/* Profile Selector (Test UI) */}
      <div className="bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.1)] py-4">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold opacity-60">TEST MODE - Select Profile:</span>
            <div className="flex gap-2 flex-wrap">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setActiveProfile(profile.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeProfile === profile.id
                      ? 'bg-[var(--accent-brand)] text-white'
                      : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {profile.name}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs mt-2 opacity-50">
            Diversity Score: {(feedData.metadata.diversityScore * 100).toFixed(1)}% | 
            User: {feedData.metadata.userId}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Hero Market */}
        <HeroMarket 
          market={feedData.hero} 
          onPlaceAnswer={handlePlaceAnswer}
        />
        
        {/* Personalized Sections */}
        {feedData.sections.map((section, idx) => (
          <section key={idx} className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h2">{section.title}</h2>
                {section.subtitle && (
                  <p className="text-small opacity-60 mt-1">{section.subtitle}</p>
                )}
              </div>
            </div>
            
            <div 
              className="grid gap-6"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
              }}
            >
              {section.markets.map(market => (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  onPlaceAnswer={handlePlaceAnswer}
                  reason={getReasonForMarket(section.type, market.category)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      
      {/* Footer */}
      <footer className="border-t mt-16" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <p className="text-center text-small">
            Where collective knowledge creates the present moment
          </p>
        </div>
      </footer>

      {/* Position Modal */}
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
