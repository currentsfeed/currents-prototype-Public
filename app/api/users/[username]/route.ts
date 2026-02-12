import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers: Record<string, any> = {
  'alice_trader': {
    username: 'alice_trader',
    displayName: 'Alice',
    avatar: '👩‍💼',
    joinDate: '2024-01-15',
    bio: 'Tech forecaster focused on AI and crypto markets',
    stats: {
      marketsCreated: 12,
      positionsTaken: 47,
      netOutcome: '+$2,847',
      accuracy: 68
    },
    marketsCreated: [
      {
        id: 'm3',
        question: 'Will OpenAI release GPT-5 in 2024?',
        category: 'Technology',
        currentBelief: 28,
        status: 'open',
        participants: 6523
      },
      {
        id: 'm-alice-1',
        question: 'Will Ethereum switch to proof-of-stake successfully?',
        category: 'Crypto',
        currentBelief: 89,
        status: 'resolved',
        participants: 2341,
        resolution: 'YES'
      }
    ],
    positions: [
      {
        marketId: 'm2',
        question: 'Will Bitcoin reach $100,000 by end of 2024?',
        position: 'YES',
        amount: '$500',
        currentValue: '$547',
        change: '+9.4%'
      },
      {
        marketId: 'm3',
        question: 'Will OpenAI release GPT-5 in 2024?',
        position: 'NO',
        amount: '$300',
        currentValue: '$312',
        change: '+4.0%'
      }
    ]
  },
  'bob_forecaster': {
    username: 'bob_forecaster',
    displayName: 'Bob',
    avatar: '👨‍💻',
    joinDate: '2023-11-03',
    bio: 'Political analyst and prediction market enthusiast',
    stats: {
      marketsCreated: 5,
      positionsTaken: 89,
      netOutcome: '+$4,123',
      accuracy: 72
    },
    marketsCreated: [
      {
        id: 'm1',
        question: 'Will Donald Trump win the 2024 US Presidential election?',
        category: 'Politics',
        currentBelief: 48,
        status: 'open',
        participants: 12847
      }
    ],
    positions: [
      {
        marketId: 'm1',
        question: 'Will Donald Trump win the 2024 US Presidential election?',
        position: 'YES',
        amount: '$1,200',
        currentValue: '$1,290',
        change: '+7.5%'
      }
    ]
  },
  'charlie_newbie': {
    username: 'charlie_newbie',
    displayName: 'Charlie',
    avatar: '🆕',
    joinDate: new Date().toISOString().split('T')[0],
    bio: 'Just getting started with prediction markets',
    stats: {
      marketsCreated: 0,
      positionsTaken: 2,
      netOutcome: '-$15',
      accuracy: 50
    },
    marketsCreated: [],
    positions: [
      {
        marketId: 'm4',
        question: 'Will interest rates be cut by the Fed in Q2 2024?',
        position: 'YES',
        amount: '$50',
        currentValue: '$48',
        change: '-4.0%'
      }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const user = mockUsers[username];

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
