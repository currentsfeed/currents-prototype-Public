// Position types
export interface Position {
  id: string;
  userId: string;
  marketId: string;
  marketSlug: string;
  marketQuestion: string;
  marketImageUrl: string;
  category: string;
  
  // Position details
  side: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  costBasis: number;
  
  // Current state
  currentProbability: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  
  // Status
  status: 'active' | 'resolved';
  resolvedOutcome?: 'YES' | 'NO' | 'INVALID';
  realizedPnL?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface PositionSummary {
  totalValue: number;
  totalCostBasis: number;
  totalPnL: number;
  totalPnLPercent: number;
  activeCount: number;
  resolvedCount: number;
}

export interface PositionsResponse {
  success: boolean;
  data?: {
    summary: PositionSummary;
    positions: Position[];
  };
  meta?: {
    total: number;
    filtered: number;
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
