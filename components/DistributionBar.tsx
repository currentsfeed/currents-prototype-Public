'use client';

import { useEffect, useState } from 'react';

interface DistributionBarProps {
  yesPercentage: number;
}

export function DistributionBar({ yesPercentage }: DistributionBarProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const noPercentage = 100 - yesPercentage;

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => {
      setAnimatedPercentage(yesPercentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [yesPercentage]);

  return (
    <div>
      {/* Distribution Bar */}
      <div className="relative h-10 w-full rounded-lg overflow-hidden bg-red-100">
        <div
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${animatedPercentage}%` }}
        />
        
        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-semibold">
          <span className={`${yesPercentage > 15 ? 'text-white' : 'text-green-600'}`}>
            {yesPercentage.toFixed(0)}% YES
          </span>
          <span className={`${noPercentage > 15 ? 'text-white' : 'text-red-600'}`}>
            {noPercentage.toFixed(0)}% NO
          </span>
        </div>
      </div>
    </div>
  );
}
