'use client';

import { MarketCreationForm } from '@/types/market';

interface StepPreviewProps {
  formData: MarketCreationForm;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepPreview({ formData, onBack, onSubmit, isSubmitting }: StepPreviewProps) {
  const closingDate = new Date(formData.closingDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <h2 className="text-h2 mb-2">Preview Your Market</h2>
      <p className="text-body mb-8">
        Review how your market will appear to users. Click Create to publish.
      </p>

      {/* Preview Card */}
      <div 
        className="rounded-2xl border-2 border-dashed p-6 mb-6"
        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="mb-2 text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>
          Preview
        </div>
        
        <div 
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-card)' }}
        >
          {/* Category Badge */}
          <div className="mb-3">
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase"
              style={{ 
                background: 'rgba(255, 77, 42, 0.1)',
                color: 'var(--accent-brand)',
                border: '1px solid var(--accent-brand)',
              }}
            >
              {formData.category}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            {formData.question}
          </h3>

          {/* Description */}
          {formData.description && (
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {formData.description}
            </p>
          )}

          {/* Probability Bar (Mock) */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>
                  YES
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>
                  50%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: 'var(--accent-red)' }}>
                  50%
                </span>
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-red)' }}>
                  NO
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
              <div className="flex h-full">
                <div className="w-1/2" style={{ background: 'var(--accent-green)' }} />
                <div className="w-1/2" style={{ background: 'var(--accent-red)' }} />
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Closes {closingDate}
          </div>
        </div>
      </div>

      {/* Resolution Criteria */}
      <div 
        className="rounded-xl p-4 mb-6"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Resolution Criteria
        </div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {formData.resolutionCriteria}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="btn-secondary px-6 py-3"
        >
          ← Edit
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-primary px-6 py-3 flex-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            'Create Market 🎉'
          )}
        </button>
      </div>
    </div>
  );
}
