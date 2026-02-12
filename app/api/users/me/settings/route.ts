import { NextRequest, NextResponse } from 'next/server';

// Mock current user settings
const mockSettings = {
  account: {
    username: 'demo_user',
    displayName: 'Demo User',
    email: 'demo@currents.app',
    bio: 'Exploring prediction markets',
    avatar: '🧑',
    joinDate: '2024-02-01',
    balance: '$1,500'
  },
  notifications: {
    emailMarketUpdates: true,
    emailPositionChanges: true,
    emailNewsletter: false,
    pushMarketResolution: true,
    pushPriceAlerts: false
  },
  privacy: {
    profileVisibility: 'public', // public | private
    showPositions: true,
    showMarketsCreated: true,
    showStats: true
  }
};

export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json(mockSettings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In real app: validate and save to database
    // For prototype: just echo back success

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: body
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
