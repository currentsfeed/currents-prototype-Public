'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SuccessScreenProps {
  marketUrl: string;
  marketQuestion: string;
}

export function SuccessScreen({ marketUrl, marketQuestion }: SuccessScreenProps) {
  const router = useRouter();

  return (
    <div className="max-w-[500px] mx-auto px-6 py-16 text-center">
      {/* Confetti Animation */}
      <div className="text-6xl mb-6 animate-bounce">
        🎉
      </div>

      <h2 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Market Created!
      </h2>

      <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
        Your market is now live and ready for predictions.
      </p>

      {/* Preview Card */}
      <div 
        className="rounded-xl p-5 mb-8 text-left"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
          YOUR MARKET
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {marketQuestion}
        </h3>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link href={marketUrl}>
          <button className="btn-primary w-full px-6 py-3">
            View Market
          </button>
        </Link>
        
        <button
          onClick={() => router.push('/markets/create')}
          className="text-sm font-semibold"
          style={{ color: 'var(--accent-brand)' }}
        >
          Create Another Market
        </button>
      </div>
    </div>
  );
}
