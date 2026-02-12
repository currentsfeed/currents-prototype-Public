import { NextRequest, NextResponse } from 'next/server';

// Market detail interface matching frontend expectations
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

// Category color mapping
const categoryColors: Record<string, string> = {
  Politics: '#3B82F6',
  Crypto: '#F59E0B',
  Technology: '#8B5CF6',
  Economics: '#10B981',
  Entertainment: '#EC4899',
  Geopolitics: '#EF4444',
  Science: '#06B6D4',
  Sports: '#F97316'
};

// Mock probability history generator
function generateProbabilityHistory(
  current: number,
  timeRange: '7d' | '30d' | 'all'
): Array<{ timestamp: string; value: number }> {
  const now = new Date();
  const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const dataPoints = timeRange === '7d' ? 14 : timeRange === '30d' ? 30 : 90;
  
  const history: Array<{ timestamp: string; value: number }> = [];
  const startValue = current - 15 + Math.random() * 20; // Start within ±15% of current
  
  for (let i = 0; i < dataPoints; i++) {
    const daysAgo = daysBack * (1 - i / dataPoints);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Generate smooth probability curve with some randomness
    const progress = i / dataPoints;
    const variance = (Math.random() - 0.5) * 8; // ±4% variance
    const value = Math.max(5, Math.min(95, startValue + (current - startValue) * progress + variance));
    
    history.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value)
    });
  }
  
  return history;
}

// Mock market data
const mockMarkets: Record<string, Partial<MarketDetailData>> = {
  'trump-2024-election': {
    id: 'm1',
    slug: 'trump-2024-election',
    question: 'Will Donald Trump win the 2024 US Presidential election?',
    description: `Donald Trump's path to the White House in 2024 depends on multiple factors: Republican primary performance, general election matchups, economic conditions, and ongoing legal challenges.

**Key Considerations:**
- **Primary Position:** Trump maintains strong support among Republican base voters
- **Legal Challenges:** Multiple indictments and court cases could impact candidacy
- **Electoral Math:** Must flip key swing states from 2020 results
- **Economic Factors:** Voter sentiment on economy typically drives incumbent performance

**Historical Context:** Trump won in 2016 with 304 electoral votes but lost in 2020 with 232 votes. Recent polling suggests a competitive race in battleground states.

This market resolves YES if Donald Trump is certified as the winner of the 2024 Presidential election by December 31, 2024.`,
    category: {
      id: 'c1',
      name: 'Politics',
      slug: 'politics',
      color: categoryColors.Politics
    },
    imageUrl: '/markets/trump.jpg',
    status: 'active',
    endDate: '2024-11-05T23:59:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: {
      id: 'u1',
      username: 'politicalobserver',
      avatarUrl: '/avatars/default.jpg'
    },
    probability: {
      current: 48,
      history: [] // Will be generated dynamically based on timeRange
    },
    positions: {
      yes: { users: 6423, volume: 342850 },
      no: { users: 6424, volume: 358190 }
    },
    resolution: {
      outcome: null,
      resolvedAt: null,
      resolutionSource: null
    },
    relatedMarkets: [
      {
        id: 'm4',
        slug: 'fed-rate-cut-q2-2024',
        question: 'Will interest rates be cut by the Fed in Q2 2024?',
        imageUrl: '/markets/fed.jpg',
        probabilityCurrent: 71,
        category: { name: 'Economics', slug: 'economics' }
      },
      {
        id: 'm6',
        slug: 'russia-ukraine-ceasefire-2024',
        question: 'Will Russia and Ukraine sign a ceasefire agreement in 2024?',
        imageUrl: '/markets/ukraine.jpg',
        probabilityCurrent: 19,
        category: { name: 'Geopolitics', slug: 'geopolitics' }
      }
    ],
    userPosition: null
  },
  'bitcoin-100k-2024': {
    id: 'm2',
    slug: 'bitcoin-100k-2024',
    question: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: `Bitcoin's path to six figures depends on institutional adoption, regulatory clarity, and macroeconomic conditions.

**Key Factors:**
- **ETF Flows:** Spot Bitcoin ETF approvals driving institutional demand
- **Halving Event:** April 2024 halving historically preceded bull runs
- **Macro Environment:** Fed policy, inflation, and risk appetite
- **Adoption Metrics:** On-chain activity, exchange reserves, long-term holder behavior

This market resolves YES if Bitcoin (BTC/USD) trades at or above $100,000 on any major exchange (Coinbase, Binance, Kraken) before December 31, 2024, 23:59:59 UTC.`,
    category: {
      id: 'c2',
      name: 'Crypto',
      slug: 'crypto',
      color: categoryColors.Crypto
    },
    imageUrl: '/markets/bitcoin.jpg',
    status: 'active',
    endDate: '2024-12-31T23:59:00Z',
    createdAt: '2024-01-20T14:15:00Z',
    createdBy: {
      id: 'u2',
      username: 'cryptoanalyst',
      avatarUrl: '/avatars/default.jpg'
    },
    probability: {
      current: 62,
      history: []
    },
    positions: {
      yes: { users: 4471, volume: 521340 },
      no: { users: 4471, volume: 298750 }
    },
    resolution: {
      outcome: null,
      resolvedAt: null,
      resolutionSource: null
    },
    relatedMarkets: [],
    userPosition: null
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('timeRange') || '30d') as '7d' | '30d' | 'all';

    // Find market by slug
    const marketData = mockMarkets[slug];

    if (!marketData) {
      return NextResponse.json(
        {
          code: 'MARKET_NOT_FOUND',
          message: `Market with slug "${slug}" not found`,
          requestId: crypto.randomUUID()
        },
        { status: 404 }
      );
    }

    // Generate probability history based on timeRange
    const probabilityHistory = generateProbabilityHistory(
      marketData.probability!.current,
      timeRange
    );

    // Build complete market response
    const market: MarketDetailData = {
      ...marketData as MarketDetailData,
      probability: {
        current: marketData.probability!.current,
        history: probabilityHistory
      }
    };

    return NextResponse.json(market, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching market:', error);
    
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}
