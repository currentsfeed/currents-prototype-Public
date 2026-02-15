// Mock User Profiles for Testing Personalization

import { UserProfile, Activity } from '../types/recommendation';

/**
 * Helper to create a user profile with Map objects
 */
function createProfile(
  userId: string,
  categories: [string, number][],
  actors: [string, number][],
  angles: [string, number][],
  eventTypes: [string, number][],
  recentActivity: Activity[] = []
): UserProfile {
  return {
    userId,
    interests: {
      categories: new Map(categories),
      actors: new Map(actors),
      angles: new Map(angles),
      eventTypes: new Map(eventTypes)
    },
    recentActivity,
    lastUpdated: new Date()
  };
}

/**
 * 1. Crypto Enthusiast - loves Bitcoin, Ethereum, DeFi
 */
export const cryptoEnthusiast: UserProfile = createProfile(
  'user-crypto-1',
  [
    ['Crypto', 0.92],
    ['Technology', 0.65],
    ['Finance', 0.70],
    ['Politics', 0.25],
    ['Sports', 0.10]
  ],
  [
    ['Bitcoin', 0.95],
    ['Ethereum', 0.90],
    ['DeFi', 0.88],
    ['Coinbase', 0.75],
    ['SEC', 0.60]
  ],
  [
    ['Price Prediction', 0.90],
    ['Regulation', 0.70],
    ['Technical Analysis', 0.85],
    ['Controversy', 0.40]
  ],
  [
    ['Price Movement', 0.92],
    ['Regulation', 0.75],
    ['Product Launch', 0.60],
    ['Hack/Security', 0.80]
  ],
  [
    { marketId: 'm2', type: 'vote', timestamp: new Date('2024-02-14'), category: 'Crypto' },
    { marketId: 'm12', type: 'view', timestamp: new Date('2024-02-13'), category: 'Crypto' }
  ]
);

/**
 * 2. Politics Junkie - US elections, Trump, Biden
 */
export const politicsJunkie: UserProfile = createProfile(
  'user-politics-1',
  [
    ['Politics', 0.95],
    ['Geopolitics', 0.80],
    ['Economics', 0.55],
    ['Technology', 0.30],
    ['Crypto', 0.15]
  ],
  [
    ['Trump', 0.92],
    ['Biden', 0.88],
    ['DeSantis', 0.75],
    ['Congress', 0.70],
    ['Supreme Court', 0.65]
  ],
  [
    ['Election Coverage', 0.95],
    ['Controversy', 0.85],
    ['Policy Analysis', 0.70],
    ['Polling', 0.80]
  ],
  [
    ['Election', 0.95],
    ['Legislation', 0.75],
    ['Scandal', 0.88],
    ['Appointment', 0.60]
  ],
  [
    { marketId: 'm1', type: 'vote', timestamp: new Date('2024-02-14'), category: 'Politics' },
    { marketId: 'm6', type: 'view', timestamp: new Date('2024-02-13'), category: 'Geopolitics' }
  ]
);

/**
 * 3. Sports Fan - NFL, NBA, betting markets
 */
export const sportsFan: UserProfile = createProfile(
  'user-sports-1',
  [
    ['Sports', 0.90],
    ['Entertainment', 0.50],
    ['Finance', 0.40],
    ['Politics', 0.20],
    ['Technology', 0.25]
  ],
  [
    ['NFL', 0.92],
    ['NBA', 0.88],
    ['Premier League', 0.85],
    ['Manchester City', 0.80],
    ['LeBron James', 0.75]
  ],
  [
    ['Game Predictions', 0.95],
    ['Player Analysis', 0.80],
    ['Championship Odds', 0.90],
    ['Controversy', 0.60]
  ],
  [
    ['Championship', 0.92],
    ['Player Trade', 0.80],
    ['Season Outcome', 0.88],
    ['Injury Update', 0.70]
  ],
  [
    { marketId: 'm9', type: 'vote', timestamp: new Date('2024-02-14'), category: 'Sports' }
  ]
);

/**
 * 4. Tech Nerd - AI, OpenAI, Apple, Tesla
 */
export const techNerd: UserProfile = createProfile(
  'user-tech-1',
  [
    ['Technology', 0.95],
    ['Science', 0.80],
    ['Crypto', 0.60],
    ['Finance', 0.50],
    ['Politics', 0.30]
  ],
  [
    ['OpenAI', 0.95],
    ['Apple', 0.88],
    ['Tesla', 0.85],
    ['SpaceX', 0.90],
    ['Google', 0.80],
    ['Microsoft', 0.75]
  ],
  [
    ['Product Launch', 0.92],
    ['Technical Analysis', 0.88],
    ['Innovation', 0.95],
    ['Controversy', 0.50]
  ],
  [
    ['Product Launch', 0.95],
    ['Research Breakthrough', 0.90],
    ['Acquisition', 0.70],
    ['IPO', 0.65]
  ],
  [
    { marketId: 'm3', type: 'vote', timestamp: new Date('2024-02-14'), category: 'Technology' },
    { marketId: 'm8', type: 'view', timestamp: new Date('2024-02-13'), category: 'Technology' },
    { marketId: 'm11', type: 'view', timestamp: new Date('2024-02-12'), category: 'Technology' }
  ]
);

/**
 * 5. Generalist - diverse interests across all categories
 */
export const generalist: UserProfile = createProfile(
  'user-generalist-1',
  [
    ['Politics', 0.60],
    ['Technology', 0.65],
    ['Entertainment', 0.55],
    ['Sports', 0.50],
    ['Finance', 0.58],
    ['Crypto', 0.52]
  ],
  [
    ['Trump', 0.60],
    ['Bitcoin', 0.65],
    ['OpenAI', 0.70],
    ['Taylor Swift', 0.55],
    ['Manchester City', 0.50]
  ],
  [
    ['Breaking News', 0.75],
    ['Analysis', 0.70],
    ['Controversy', 0.60],
    ['Entertainment', 0.65]
  ],
  [
    ['Election', 0.62],
    ['Product Launch', 0.68],
    ['Price Movement', 0.58],
    ['Championship', 0.55]
  ],
  [
    { marketId: 'm1', type: 'view', timestamp: new Date('2024-02-14'), category: 'Politics' },
    { marketId: 'm2', type: 'view', timestamp: new Date('2024-02-13'), category: 'Crypto' },
    { marketId: 'm3', type: 'view', timestamp: new Date('2024-02-12'), category: 'Technology' }
  ]
);

/**
 * Get a user profile by ID
 */
export function getUserProfile(userId: string): UserProfile | null {
  switch (userId) {
    case 'user-crypto-1':
      return cryptoEnthusiast;
    case 'user-politics-1':
      return politicsJunkie;
    case 'user-sports-1':
      return sportsFan;
    case 'user-tech-1':
      return techNerd;
    case 'user-generalist-1':
      return generalist;
    default:
      return null;
  }
}

/**
 * List all available test profiles
 */
export function getAllProfiles(): UserProfile[] {
  return [
    cryptoEnthusiast,
    politicsJunkie,
    sportsFan,
    techNerd,
    generalist
  ];
}

export default {
  cryptoEnthusiast,
  politicsJunkie,
  sportsFan,
  techNerd,
  generalist,
  getUserProfile,
  getAllProfiles
};
