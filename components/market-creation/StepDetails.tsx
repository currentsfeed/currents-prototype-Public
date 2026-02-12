'use client';

import { MarketCreationForm, MarketCategory } from '@/types/market';
import { FormField } from './FormField';

interface StepDetailsProps {
  formData: Partial<MarketCreationForm>;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onCancel: () => void;
}

const categories: MarketCategory[] = [
  'Politics',
  'Technology',
  'Entertainment',
  'Sports',
  'Finance',
  'Media',
];

export function StepDetails({ formData, errors, onChange, onNext, onCancel }: StepDetailsProps) {
  const questionChars = formData.question?.length || 0;
  const descriptionChars = formData.description?.length || 0;

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <h2 className="text-h2 mb-2">Market Details</h2>
      <p className="text-body mb-8">
        Create a clear, unambiguous question that can be resolved objectively.
      </p>

      <FormField
        label="Market Question"
        required
        error={errors.question}
        hint={`${questionChars}/200 characters`}
      >
        <input
          type="text"
          value={formData.question || ''}
          onChange={e => onChange('question', e.target.value)}
          placeholder="e.g., Will Bitcoin reach $100k by end of 2026?"
          maxLength={200}
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
        label="Description"
        error={errors.description}
        hint={`${descriptionChars}/500 characters (optional)`}
      >
        <textarea
          value={formData.description || ''}
          onChange={e => onChange('description', e.target.value)}
          placeholder="Add context or clarification for your market..."
          maxLength={500}
          rows={4}
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

      <FormField
        label="Category"
        required
        error={errors.category}
      >
        <select
          value={formData.category || ''}
          onChange={e => onChange('category', e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-base transition-all"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: formData.category ? 'var(--text-primary)' : 'var(--text-tertiary)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-brand)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex items-center gap-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary px-6 py-3"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          className="btn-primary px-6 py-3 flex-1"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
