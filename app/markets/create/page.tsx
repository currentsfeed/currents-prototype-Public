'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarketCreationForm, MarketCreationResponse } from '@/types/market';
import { 
  validateQuestion, 
  validateDescription, 
  validateCategory, 
  validateClosingDate, 
  validateResolutionCriteria 
} from '@/lib/marketValidation';
import { ProgressIndicator } from '@/components/market-creation/ProgressIndicator';
import { StepDetails } from '@/components/market-creation/StepDetails';
import { StepConfiguration } from '@/components/market-creation/StepConfiguration';
import { StepPreview } from '@/components/market-creation/StepPreview';
import { SuccessScreen } from '@/components/market-creation/SuccessScreen';

export default function CreateMarketPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<MarketCreationForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMarket, setCreatedMarket] = useState<{ url: string; question: string } | null>(null);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const questionError = validateQuestion(formData.question || '');
      if (questionError) newErrors.question = questionError;

      const descriptionError = validateDescription(formData.description);
      if (descriptionError) newErrors.description = descriptionError;

      const categoryError = validateCategory(formData.category || '');
      if (categoryError) newErrors.category = categoryError;
    }

    if (step === 2) {
      const dateError = validateClosingDate(formData.closingDate || '');
      if (dateError) newErrors.closingDate = dateError;

      const criteriaError = validateResolutionCriteria(formData.resolutionCriteria || '');
      if (criteriaError) newErrors.resolutionCriteria = criteriaError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    setCurrentStep((currentStep - 1) as 1 | 2 | 3);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      router.push('/');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/markets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: MarketCreationResponse = await response.json();

      if (!data.success) {
        if (data.error?.field) {
          setErrors({ [data.error.field]: data.error.message });
          // Go back to appropriate step
          if (['question', 'description', 'category'].includes(data.error.field)) {
            setCurrentStep(1);
          } else {
            setCurrentStep(2);
          }
        } else {
          alert(data.error?.message || 'Failed to create market. Please try again.');
        }
        return;
      }

      if (data.market) {
        setCreatedMarket({
          url: data.market.url,
          question: data.market.question,
        });
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again.');
      console.error('Market creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (createdMarket) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <header className="header">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{ background: 'var(--accent-brand)' }} />
                <span className="text-xl font-bold">Currents</span>
              </Link>
            </div>
          </div>
        </header>
        <SuccessScreen marketUrl={createdMarket.url} marketQuestion={createdMarket.question} />
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="header">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full" style={{ background: 'var(--accent-brand)' }} />
              <span className="text-xl font-bold">Currents</span>
            </Link>
            <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Create Market
            </span>
          </div>
        </div>
      </header>

      <ProgressIndicator currentStep={currentStep} />

      <main className="pb-16">
        {currentStep === 1 && (
          <StepDetails
            formData={formData}
            errors={errors}
            onChange={updateField}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 2 && (
          <StepConfiguration
            formData={formData}
            errors={errors}
            onChange={updateField}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <StepPreview
            formData={formData as MarketCreationForm}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
}
