import { NextRequest, NextResponse } from 'next/server';

interface PreviewRequest {
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;
}

interface MarketState {
  id: string;
  currentProbability: number;
  totalYesShares: number;
  totalNoShares: number;
  liquidityPool: number;
}

// Mock market data store
const mockMarkets: Record<string, MarketState> = {
  'btc-150k-q1': {
    id: 'btc-150k-q1',
    currentProbability: 40,
    totalYesShares: 4000,
    totalNoShares: 6000,
    liquidityPool: 10000
  }
};

// Mock AMM pricing formula
const calculatePrice = (side: 'YES' | 'NO', market: MarketState): number => {
  const yesShares = market.totalYesShares;
  const noShares = market.totalNoShares;
  
  if (side === 'YES') {
    return noShares / (yesShares + noShares);
  } else {
    return yesShares / (yesShares + noShares);
  }
};

const calculateShares = (amount: number, price: number): number => {
  return amount / price;
};

const calculateNewProbability = (
  side: 'YES' | 'NO',
  sharesBought: number,
  market: MarketState
): number => {
  const newYesShares = market.totalYesShares + (side === 'YES' ? sharesBought : 0);
  const newNoShares = market.totalNoShares + (side === 'NO' ? sharesBought : 0);
  
  return (newYesShares / (newYesShares + newNoShares)) * 100;
};

export async function POST(request: NextRequest) {
  try {
    const body: PreviewRequest = await request.json();
    
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
    
    // Get market (or use default for any market)
    const market = mockMarkets[body.marketId] || {
      id: body.marketId,
      currentProbability: 50,
      totalYesShares: 5000,
      totalNoShares: 5000,
      liquidityPool: 10000
    };
    
    // Calculate preview
    const price = calculatePrice(body.side, market);
    const shares = calculateShares(body.amount, price);
    const newProbability = calculateNewProbability(body.side, shares, market);
    const marketImpact = Math.abs(newProbability - market.currentProbability);
    
    // Calculate potential outcomes
    const potentialWin = shares - body.amount; // Simplified: each share pays $1 if correct
    const roi = (potentialWin / body.amount) * 100;
    
    return NextResponse.json({
      success: true,
      preview: {
        shares: parseFloat(shares.toFixed(2)),
        pricePerShare: parseFloat(price.toFixed(4)),
        potentialWin: parseFloat(potentialWin.toFixed(2)),
        potentialLoss: body.amount,
        roi: parseFloat(roi.toFixed(1)),
        currentProbability: market.currentProbability,
        newProbability: parseFloat(newProbability.toFixed(1)),
        marketImpact: parseFloat(marketImpact.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Preview calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to calculate preview' },
      { status: 500 }
    );
  }
}
