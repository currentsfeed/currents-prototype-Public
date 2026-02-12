import { NextRequest, NextResponse } from 'next/server';
import { mockPositions } from '@/lib/mockPositions';
import { calculateSummary } from '@/lib/positionUtils';
import { Position } from '@/types/position';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  // Simulate network delay
  await delay(500);
  
  // Random error simulation (5% chance)
  if (Math.random() < 0.05) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch positions. Please try again.',
        },
      },
      { status: 500 }
    );
  }
  
  // Get filter from query params
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || 'all';
  
  // Filter positions based on status
  let filteredPositions: Position[] = mockPositions;
  
  if (status === 'active') {
    filteredPositions = mockPositions.filter(p => p.status === 'active');
  } else if (status === 'resolved') {
    filteredPositions = mockPositions.filter(p => p.status === 'resolved');
  }
  
  // Sort by date (newest first)
  filteredPositions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Calculate summary
  const summary = calculateSummary(mockPositions); // Always calculate from all positions
  
  return NextResponse.json({
    success: true,
    data: {
      summary,
      positions: filteredPositions,
    },
    meta: {
      total: mockPositions.length,
      filtered: filteredPositions.length,
      timestamp: new Date().toISOString(),
    },
  });
}
