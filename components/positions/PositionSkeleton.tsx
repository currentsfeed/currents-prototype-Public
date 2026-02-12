'use client';

export function PositionSkeleton() {
  return (
    <div 
      className="rounded-2xl p-4 animate-pulse"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex gap-4">
        <div 
          className="w-20 h-20 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        
        <div className="flex-1">
          <div 
            className="h-5 w-3/4 rounded mb-3"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <div 
            className="h-4 w-1/4 rounded mb-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <div 
            className="h-4 w-1/2 rounded mb-2"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <div 
            className="h-4 w-2/3 rounded mb-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <div 
            className="h-10 w-32 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>
    </div>
  );
}
