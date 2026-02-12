'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Position, PositionSummary as Summary, PositionsResponse } from '@/types/position';
import { PositionSummary } from '@/components/positions/PositionSummary';
import { PositionFilters } from '@/components/positions/PositionFilters';
import { PositionCard } from '@/components/positions/PositionCard';
import { PositionEmptyState } from '@/components/positions/PositionEmptyState';
import { PositionSkeleton } from '@/components/positions/PositionSkeleton';

export default function MyPositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, [filter]);

  async function fetchPositions() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/me/positions?status=${filter}`);
      const data: PositionsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch positions');
      }
      
      if (data.data) {
        setPositions(data.data.positions);
        setSummary(data.data.summary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="header">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full" style={{ background: 'var(--accent-brand)' }} />
              <span className="text-xl font-bold">Currents</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/">
                <button className="tab">Currents</button>
              </Link>
              <button className="tab tab-active">My Positions</button>
              <Link href="/markets/create">
                <button className="tab">Create Market</button>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <button className="btn-secondary text-sm px-4 py-2">Profile</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-h2 mb-8">My Positions</h1>
        
        {/* Error State */}
        {error && (
          <div 
            className="rounded-xl p-4 mb-6 border"
            style={{ 
              background: 'rgba(255, 61, 61, 0.1)',
              borderColor: 'var(--accent-red)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1" style={{ color: 'var(--accent-red)' }}>
                  ⚠️ Failed to load positions
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {error}
                </div>
              </div>
              <button 
                onClick={() => fetchPositions()}
                className="btn-secondary text-sm px-4 py-2"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && !error && (
          <div>
            <div 
              className="rounded-2xl p-6 mb-8 animate-pulse"
              style={{ background: 'var(--bg-card)' }}
            >
              <div 
                className="h-24 rounded"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <PositionSkeleton key={i} />
              ))}
            </div>
          </div>
        )}
        
        {/* Content */}
        {!loading && !error && (
          <>
            {positions.length === 0 && filter === 'all' ? (
              <PositionEmptyState />
            ) : (
              <>
                {/* Summary Card */}
                {summary && <PositionSummary summary={summary} />}
                
                {/* Filters */}
                <PositionFilters activeFilter={filter} onFilterChange={setFilter} />
                
                {/* Positions Grid */}
                {positions.length === 0 ? (
                  <div className="text-center py-12">
                    <p style={{ color: 'var(--text-secondary)' }}>
                      No {filter} positions found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {positions.map(position => (
                      <PositionCard key={position.id} position={position} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
