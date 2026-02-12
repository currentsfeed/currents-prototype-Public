'use client';

import Link from 'next/link';

export function PositionEmptyState() {
  return (
    <div className="text-center max-w-md mx-auto py-16">
      <div className="text-6xl mb-6 opacity-60">
        📊
      </div>
      
      <h2 
        className="text-3xl font-bold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        No positions yet
      </h2>
      
      <p 
        className="text-base mb-8"
        style={{ color: 'var(--text-secondary)' }}
      >
        Explore markets and place your first prediction to get started.
      </p>
      
      <Link href="/">
        <button className="btn-primary text-base px-6 py-3">
          Browse Markets
        </button>
      </Link>
    </div>
  );
}
