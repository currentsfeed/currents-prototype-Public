// Recommendation Engine - Scoring & Ranking

import { UserProfile, MarketTags, ScoredMarket, ScoringBreakdown } from '../types/recommendation';

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
   * Calculate detailed scoring breakdown for debug mode
   */
  calculateDetailedScore(
    userProfile: UserProfile,
    market: any,
    marketTags: MarketTags,
    trendingRank: number = 999,
    isForExploration: boolean = false
  ): ScoringBreakdown {
    // Category match
    const categoryMatch = userProfile.interests.categories.get(marketTags.category) || 0;
    const categoryWeight = 0.35;
    const categoryContribution = categoryMatch * categoryWeight;

    // Actor matches
    const actorMatches = marketTags.actors.map(actor => userProfile.interests.actors.get(actor) || 0);
    const avgActorMatch = actorMatches.length > 0 ? actorMatches.reduce((a, b) => a + b, 0) / actorMatches.length : 0;
    const actorWeight = 0.30;
    const actorContribution = avgActorMatch * actorWeight;

    // Angle match
    const angleMatch = userProfile.interests.angles.get(marketTags.angle) || 0;
    const angleWeight = 0.20;
    const angleContribution = angleMatch * angleWeight;

    // Event type match
    const eventTypeMatch = userProfile.interests.eventTypes.get(marketTags.eventType) || 0;
    const eventTypeWeight = 0.15;
    const eventTypeContribution = eventTypeMatch * eventTypeWeight;

    // Base score
    const baseTotal = categoryContribution + actorContribution + angleContribution + eventTypeContribution;

    // Calculate modifiers
    const modifiers: Array<{ type: string; value: number; reason: string }> = [];

    // 90/10 rule modifier
    if (isForExploration) {
      const exploreModifier = Math.random() * 0.7 - baseTotal * 0.7;
      modifiers.push({
        type: 'Exploration Boost',
        value: exploreModifier,
        reason: 'Testing new topics (randomized for discovery)'
      });
    } else {
      const exploreComponent = (Math.random() - baseTotal) * (1 - this.EXPLOITATION_RATIO);
      if (Math.abs(exploreComponent) > 0.01) {
        modifiers.push({
          type: '90/10 Exploration',
          value: exploreComponent,
          reason: '10% random exploration component'
        });
      }
    }

    // Recency boost
    const now = new Date();
    const created = new Date(market.closingDate || now);
    const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays < 3) {
      const recencyBoost = baseTotal * this.RECENCY_BOOST;
      modifiers.push({
        type: 'Recency Boost',
        value: recencyBoost,
        reason: `Market < 3 days old (+${(this.RECENCY_BOOST * 100).toFixed(0)}%)`
      });
    } else if (ageInDays < 30) {
      const decayFactor = 1 - (ageInDays - 3) / 27;
      const recencyBoost = baseTotal * this.RECENCY_BOOST * decayFactor;
      if (recencyBoost > 0.01) {
        modifiers.push({
          type: 'Recency Boost',
          value: recencyBoost,
          reason: `Market ${ageInDays.toFixed(1)} days old (decaying boost)`
        });
      }
    }

    // Trending boost
    if (trendingRank <= 3) {
      const trendingBoost = baseTotal * this.TRENDING_BOOST_TOP_3;
      modifiers.push({
        type: 'Trending Boost',
        value: trendingBoost,
        reason: `Rank #${trendingRank} globally (+${(this.TRENDING_BOOST_TOP_3 * 100).toFixed(0)}%)`
      });
    }

    // Calculate final score
    let finalScore = baseTotal;
    for (const mod of modifiers) {
      finalScore += mod.value;
    }

    // Determine classification
    let classification: 'exploitation' | 'exploration' | 'trending';
    if (isForExploration) {
      classification = 'exploration';
    } else if (finalScore >= 0.5) {
      classification = 'exploitation';
    } else {
      classification = 'exploration';
    }

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
      marketId: market.id,
      question: market.question,
      baseScore: {
        category: {
          name: marketTags.category,
          match: categoryMatch,
          weight: categoryWeight,
          contribution: categoryContribution
        },
        actors: {
          names: marketTags.actors,
          avgMatch: avgActorMatch,
          weight: actorWeight,
          contribution: actorContribution
        },
        angle: {
          name: marketTags.angle,
          match: angleMatch,
          weight: angleWeight,
          contribution: angleContribution
        },
        eventType: {
          name: marketTags.eventType,
          match: eventTypeMatch,
          weight: eventTypeWeight,
          contribution: eventTypeContribution
        },
        total: baseTotal
      },
      modifiers,
      finalScore,
      classification,
      section
    };
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
