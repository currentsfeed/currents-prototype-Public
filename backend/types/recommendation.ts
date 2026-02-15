// Recommendation Engine Types

export interface Activity {
  marketId: string;
  type: 'view' | 'vote' | 'share' | 'comment';
  timestamp: Date;
  category?: string;
  actors?: string[];
  angle?: string;
  eventType?: string;
}

export interface UserProfile {
  userId: string;
  interests: {
    categories: Map<string, number>;      // "Crypto" → 0.85
    actors: Map<string, number>;          // "Bitcoin" → 0.92
    angles: Map<string, number>;          // "Controversy" → 0.65
    eventTypes: Map<string, number>;      // "Election" → 0.45
  };
  recentActivity: Activity[];             // Last 50 interactions
  lastUpdated: Date;
}

export interface MarketTags {
  category: string;
  actors: string[];        // Key entities: "Bitcoin", "Trump", "OpenAI"
  angle: string;           // "Controversy", "Analysis", "Breaking News"
  eventType: string;       // "Election", "Product Launch", "Regulation"
}

export interface ScoredMarket {
  market: any;  // The market object
  score: number;
  reason: string;  // Why this score? (for debugging)
  section: 'personalized' | 'trending' | 'exploration';
}

export interface PersonalizedFeed {
  hero: any;                    // Top market (personalized or global #1)
  personalizedSection: any[];   // 60% - user's interests
  trendingSection: any[];       // 20% - global trending
  explorationSection: any[];    // 20% - new topics
  metadata: {
    composed: Date;
    userId: string;
    userProfile: string;       // Profile snapshot for debugging
    diversityScore: number;    // How diverse is this feed?
  };
}

export interface FeedCompositionRules {
  personalizedRatio: number;   // 0.6 for logged-in
  trendingRatio: number;       // 0.2
  explorationRatio: number;    // 0.2
  maxSameCategoryInRow: number; // 2
  recencyBoostPercent: number;  // 10
  exploitationRatio: number;    // 0.9 (90/10 rule)
}
