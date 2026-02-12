import { NextRequest, NextResponse } from 'next/server';
import { validateForm, generateSlug, sanitizeInput } from '@/lib/marketValidation';
import { MarketCreationForm } from '@/types/market';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    // Simulate network delay
    await delay(1000);
    
    // Random error simulation (2% chance)
    if (Math.random() < 0.02) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to create market. Please try again.',
          },
        },
        { status: 500 }
      );
    }
    
    // Parse request body
    const body: MarketCreationForm = await request.json();
    
    // Sanitize inputs
    const sanitizedForm: MarketCreationForm = {
      question: sanitizeInput(body.question),
      description: body.description ? sanitizeInput(body.description) : undefined,
      category: body.category,
      closingDate: body.closingDate,
      resolutionCriteria: sanitizeInput(body.resolutionCriteria),
    };
    
    // Validate
    const errors = validateForm(sanitizedForm);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: errors[0].message,
            field: errors[0].field,
          },
        },
        { status: 400 }
      );
    }
    
    // Generate market ID and slug
    const marketId = `mkt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const slug = generateSlug(sanitizedForm.question);
    
    // In a real implementation, this would save to database
    // For V1, we just return success
    
    return NextResponse.json({
      success: true,
      market: {
        id: marketId,
        slug,
        question: sanitizedForm.question,
        url: `/markets/${slug}`,
      },
    });
    
  } catch (error) {
    console.error('Market creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
