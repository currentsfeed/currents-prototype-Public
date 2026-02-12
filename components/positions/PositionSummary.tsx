'use client';

import { PositionSummary as Summary } from '@/types/position';
import { formatCurrency, formatPercent } from '@/lib/positionUtils';

interface PositionSummaryProps {
  summary: Summary;
}

export function PositionSummary({ summary }: PositionSummaryProps) {
  const isPositive = summary.totalPnL >= 0;
  const pnlColor = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';
  
  return (
    <div 
      className="rounded-2xl p-6 mb-8"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total P&L */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            💰 TOTAL P&L
          </div>
          <div className="flex items-baseline gap-3">
            <div 
              className="text-3xl font-bold"
              style={{ color: pnlColor }}
            >
              {formatCurrency(summary.totalPnL)}
            </div>
            <div 
              className="text-lg font-semibold"
              style={{ color: pnlColor }}
            >
              {formatPercent(summary.totalPnLPercent)}
            </div>
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
            Portfolio Value: {formatCurrency(summary.totalValue)}
          </div>
        </div>
        
        {/* Positions Count */}
        <div className="flex items-center gap-8">
          <div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {summary.activeCount}
            </div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Active
            </div>
          </div>
          
          <div className="w-px h-12" style={{ background: 'rgba(255,255,255,0.1)' }} />
          
          <div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {summary.resolvedCount}
            </div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Resolved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
