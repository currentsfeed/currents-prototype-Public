// Recommendation Engine - Scoring & Ranking

import { UserProfile, MarketTags, ScoredMarket } from '../types/recommendation';

export class RecommendationEngine {
  private readonly RECENCY_BOOST = 0.10;  // 10% boost for new markets
  private readonly EXPLOITATION_RATIO = 0.90;  // 90/10 rule
  private readonly TRENDING_BOOST_TOP_3 = 0.15;  // 15% boost for top 3 trending

  /**
   * Calculate relevance score for a market based on user profile (0-1 scale)
   */
  calculateRelevanceScore(
    userProfile: UserProfile,
    market: any,
    marketTags: MarketTags
  ): number {
    if (!userProfile || !marketTags) return 0;

    let score = 0;
    let totalWeight = 0;

    // Category match (weight: 0.35)
    const categoryScore = userProfile.interests.categories.get(marketTags.category) || 0;
    score += categoryScore * 0.35;
    totalWeight += 0.35;

    // Actor matches (weight: 0.30)
    if (marketTags.actors.length > 0) {
      const actorScores = marketTags.actors
        .map(actor => userProfile.interests.actors.get(actor) || 0);
      const avgActorScore = actorScores.reduce((a, b) => a + b, 0) / actorScores.length;
      score += avgActorScore * 0.30;
      totalWeight += 0.30;
    }

    // Angle match (weight: 0.20)
    const angleScore = userProfile.interests.angles.get(marketTags.angle) || 0;
    score += angleScore * 0.20;
    totalWeight += 0.20;

    // Event type match (weight: 0.15)
    const eventScore = userProfile.interests.eventTypes.get(marketTags.eventType) || 0;
    score += eventScore * 0.15;
    totalWeight += 0.15;

    return score / totalWeight;
  }

  /**
   * Apply 90/10 rule: boost known interests, add randomness for exploration
   */
  apply90_10Rule(baseScore: number, isForExploration: boolean = false): number {
    if (isForExploration) {
      // For exploration section: favor less-known topics
      return baseScore * 0.3 + Math.random() * 0.7;
    }

    // For personalized section: 90% exploit (boost high scores), 10% explore
    const exploitScore = baseScore;
    const exploreScore = Math.random();
    return exploitScore * this.EXPLOITATION_RATIO + exploreScore * (1 - this.EXPLOITATION_RATIO);
  }

  /**
   * Apply recency boost (newer markets get +10%)
   */
  applyRecencyBoost(score: number, market: any): number {
    const now = new Date();
    const created = new Date(market.closingDate || now); // Placeholder logic
    const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

    // Markets < 3 days old get full boost, decays to 0 at 30 days
    if (ageInDays < 3) {
      return score * (1 + this.RECENCY_BOOST);
    } else if (ageInDays < 30) {
      const decayFactor = 1 - (ageInDays - 3) / 27;
      return score * (1 + this.RECENCY_BOOST * decayFactor);
    }

    return score;
  }

  /**
   * Apply trending boost for top 3 global markets
   */
  applyTrendingBoost(score: number, marketRank: number): number {
    if (marketRank <= 3) {
      return score * (1 + this.TRENDING_BOOST_TOP_3);
    }
    return score;
  }

  /**
   * Score a single market
   */
  scoreMarket(
    userProfile: UserProfile,
    market: any,
    marketTags: MarketTags,
    trendingRank: number = 999,
    isForExploration: boolean = false
  ): ScoredMarket {
    // Calculate base relevance score
    let score = this.calculateRelevanceScore(userProfile, market, marketTags);

    // Apply 90/10 rule
    score = this.apply90_10Rule(score, isForExploration);

    // Apply recency boost
    score = this.applyRecencyBoost(score, market);

    // Apply trending boost
    score = this.applyTrendingBoost(score, trendingRank);

    // Determine section
    let section: 'personalized' | 'trending' | 'exploration';
    if (isForExploration) {
      section = 'exploration';
    } else if (trendingRank <= 10) {
      section = 'trending';
    } else {
      section = 'personalized';
    }

    return {
      market,
      score,
      reason: `relevance=${score.toFixed(2)}, trending=${trendingRank}, exploration=${isForExploration}`,
      section
    };
  }

  /**
   * Score all markets and return sorted list
   */
  scoreAllMarkets(
    userProfile: UserProfile,
    markets: any[],
    marketTagsMap: Map<string, MarketTags>,
    trendingRanks: Map<string, number>
  ): ScoredMarket[] {
    const scoredMarkets: ScoredMarket[] = [];

    for (const market of markets) {
      const tags = marketTagsMap.get(market.id);
      if (!tags) continue;

      const trendingRank = trendingRanks.get(market.id) || 999;
      const scored = this.scoreMarket(userProfile, market, tags, trendingRank);
      scoredMarkets.push(scored);
    }

    // Sort by score descending
    return scoredMarkets.sort((a, b) => b.score - a.score);
  }

  /**
   * Check if user has seen this market before
   */
  hasUserSeenMarket(userProfile: UserProfile, marketId: string): boolean {
    return userProfile.recentActivity.some(activity => activity.marketId === marketId);
  }

  /**
   * Should we resurface this market? (only if probability changed significantly or news broke)
   */
  shouldResurface(
    userProfile: UserProfile,
    market: any,
    probabilityChangeThreshold: number = 5
  ): boolean {
    const lastSeen = userProfile.recentActivity.find(a => a.marketId === market.id);
    if (!lastSeen) return true;

    // Check if probability changed significantly
    // (In V1, we don't track historical probabilities, so always allow resurfacing)
    return true;
  }

  /**
   * Enforce diversity rules: no more than 2 from same category in a row
   */
  enforceDiversity(
    scoredMarkets: ScoredMarket[],
    maxSameCategoryInRow: number = 2
  ): ScoredMarket[] {
    const diversified: ScoredMarket[] = [];
    let categoryStreak: { category: string; count: number } = { category: '', count: 0 };

    for (const scored of scoredMarkets) {
      const tags = scored.market.category || 'Unknown';

      if (tags === categoryStreak.category) {
        if (categoryStreak.count >= maxSameCategoryInRow) {
          // Skip this market, we've hit the limit
          continue;
        }
        categoryStreak.count++;
      } else {
        categoryStreak = { category: tags, count: 1 };
      }

      diversified.push(scored);
    }

    return diversified;
  }

  /**
   * Calculate diversity score for a feed (0-1, higher is more diverse)
   */
  calculateDiversityScore(markets: any[]): number {
    if (markets.length === 0) return 0;

    const categories = new Set(markets.map(m => m.category));
    return categories.size / markets.length;
  }
}

export default RecommendationEngine;
