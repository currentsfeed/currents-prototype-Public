// API Route: GET /api/feed/personalized?userId=<id>

import { NextRequest, NextResponse } from 'next/server';
import FeedComposer from '../../../../backend/services/feed-composer';
import { getUserProfile } from '../../../../backend/data/mock-user-profiles';
import { getAllMarketTags, getTrendingRanks } from '../../../../backend/data/mock-market-tags';
import marketData from '../../../../market-data.json';

const feedComposer = new FeedComposer();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const totalMarkets = parseInt(searchParams.get('totalMarkets') || '15', 10);

    // Get all markets
    const markets = marketData.markets;

    // Get market tags
    const marketTagsMap = getAllMarketTags();

    // Get trending ranks
    const trendingRanks = getTrendingRanks(markets);

    // Guest user flow
    if (!userId || userId === 'guest') {
      const guestFeed = feedComposer.composeGuestFeed(
        markets,
        marketTagsMap,
        trendingRanks,
        totalMarkets
      );

      return NextResponse.json({
        hero: guestFeed.hero,
        sections: [
          {
            type: 'trending',
            title: 'Trending Now',
            markets: guestFeed.trendingSection
          },
          {
            type: 'exploration',
            title: 'Discover',
            markets: guestFeed.explorationSection
          }
        ],
        metadata: guestFeed.metadata
      });
    }

    // Logged-in user flow
    const userProfile = getUserProfile(userId);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found', userId },
        { status: 404 }
      );
    }

    const personalizedFeed = feedComposer.composePersonalizedFeed(
      userProfile,
      markets,
      marketTagsMap,
      trendingRanks,
      totalMarkets
    );

    return NextResponse.json({
      hero: personalizedFeed.hero,
      sections: [
        {
          type: 'personalized',
          title: 'For You',
          subtitle: 'Based on your interests',
          markets: personalizedFeed.personalizedSection
        },
        {
          type: 'trending',
          title: 'Trending Now',
          subtitle: 'Popular across Currents',
          markets: personalizedFeed.trendingSection
        },
        {
          type: 'exploration',
          title: 'Discover',
          subtitle: 'New topics to explore',
          markets: personalizedFeed.explorationSection
        }
      ],
      metadata: personalizedFeed.metadata
    });
  } catch (error: any) {
    console.error('Error composing feed:', error);
    return NextResponse.json(
      { error: 'Failed to compose feed', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to clear cache (e.g., after user votes)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (action === 'clearCache') {
      if (userId) {
        feedComposer.clearCache(userId);
        return NextResponse.json({ success: true, message: `Cache cleared for user ${userId}` });
      } else {
        feedComposer.clearAllCaches();
        return NextResponse.json({ success: true, message: 'All caches cleared' });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in POST /api/feed/personalized:', error);
    return NextResponse.json(
      { error: 'Failed to process request', message: error.message },
      { status: 500 }
    );
  }
}
