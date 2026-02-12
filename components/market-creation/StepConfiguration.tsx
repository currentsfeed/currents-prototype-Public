'use client';

import { MarketCreationForm } from '@/types/market';
import { FormField } from './FormField';

interface StepConfigurationProps {
  formData: Partial<MarketCreationForm>;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepConfiguration({ formData, errors, onChange, onNext, onBack }: StepConfigurationProps) {
  const criteriaChars = formData.resolutionCriteria?.length || 0;
  
  // Calculate min date (24h from now)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];
  
  // Calculate max date (365 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <h2 className="text-h2 mb-2">Market Configuration</h2>
      <p className="text-body mb-8">
        Set when your market closes and how it will be resolved.
      </p>

      <FormField
        label="Closing Date"
        required
        error={errors.closingDate}
        hint="Market will close for predictions on this date"
      >
        <input
          type="date"
          value={formData.closingDate || ''}
          onChange={e => onChange('closingDate', e.target.value)}
          min={minDateStr}
          max={maxDateStr}
          className="w-full px-4 py-3 rounded-xl text-base transition-all"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-brand)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </FormField>

      <FormField
        label="Resolution Criteria"
        required
        error={errors.resolutionCriteria}
        hint={`${criteriaChars}/300 characters - How will this market be resolved?`}
      >
        <textarea
          value={formData.resolutionCriteria || ''}
          onChange={e => onChange('resolutionCriteria', e.target.value)}
          placeholder="e.g., Resolves YES if Bitcoin trades at or above $100,000 on any major exchange (Coinbase, Binance, Kraken) before the closing date."
          maxLength={300}
          rows={5}
          className="w-full px-4 py-3 rounded-xl text-base transition-all resize-none"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-brand)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </FormField>

      <div className="flex items-center gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-6 py-3"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="btn-primary px-6 py-3 flex-1"
        >
          Preview →
        </button>
      </div>
    </div>
  );
}
