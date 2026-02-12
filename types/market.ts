// Market creation types
export type MarketCategory = 
  | 'Politics'
  | 'Technology'
  | 'Entertainment'
  | 'Sports'
  | 'Finance'
  | 'Media';

export interface MarketCreationForm {
  question: string;
  description?: string;
  category: MarketCategory;
  closingDate: string;
  resolutionCriteria: string;
  creatorId?: string;
  createdAt?: string;
}

export interface MarketCreationResponse {
  success: boolean;
  market?: {
    id: string;
    slug: string;
    question: string;
    url: string;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}
