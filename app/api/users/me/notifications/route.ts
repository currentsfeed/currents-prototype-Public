import { NextRequest, NextResponse } from 'next/server';

// Mock notifications
const mockNotifications = [
  {
    id: 'n1',
    type: 'market_resolved',
    icon: '✅',
    message: 'Market resolved: "Will Bitcoin reach $100,000 by end of 2024?" → YES',
    marketId: 'm2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    read: false
  },
  {
    id: 'n2',
    type: 'position_change',
    icon: '📈',
    message: 'Your position in "Will Donald Trump win the 2024 election?" increased by $45',
    marketId: 'm1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false
  },
  {
    id: 'n3',
    type: 'market_closing_soon',
    icon: '⏰',
    message: 'Market closing in 24 hours: "Will OpenAI release GPT-5 in 2024?"',
    marketId: 'm3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false
  },
  {
    id: 'n4',
    type: 'new_participant',
    icon: '👤',
    message: 'alice_trader took a position in your market',
    marketId: 'm-user-1',
    userId: 'alice_trader',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true
  },
  {
    id: 'n5',
    type: 'milestone',
    icon: '🎉',
    message: 'Your market reached 1,000 participants!',
    marketId: 'm-user-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true
  },
  {
    id: 'n6',
    type: 'position_change',
    icon: '📉',
    message: 'Your position in "Fed interest rate cut Q2 2024" decreased by $12',
    marketId: 'm4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    read: true
  },
  {
    id: 'n7',
    type: 'market_created',
    icon: '✨',
    message: 'Your market "Will Ethereum 2.0 launch in 2024?" is now live',
    marketId: 'm-user-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    read: true
  },
  {
    id: 'n8',
    type: 'welcome',
    icon: '👋',
    message: 'Welcome to Currents! Get started by exploring trending markets',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    read: true
  }
];

export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter(n => !n.read).length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationId } = body;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    if (action === 'mark_all_read') {
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    if (action === 'mark_read' && notificationId) {
      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
