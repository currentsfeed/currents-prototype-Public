import { MarketCreationForm, ValidationError } from '@/types/market';

export function validateQuestion(question: string): string | null {
  if (!question || question.trim().length === 0) {
    return 'Question is required';
  }
  if (question.length < 10) {
    return 'Question must be at least 10 characters';
  }
  if (question.length > 200) {
    return 'Question must be less than 200 characters';
  }
  // Check for basic formatting
  const hasValidChars = /^[a-zA-Z0-9\s\?!.,'"-]+$/.test(question);
  if (!hasValidChars) {
    return 'Question contains invalid characters';
  }
  return null;
}

export function validateDescription(description?: string): string | null {
  if (!description) return null; // Optional field
  if (description.length > 500) {
    return 'Description must be less than 500 characters';
  }
  return null;
}

export function validateCategory(category: string): string | null {
  const validCategories = ['Politics', 'Technology', 'Entertainment', 'Sports', 'Finance', 'Media'];
  if (!category) {
    return 'Category is required';
  }
  if (!validCategories.includes(category)) {
    return 'Invalid category selected';
  }
  return null;
}

export function validateClosingDate(closingDate: string): string | null {
  if (!closingDate) {
    return 'Closing date is required';
  }
  
  const date = new Date(closingDate);
  const now = new Date();
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h
  const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // +365d
  
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  if (date < minDate) {
    return 'Closing date must be at least 24 hours in the future';
  }
  if (date > maxDate) {
    return 'Closing date must be within 365 days';
  }
  
  return null;
}

export function validateResolutionCriteria(criteria: string): string | null {
  if (!criteria || criteria.trim().length === 0) {
    return 'Resolution criteria is required';
  }
  if (criteria.length < 10) {
    return 'Resolution criteria must be at least 10 characters';
  }
  if (criteria.length > 300) {
    return 'Resolution criteria must be less than 300 characters';
  }
  return null;
}

export function validateForm(form: Partial<MarketCreationForm>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const questionError = form.question ? validateQuestion(form.question) : 'Question is required';
  if (questionError) errors.push({ field: 'question', message: questionError });
  
  const descriptionError = validateDescription(form.description);
  if (descriptionError) errors.push({ field: 'description', message: descriptionError });
  
  const categoryError = form.category ? validateCategory(form.category) : 'Category is required';
  if (categoryError) errors.push({ field: 'category', message: categoryError });
  
  const dateError = form.closingDate ? validateClosingDate(form.closingDate) : 'Closing date is required';
  if (dateError) errors.push({ field: 'closingDate', message: dateError });
  
  const criteriaError = form.resolutionCriteria ? validateResolutionCriteria(form.resolutionCriteria) : 'Resolution criteria is required';
  if (criteriaError) errors.push({ field: 'resolutionCriteria', message: criteriaError });
  
  return errors;
}

export function generateSlug(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

export function sanitizeInput(input: string): string {
  // Basic HTML/script tag removal
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}
