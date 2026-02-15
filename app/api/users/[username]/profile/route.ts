// API Route: GET /api/users/:username/profile
// Returns complete user profile data for the inspector page

import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '../../../../../backend/data/mock-user-profiles';
import { getAllMarketTags, getTrendingRanks } from '../../../../../backend/data/mock-market-tags';
import { RecommendationEngine } from '../../../../../backend/services/recommendation-engine';
import marketData from '../../../../../market-data.json';

const recommendationEngine = new RecommendationEngine();

// Map username-style IDs to internal user IDs
const usernameToUserId: Record<string, string> = {
  'user-crypto-1': 'user-crypto-1',
  'user-politics-1': 'user-politics-1',
  'user-sports-1': 'user-sports-1',
  'user-tech-1': 'user-tech-1',
  'user-generalist-1': 'user-generalist-1',
  'crypto-enthusiast': 'user-crypto-1',
  'politics-junkie': 'user-politics-1',
  'sports-fan': 'user-sports-1',
  'tech-nerd': 'user-tech-1',
  'generalist': 'user-generalist-1'
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    // Map username to userId
    const userId = usernameToUserId[username] || username;

    // Get user profile
    const userProfile = getUserProfile(userId);
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found', username, userId },
        { status: 404 }
      );
    }

    // Get all markets and tags
    const markets = marketData.markets;
    const marketTagsMap = getAllMarketTags();
    const trendingRanks = getTrendingRanks(markets);

    // Score all markets for this user
    const allScoredMarkets: any[] = [];
    
    for (const market of markets) {
      const tags = marketTagsMap.get(market.id);
      if (!tags) continue;

      const trendingRank = trendingRanks.get(market.id) || 999;
      const breakdown = recommendationEngine.calculateDetailedScore(
        userProfile,
        market,
        tags,
        trendingRank,
        false
      );

      allScoredMarkets.push({
        marketId: market.id,
        question: market.question,
        category: market.category,
        currentBelief: market.currentBelief,
        participants: market.participants,
        score: breakdown.finalScore,
        rank: 0, // Will be set after sorting
        classification: breakdown.classification,
        breakdown
      });
    }

    // Sort by score and assign ranks
    allScoredMarkets.sort((a, b) => b.score - a.score);
    allScoredMarkets.forEach((market, index) => {
      market.rank = index + 1;
    });

    // Get persona name
    const personaNames: Record<string, string> = {
      'user-crypto-1': 'Crypto Enthusiast',
      'user-politics-1': 'Politics Junkie',
      'user-sports-1': 'Sports Fan',
      'user-tech-1': 'Tech Nerd',
      'user-generalist-1': 'Generalist'
    };

    // Convert Maps to sorted arrays for response
    const categoriesArray = Array.from(userProfile.interests.categories.entries())
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);

    const actorsArray = Array.from(userProfile.interests.actors.entries())
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);

    const anglesArray = Array.from(userProfile.interests.angles.entries())
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);

    const eventTypesArray = Array.from(userProfile.interests.eventTypes.entries())
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);

    // Calculate exploitation vs exploration stats
    const exploitationMarkets = allScoredMarkets.filter(m => m.score >= 0.5);
    const explorationMarkets = allScoredMarkets.filter(m => m.score < 0.5);

    const response = {
      userId,
      persona: personaNames[userId] || 'Unknown',
      interests: {
        categories: categoriesArray,
        actors: actorsArray,
        angles: anglesArray,
        eventTypes: eventTypesArray
      },
      recentActivity: userProfile.recentActivity.map(activity => ({
        ...activity,
        timestamp: activity.timestamp.toISOString()
      })),
      marketScores: allScoredMarkets,
      exploitationExploration: {
        exploitation: exploitationMarkets.length,
        exploration: explorationMarkets.length,
        exploitationRatio: (exploitationMarkets.length / allScoredMarkets.length) * 100,
        targetRatio: 90
      },
      metadata: {
        totalMarkets: allScoredMarkets.length,
        lastUpdated: userProfile.lastUpdated.toISOString(),
        generatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error generating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to generate user profile', message: error.message },
      { status: 500 }
    );
  }
}
