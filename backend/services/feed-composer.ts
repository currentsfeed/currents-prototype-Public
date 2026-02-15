// Feed Composer - Constructs personalized feeds with 60/20/20 split

import RecommendationEngine from './recommendation-engine';
import { UserProfile, PersonalizedFeed, MarketTags, FeedCompositionRules, DebugInfo, ScoringBreakdown } from '../types/recommendation';

export class FeedComposer {
  private engine: RecommendationEngine;
  private cacheMap: Map<string, { feed: PersonalizedFeed; timestamp: number }>;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000;  // 5 minutes

  constructor() {
    this.engine = new RecommendationEngine();
    this.cacheMap = new Map();
  }

  /**
   * Compose a personalized feed for logged-in users
   */
  composePersonalizedFeed(
    userProfile: UserProfile,
    markets: any[],
    marketTagsMap: Map<string, MarketTags>,
    trendingRanks: Map<string, number>,
    totalMarkets: number = 15
  ): PersonalizedFeed {
    // Check cache
    const cached = this.getCachedFeed(userProfile.userId);
    if (cached) return cached;

    // Define composition rules for logged-in users
    const rules: FeedCompositionRules = {
      personalizedRatio: 0.60,
      trendingRatio: 0.20,
      explorationRatio: 0.20,
      maxSameCategoryInRow: 2,
      recencyBoostPercent: 10,
      exploitationRatio: 0.90
    };

    const personalizedCount = Math.floor(totalMarkets * rules.personalizedRatio);
    const trendingCount = Math.floor(totalMarkets * rules.trendingRatio);
    const explorationCount = totalMarkets - personalizedCount - trendingCount;

    // Score all markets
    const scoredMarkets = this.engine.scoreAllMarkets(
      userProfile,
      markets,
      marketTagsMap,
      trendingRanks
    );

    // Don't apply diversity rules during scoring, apply during final assembly
    const diversifiedMarkets = scoredMarkets;

    // Split into sections
    const personalizedSection: any[] = [];
    const trendingSection: any[] = [];
    const explorationSection: any[] = [];

    // First pass: collect trending markets (top 10 by trending rank)
    const trendingMarkets = diversifiedMarkets
      .filter(sm => (trendingRanks.get(sm.market.id) || 999) <= 10)
      .slice(0, trendingCount)
      .map(sm => sm.market);
    trendingSection.push(...trendingMarkets);

    // Second pass: collect personalized markets (high relevance, not in trending)
    const usedIds = new Set(trendingMarkets.map(m => m.id));
    const personalizedMarkets = diversifiedMarkets
      .filter(sm => !usedIds.has(sm.market.id) && sm.score > 0.2) // Lower threshold
      .slice(0, personalizedCount)
      .map(sm => sm.market);
    personalizedMarkets.forEach(m => usedIds.add(m.id));
    personalizedSection.push(...personalizedMarkets);

    // Third pass: exploration markets (lower relevance, new topics)
    const explorationCandidates = diversifiedMarkets
      .filter(sm => !usedIds.has(sm.market.id))
      .map(sm => {
        // Rescore for exploration (favor less-known topics)
        const tags = marketTagsMap.get(sm.market.id)!;
        return this.engine.scoreMarket(userProfile, sm.market, tags, 999, true);
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, explorationCount)
      .map(sm => sm.market);
    explorationSection.push(...explorationCandidates);

    // Pick hero: highest scored market overall
    const hero = diversifiedMarkets[0]?.market || markets[0];

    // Interleave sections while enforcing diversity
    const finalPersonalized: any[] = [];
    const finalTrending: any[] = [];
    const finalExploration: any[] = [];
    
    const allSections = [
      ...personalizedSection.map(m => ({ market: m, section: 'personalized' })),
      ...trendingSection.map(m => ({ market: m, section: 'trending' })),
      ...explorationSection.map(m => ({ market: m, section: 'exploration' }))
    ];
    
    // Apply diversity while maintaining section labels
    let lastCategory = hero.category;
    let streakCount = 1;
    
    for (const item of allSections) {
      if (item.market.category === lastCategory) {
        if (streakCount >= rules.maxSameCategoryInRow) {
          continue; // Skip this market
        }
        streakCount++;
      } else {
        lastCategory = item.market.category;
        streakCount = 1;
      }
      
      // Add to appropriate section
      if (item.section === 'personalized') {
        finalPersonalized.push(item.market);
      } else if (item.section === 'trending') {
        finalTrending.push(item.market);
      } else {
        finalExploration.push(item.market);
      }
    }

    // Calculate diversity score
    const allFeedMarkets = [hero, ...finalPersonalized, ...finalTrending, ...finalExploration];
    const diversityScore = this.engine.calculateDiversityScore(allFeedMarkets);

    const feed: PersonalizedFeed = {
      hero,
      personalizedSection: finalPersonalized,
      trendingSection: finalTrending,
      explorationSection: finalExploration,
      metadata: {
        composed: new Date(),
        userId: userProfile.userId,
        userProfile: JSON.stringify({
          categories: Array.from(userProfile.interests.categories.entries()),
          topActors: Array.from(userProfile.interests.actors.entries()).slice(0, 5)
        }),
        diversityScore
      }
    };

    // Cache the feed
    this.cacheMap.set(userProfile.userId, { feed, timestamp: Date.now() });

    return feed;
  }

  /**
   * Compose a personalized feed with detailed debug information
   */
  composePersonalizedFeedWithDebug(
    userProfile: UserProfile,
    markets: any[],
    marketTagsMap: Map<string, MarketTags>,
    trendingRanks: Map<string, number>,
    totalMarkets: number = 15,
    includeDebug: boolean = false
  ): PersonalizedFeed {
    // First, get the regular feed
    const feed = this.composePersonalizedFeed(userProfile, markets, marketTagsMap, trendingRanks, totalMarkets);

    // If debug not requested, return regular feed
    if (!includeDebug) {
      return feed;
    }

    // Generate debug information
    const debug: DebugInfo = {
      userProfile: {
        userId: userProfile.userId,
        categories: Array.from(userProfile.interests.categories.entries())
          .sort((a, b) => b[1] - a[1]),
        actors: Array.from(userProfile.interests.actors.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
        angles: Array.from(userProfile.interests.angles.entries())
          .sort((a, b) => b[1] - a[1]),
        eventTypes: Array.from(userProfile.interests.eventTypes.entries())
          .sort((a, b) => b[1] - a[1]),
        recentActivity: userProfile.recentActivity.slice(0, 10)
      },
      scoringBreakdown: [],
      exploitationExploration: {
        exploitation: [],
        exploration: [],
        rejected: []
      },
      diversityEnforcement: {
        before: [],
        blocked: [],
        after: []
      },
      compositionMath: {
        target: { personalized: 60, trending: 20, exploration: 20 },
        actual: {
          personalized: ((feed.personalizedSection.length / totalMarkets) * 100).toFixed(1),
          trending: ((feed.trendingSection.length / totalMarkets) * 100).toFixed(1),
          exploration: ((feed.explorationSection.length / totalMarkets) * 100).toFixed(1)
        }
      }
    };

    // Generate detailed scoring breakdown for all markets in feed
    const allFeedMarkets = [
      feed.hero,
      ...feed.personalizedSection,
      ...feed.trendingSection,
      ...feed.explorationSection
    ];

    for (const market of allFeedMarkets) {
      const tags = marketTagsMap.get(market.id);
      if (!tags) continue;

      const trendingRank = trendingRanks.get(market.id) || 999;
      const isExploration = feed.explorationSection.some(m => m.id === market.id);
      
      const breakdown = this.engine.calculateDetailedScore(
        userProfile,
        market,
        tags,
        trendingRank,
        isExploration
      );

      debug.scoringBreakdown.push(breakdown);

      // Categorize into exploitation/exploration
      if (breakdown.classification === 'exploitation') {
        debug.exploitationExploration.exploitation.push(market);
      } else {
        debug.exploitationExploration.exploration.push(market);
      }
    }

    // Generate diversity enforcement data
    // Score all markets first
    const allScored = this.engine.scoreAllMarkets(userProfile, markets, marketTagsMap, trendingRanks);
    const topScored = allScored.slice(0, totalMarkets * 2); // Get more than needed to show what was blocked

    debug.diversityEnforcement.before = topScored.map(sm => sm.market);

    // Apply diversity rules and track what gets blocked
    const blocked: any[] = [];
    const after: any[] = [];
    let lastCategory = '';
    let streakCount = 0;

    for (const scored of topScored) {
      if (after.length >= totalMarkets) break;

      if (scored.market.category === lastCategory) {
        if (streakCount >= 2) {
          blocked.push(scored.market);
          continue;
        }
        streakCount++;
      } else {
        lastCategory = scored.market.category;
        streakCount = 1;
      }

      after.push(scored.market);
    }

    debug.diversityEnforcement.blocked = blocked;
    debug.diversityEnforcement.after = after;

    // Find rejected markets (below threshold or blocked)
    const feedMarketIds = new Set(allFeedMarkets.map(m => m.id));
    debug.exploitationExploration.rejected = allScored
      .filter(sm => !feedMarketIds.has(sm.market.id))
      .slice(0, 10)
      .map(sm => ({
        ...sm.market,
        _rejectionReason: sm.score < 0.2 ? 'Score too low' : 'Blocked by diversity rules',
        _score: sm.score
      }));

    feed.debug = debug;
    return feed;
  }

  /**
   * Compose a feed for guest users (not logged in)
   */
  composeGuestFeed(
    markets: any[],
    marketTagsMap: Map<string, MarketTags>,
    trendingRanks: Map<string, number>,
    totalMarkets: number = 15
  ): PersonalizedFeed {
    // Guest feed: 50% trending, 30% regional (not implemented yet), 20% recent
    const trendingCount = Math.floor(totalMarkets * 0.50);
    const regionalCount = Math.floor(totalMarkets * 0.30);
    const recentCount = totalMarkets - trendingCount - regionalCount;

    // Sort by trending rank
    const trendingMarkets = markets
      .map(m => ({ market: m, rank: trendingRanks.get(m.id) || 999 }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, trendingCount)
      .map(x => x.market);

    // Sort by recency (closing date as proxy)
    const recentMarkets = markets
      .filter(m => !trendingMarkets.some(tm => tm.id === m.id))
      .sort((a, b) => new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime())
      .slice(0, recentCount);

    // Regional markets (placeholder - just use remaining markets)
    const usedIds = new Set([...trendingMarkets.map(m => m.id), ...recentMarkets.map(m => m.id)]);
    const regionalMarkets = markets
      .filter(m => !usedIds.has(m.id))
      .slice(0, regionalCount);

    const hero = trendingMarkets[0] || markets[0];

    return {
      hero,
      personalizedSection: [],
      trendingSection: trendingMarkets,
      explorationSection: [...regionalMarkets, ...recentMarkets],
      metadata: {
        composed: new Date(),
        userId: 'guest',
        userProfile: 'Guest user - no personalization',
        diversityScore: this.engine.calculateDiversityScore([hero, ...trendingMarkets, ...regionalMarkets, ...recentMarkets])
      }
    };
  }

  /**
   * Get cached feed if still valid
   */
  private getCachedFeed(userId: string): PersonalizedFeed | null {
    const cached = this.cacheMap.get(userId);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL_MS) {
      this.cacheMap.delete(userId);
      return null;
    }

    return cached.feed;
  }

  /**
   * Clear cache for a user (e.g., after they vote or interact)
   */
  clearCache(userId: string): void {
    this.cacheMap.delete(userId);
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.cacheMap.clear();
  }

  /**
   * Enforce diversity on a list of markets
   */
  private enforceDiversityOnFeed(markets: any[], maxSameCategoryInRow: number): any[] {
    const result: any[] = [];
    const skipped: any[] = [];
    let lastCategory = '';
    let streakCount = 0;

    for (const market of markets) {
      if (market.category === lastCategory) {
        if (streakCount >= maxSameCategoryInRow) {
          skipped.push(market);
          continue;
        }
        streakCount++;
      } else {
        lastCategory = market.category;
        streakCount = 1;
      }
      result.push(market);
    }

    // Append skipped markets at the end (best effort)
    result.push(...skipped);

    return result;
  }
}

export default FeedComposer;
