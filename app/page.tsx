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
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 12H10M4 12V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function StatusBadge({ status }: { status: 'open' | 'closing_soon' | 'resolved' }) {
  const styles = {
    open: 'bg-[#4A90E2] text-white',
    closing_soon: 'bg-[#E8A34D] text-white',
    resolved: 'bg-[#7B8794] text-white'
  };

  const labels = {
    open: 'OPEN',
    closing_soon: 'CLOSING SOON',
    resolved: 'RESOLVED'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-[11px] font-semibold tracking-wider uppercase rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function BeliefIndicator({ delta, direction }: { delta: number; direction: 'up' | 'down' | 'stable' }) {
  const colors = {
    up: 'text-[#2D6A4F]',
    down: 'text-[#9D5B4E]',
    stable: 'text-[#5B6B7E]'
  };

  const sign = direction === 'up' ? '+' : direction === 'down' ? '' : '~';
  
  return (
    <div className={`flex items-center gap-1 ${colors[direction]}`}>
      <TrendIcon direction={direction} />
      <span className="text-sm font-medium">
        {sign}{Math.abs(delta).toFixed(1)}%
      </span>
    </div>
  );
}

function HeroMarketCard({ market }: { market: Market }) {
  return (
    <article className="bg-white rounded-lg shadow-[0px_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.12)] transition-shadow overflow-hidden">
      {/* Image placeholder */}
      <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <span className="text-slate-500 text-sm font-medium">{market.category}</span>
      </div>
      
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={market.status} />
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">{market.category}</span>
          </div>
          <BeliefIndicator delta={market.delta} direction={market.deltaDirection} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-4 text-[#1A1D23]">
          {market.question}
        </h1>

        <p className="text-base text-[#6B7280] leading-relaxed mb-6">
          {market.description}
        </p>

        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Current Belief</div>
            <div className="font-mono text-5xl font-semibold text-[#1A1D23]">
              {market.currentBelief}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#6B7280]">
              {market.participants.toLocaleString()} people positioned
            </div>
          </div>
        </div>

        <button className="w-full bg-[#2C4A6B] hover:bg-[#1E3447] text-white py-3 px-6 rounded-lg font-medium text-base transition-colors">
          View Market
        </button>
      </div>
    </article>
  );
}

function MarketCard({ market }: { market: Market }) {
  return (
    <article className="bg-white rounded-lg shadow-[0px_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.12)] transition-shadow overflow-hidden h-full flex flex-col">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
        <span className="text-slate-500 text-sm font-medium">{market.category}</span>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={market.status} />
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold">{market.category}</span>
          </div>
          <BeliefIndicator delta={market.delta} direction={market.deltaDirection} />
        </div>

        <h3 className="font-serif text-xl font-semibold leading-tight mb-3 text-[#1A1D23] flex-grow">
          {market.question}
        </h3>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Current Belief</div>
            <div className="font-mono text-3xl font-semibold text-[#1A1D23]">
              {market.currentBelief}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#6B7280]">
              {market.participants.toLocaleString()} positioned
            </div>
          </div>
        </div>

        <button className="w-full bg-[#2C4A6B] hover:bg-[#1E3447] text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors mt-auto">
          View Market
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const markets = marketData.markets as Market[];
  const heroMarket = markets[0];
  const gridMarkets = markets.slice(1, 7); // Show 6 markets in grid

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-serif text-3xl font-semibold text-[#1A1D23]">Currents</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Market */}
        <section className="mb-12">
          <HeroMarketCard market={heroMarket} />
        </section>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl font-semibold text-[#1A1D23]">Browse Markets</h2>
        </div>

        {/* Market Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridMarkets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </section>

        {/* View More */}
        <div className="mt-8 text-center">
          <button className="bg-[#8B7EA8] hover:bg-[#6F5F8A] text-white py-3 px-8 rounded-lg font-medium text-base transition-colors">
            View All Markets
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-[#6B7280] text-center">
            Currents Prototype — Editorial prediction markets
          </p>
        </div>
      </footer>
    </div>
  );
}
