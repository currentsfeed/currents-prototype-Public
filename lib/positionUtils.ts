import { Position, PositionSummary } from '@/types/position';

export function calculatePositionValue(
  side: 'YES' | 'NO',
  shares: number,
  currentProbability: number
): number {
  return side === 'YES'
    ? shares * (currentProbability / 100)
    : shares * ((100 - currentProbability) / 100);
}

export function calculateSummary(positions: Position[]): PositionSummary {
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalCostBasis = positions.reduce((sum, p) => sum + p.costBasis, 0);
  const totalPnL = totalValue - totalCostBasis;
  const totalPnLPercent = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;
  
  return {
    totalValue,
    totalCostBasis,
    totalPnL,
    totalPnLPercent,
    activeCount: positions.filter(p => p.status === 'active').length,
    resolvedCount: positions.filter(p => p.status === 'resolved').length,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
