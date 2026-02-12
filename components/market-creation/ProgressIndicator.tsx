'use client';

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Config' },
    { number: 3, label: 'Preview' },
  ];

  return (
    <div 
      className="sticky top-0 z-10 py-4 px-6 border-b backdrop-blur-sm"
      style={{ 
        background: 'var(--bg-header)',
        borderColor: 'rgba(255,255,255,0.05)'
      }}
    >
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                {/* Circle */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: step.number <= currentStep 
                      ? 'var(--accent-brand)' 
                      : 'rgba(255,255,255,0.1)',
                    color: step.number <= currentStep 
                      ? 'white' 
                      : 'var(--text-tertiary)',
                  }}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                
                {/* Label */}
                <span 
                  className="text-sm font-semibold hidden sm:inline"
                  style={{
                    color: step.number === currentStep 
                      ? 'var(--accent-brand)' 
                      : 'var(--text-tertiary)',
                  }}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className="flex-1 h-0.5 mx-2"
                  style={{
                    background: step.number < currentStep 
                      ? 'var(--accent-brand)' 
                      : 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
