import { NextRequest, NextResponse } from 'next/server';
import marketsData from '../../../../market-data.json';

const categoryInfo: Record<string, { name: string; description: string; emoji: string }> = {
  politics: {
    name: 'Politics',
    emoji: '🏛️',
    description: 'Elections, policy, and governance forecasts'
  },
  crypto: {
    name: 'Crypto',
    emoji: '₿',
    description: 'Bitcoin, Ethereum, DeFi, and blockchain predictions'
  },
  technology: {
    name: 'Technology',
    emoji: '💻',
    description: 'AI, startups, product launches, and tech trends'
  },
  economics: {
    name: 'Economics',
    emoji: '📈',
    description: 'Interest rates, inflation, GDP, and market forecasts'
  },
  sports: {
    name: 'Sports',
    emoji: '⚽',
    description: 'Championships, tournaments, and athletic achievements'
  },
  science: {
    name: 'Science',
    emoji: '🔬',
    description: 'Research, discoveries, and scientific breakthroughs'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.toLowerCase();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const info = categoryInfo[slug];
  if (!info) {
    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );
  }

  // Filter markets by category
  const categoryMarkets = marketsData.markets.filter(
    (market: any) => market.category.toLowerCase() === info.name.toLowerCase()
  );

  return NextResponse.json({
    slug,
    ...info,
    marketCount: categoryMarkets.length,
    markets: categoryMarkets
  });
}
