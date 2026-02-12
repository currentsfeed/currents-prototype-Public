'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({ label, required, error, children, hint }: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="block mb-2">
        <span 
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--accent-red)' }}> *</span>}
        </span>
      </label>
      
      {children}
      
      {hint && !error && (
        <div 
          className="text-xs mt-1"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {hint}
        </div>
      )}
      
      {error && (
        <div 
          className="text-xs mt-1 flex items-center gap-1"
          style={{ color: 'var(--accent-red)' }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
