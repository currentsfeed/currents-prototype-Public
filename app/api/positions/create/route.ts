import { NextRequest, NextResponse } from 'next/server';

interface CreatePositionRequest {
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;
}

// Mock user balance store (in real app, this would be in database or on-chain)
const mockUserBalance = 100; // $100 USDC

// Simulate transaction delay
const simulateTransactionDelay = () => {
  return new Promise(resolve => 
    setTimeout(resolve, 1000 + Math.random() * 1000) // 1-2 seconds
  );
};

// Simulate occasional transaction failures (5% failure rate)
const simulateTransactionSuccess = () => {
  return Math.random() > 0.05;
};

export async function POST(request: NextRequest) {
  try {
    const body: CreatePositionRequest = await request.json();
    
    // Validation
    if (!body.marketId || typeof body.marketId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'INVALID_MARKET_ID', message: 'Market ID is required' },
        { status: 400 }
      );
    }
    
    if (!['YES', 'NO'].includes(body.side)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_SIDE', message: 'Side must be YES or NO' },
        { status: 400 }
      );
    }
    
    if (typeof body.amount !== 'number' || body.amount < 1 || body.amount > 1000) {
      return NextResponse.json(
        { success: false, error: 'INVALID_AMOUNT', message: 'Amount must be between $1 and $1,000' },
        { status: 400 }
      );
    }
    
    // Check balance (mock)
    if (body.amount > mockUserBalance) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INSUFFICIENT_BALANCE', 
          message: `Insufficient balance. You have $${mockUserBalance} USDC.` 
        },
        { status: 400 }
      );
    }
    
    // Simulate network delay
    await simulateTransactionDelay();
    
    // Simulate transaction success/failure
    if (!simulateTransactionSuccess()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'TRANSACTION_FAILED', 
          message: 'Transaction failed. Please try again.' 
        },
        { status: 500 }
      );
    }
    
    // Calculate position details (using same logic as preview)
    const price = 0.40; // Mock price (in real app, fetch from market state)
    const shares = body.amount / price;
    
    // Create mock position
    const position = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      marketId: body.marketId,
      side: body.side,
      amount: body.amount,
      shares: parseFloat(shares.toFixed(2)),
      pricePerShare: price,
      createdAt: new Date().toISOString()
    };
    
    // Calculate new balance
    const newBalance = mockUserBalance - body.amount;
    
    // In real app, update market state here
    const newProbability = 42; // Mock updated probability
    
    return NextResponse.json({
      success: true,
      position,
      newBalance: parseFloat(newBalance.toFixed(2)),
      market: {
        currentProbability: newProbability
      }
    });
  } catch (error) {
    console.error('Position creation error:', error);
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to create position' },
      { status: 500 }
    );
  }
}
