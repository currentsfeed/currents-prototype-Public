'use client';

import Link from 'next/link';
import { Position } from '@/types/position';
import { formatCurrency, formatPercent, formatDate } from '@/lib/positionUtils';

interface PositionCardProps {
  position: Position;
}

export function PositionCard({ position }: PositionCardProps) {
  const isPositive = position.unrealizedPnL >= 0;
  const pnlColor = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';
  const pnlBg = isPositive ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 61, 61, 0.1)';
  
  return (
    <Link href={`/markets/${position.marketSlug}`}>
      <div 
        className="rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
        style={{ 
          background: 'var(--bg-card)',
        }}
      >
        <div className="flex gap-4">
          {/* Market Image with Probability */}
          <div className="relative flex-shrink-0">
            <div 
              className="w-20 h-20 rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-elevated)' }}
            >
              {/* Placeholder for image */}
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {position.category === 'Technology' && '💻'}
                {position.category === 'Politics' && '🏛️'}
                {position.category === 'Finance' && '💰'}
                {position.category === 'Entertainment' && '🎬'}
                {position.category === 'Sports' && '⚽'}
                {position.category === 'Media' && '📰'}
              </div>
            </div>
            <div 
              className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-bold"
              style={{ background: 'rgba(0,0,0,0.8)', color: 'white' }}
            >
              {position.currentProbability}%
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 
              className="text-base font-semibold mb-1 line-clamp-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {position.marketQuestion}
            </h3>
            
            <div 
              className="text-xs font-bold uppercase mb-3"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {position.category}
            </div>
            
            {/* Position Details */}
            <div 
              className="text-sm mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="mb-1">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Your Position:
                </span>{' '}
                <span style={{ color: position.side === 'YES' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {position.side}
                </span>
              </div>
              <div className="mb-1">
                {position.shares} shares @ ${position.avgPrice.toFixed(2)}
              </div>
              <div>
                Current: {position.currentProbability}% • Value: {formatCurrency(position.currentValue)}
              </div>
            </div>
            
            {/* P&L Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{ 
                background: pnlBg,
                borderColor: pnlColor,
              }}
            >
              <span 
                className="text-lg font-bold"
                style={{ color: pnlColor }}
              >
                {formatCurrency(position.unrealizedPnL)}
              </span>
              <span 
                className="text-sm font-semibold"
                style={{ color: pnlColor }}
              >
                {formatPercent(position.unrealizedPnLPercent)}
              </span>
            </div>
            
            {/* Resolved Badge */}
            {position.status === 'resolved' && (
              <div className="mt-2">
                <span 
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ 
                    background: 'rgba(255,255,255,0.1)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  RESOLVED: {position.resolvedOutcome}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div 
          className="mt-3 pt-3 text-xs"
          style={{ 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            color: 'var(--text-tertiary)'
          }}
        >
          Opened {formatDate(position.createdAt)}
        </div>
      </div>
    </Link>
  );
}
