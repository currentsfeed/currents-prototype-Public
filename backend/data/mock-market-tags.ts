// Market Tags - Multi-dimensional content tagging

import { MarketTags } from '../types/recommendation';

/**
 * Map of market IDs to their tags
 */
export const marketTagsData: Record<string, MarketTags> = {
  // m1: Trump 2024 election
  m1: {
    category: 'Politics',
    actors: ['Trump', 'Biden', 'Republican Party'],
    angle: 'Election Coverage',
    eventType: 'Election'
  },

  // m2: Bitcoin $100k
  m2: {
    category: 'Crypto',
    actors: ['Bitcoin', 'BTC', 'Cryptocurrency'],
    angle: 'Price Prediction',
    eventType: 'Price Movement'
  },

  // m3: GPT-5 release
  m3: {
    category: 'Technology',
    actors: ['OpenAI', 'GPT-5', 'Sam Altman'],
    angle: 'Product Launch',
    eventType: 'Product Launch'
  },

  // m4: Fed interest rate cut
  m4: {
    category: 'Economics',
    actors: ['Federal Reserve', 'Fed', 'Jerome Powell'],
    angle: 'Policy Analysis',
    eventType: 'Legislation'
  },

  // m5: Taylor Swift & Travis Kelce engagement
  m5: {
    category: 'Entertainment',
    actors: ['Taylor Swift', 'Travis Kelce', 'NFL'],
    angle: 'Celebrity Gossip',
    eventType: 'Personal Life'
  },

  // m6: Russia-Ukraine ceasefire
  m6: {
    category: 'Geopolitics',
    actors: ['Russia', 'Ukraine', 'Putin', 'Zelensky'],
    angle: 'Conflict Resolution',
    eventType: 'Ceasefire'
  },

  // m7: SpaceX Mars landing
  m7: {
    category: 'Science',
    actors: ['SpaceX', 'Elon Musk', 'Mars', 'NASA'],
    angle: 'Innovation',
    eventType: 'Space Mission'
  },

  // m8: Apple foldable iPhone
  m8: {
    category: 'Technology',
    actors: ['Apple', 'iPhone', 'Tim Cook'],
    angle: 'Product Launch',
    eventType: 'Product Launch'
  },

  // m9: Manchester City Premier League
  m9: {
    category: 'Sports',
    actors: ['Manchester City', 'Premier League', 'Pep Guardiola'],
    angle: 'Championship Odds',
    eventType: 'Championship'
  },

  // m10: US unemployment rate
  m10: {
    category: 'Economics',
    actors: ['BLS', 'US Economy', 'Labor Market'],
    angle: 'Economic Indicator',
    eventType: 'Data Release'
  },

  // m11: AI copyright lawsuit
  m11: {
    category: 'Technology',
    actors: ['OpenAI', 'Anthropic', 'Google', 'Copyright'],
    angle: 'Controversy',
    eventType: 'Lawsuit'
  },

  // m12: Ethereum proof-of-stake
  m12: {
    category: 'Crypto',
    actors: ['Ethereum', 'ETH', 'Vitalik Buterin'],
    angle: 'Technical Analysis',
    eventType: 'Protocol Upgrade'
  }
};

/**
 * Get tags for a specific market
 */
export function getMarketTags(marketId: string): MarketTags | undefined {
  return marketTagsData[marketId];
}

/**
 * Get all market tags as a Map
 */
export function getAllMarketTags(): Map<string, MarketTags> {
  return new Map(Object.entries(marketTagsData));
}

/**
 * Get trending ranks (mock implementation - based on participants)
 * In real implementation, this would come from analytics
 */
export function getTrendingRanks(markets: any[]): Map<string, number> {
  const sorted = [...markets].sort((a, b) => b.participants - a.participants);
  const ranks = new Map<string, number>();
  
  sorted.forEach((market, index) => {
    ranks.set(market.id, index + 1);
  });

  return ranks;
}

export default {
  marketTagsData,
  getMarketTags,
  getAllMarketTags,
  getTrendingRanks
};
