# Architect: Technical Specifications - Screens 5-6

## SYSTEM OVERVIEW

Both screens are client-side heavy with mock API integration. Real blockchain integration deferred to Phase 1.

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS (existing config)
- Client-side state (useState/useReducer)
- Mock APIs (route handlers)

---

## SCREEN 5: MY POSITIONS — ARCHITECTURE

### Data Model

```typescript
// types/position.ts
export interface Position {
  id: string;                    // Unique position ID
  userId: string;                // Owner user ID
  marketId: string;              // Market this position is for
  marketSlug: string;            // Market URL slug
  marketQuestion: string;        // Market question text
  marketImageUrl: string;        // Market image
  category: string;              // Market category
  
  // Position details
  side: 'YES' | 'NO';            // Position type
  shares: number;                // Number of shares
  avgPrice: number;              // Average entry price per share
  costBasis: number;             // Total cost (shares * avgPrice)
  
  // Current state
  currentProbability: number;    // Current market probability (0-100)
  currentValue: number;          // Current position value
  unrealizedPnL: number;         // Current P&L ($)
  unrealizedPnLPercent: number;  // Current P&L (%)
  
  // Status
  status: 'active' | 'resolved';
  resolvedOutcome?: 'YES' | 'NO' | 'INVALID'; // If resolved
  realizedPnL?: number;          // Final P&L if resolved
  
  // Metadata
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

export interface PositionSummary {
  totalValue: number;            // Sum of all current values
  totalCostBasis: number;        // Sum of all cost bases
  totalPnL: number;              // Sum of unrealized P&L
  totalPnLPercent: number;       // Overall P&L %
  activeCount: number;           // Number of active positions
  resolvedCount: number;         // Number of resolved positions
}
```

### API Contract: GET /api/users/me/positions

**Request:**
```typescript
GET /api/users/me/positions?status=all|active|resolved
Headers:
  Authorization: Bearer {token}  // V1: Mock, not enforced
```

**Response (Success):**
```typescript
{
  success: true,
  data: {
    summary: PositionSummary,
    positions: Position[]
  },
  meta: {
    total: number,
    filtered: number,
    timestamp: string
  }
}
```

**Response (Error):**
```typescript
{
  success: false,
  error: {
    code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR',
    message: string
  }
}
```

**Mock Implementation:**
- Read from `/data/mockPositions.ts`
- Filter by status param
- Calculate summary dynamically
- Simulate 500ms network delay
- 95% success rate (5% random error for testing)

### File Structure

```
app/
  my-positions/
    page.tsx                    # Main page component
    loading.tsx                 # Loading state
    error.tsx                   # Error boundary

components/
  positions/
    PositionCard.tsx            # Individual position card
    PositionSummary.tsx         # Summary card component
    PositionFilters.tsx         # Filter tabs component
    PositionEmptyState.tsx      # Empty state component
    PositionSkeleton.tsx        # Loading skeleton

lib/
  positions/
    positionUtils.ts            # P&L calculation helpers
    mockPositions.ts            # Mock data generator

types/
  position.ts                   # TypeScript interfaces

api/
  users/
    me/
      positions/
        route.ts                # API endpoint
```

### Business Logic

**P&L Calculation:**
```typescript
// For YES positions:
currentValue = shares * (currentProbability / 100)
unrealizedPnL = currentValue - costBasis
unrealizedPnLPercent = (unrealizedPnL / costBasis) * 100

// For NO positions:
currentValue = shares * ((100 - currentProbability) / 100)
unrealizedPnL = currentValue - costBasis
unrealizedPnLPercent = (unrealizedPnL / costBasis) * 100

// For resolved positions (status = 'resolved'):
if (resolvedOutcome === side) {
  realizedPnL = shares - costBasis  // Won
} else if (resolvedOutcome === 'INVALID') {
  realizedPnL = 0  // Refunded (break-even)
} else {
  realizedPnL = -costBasis  // Lost
}
```

**Summary Calculation:**
```typescript
totalValue = sum(positions.map(p => p.currentValue))
totalCostBasis = sum(positions.map(p => p.costBasis))
totalPnL = totalValue - totalCostBasis
totalPnLPercent = (totalPnL / totalCostBasis) * 100
activeCount = positions.filter(p => p.status === 'active').length
resolvedCount = positions.filter(p => p.status === 'resolved').length
```

### State Management

```typescript
// Client-side state (no global store needed for V1)
const [positions, setPositions] = useState<Position[]>([]);
const [summary, setSummary] = useState<PositionSummary | null>(null);
const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Fetch on mount + filter change
useEffect(() => {
  fetchPositions(filter);
}, [filter]);
```

### Performance Considerations

- **Initial Load:** <2s for 20 positions
- **Filtering:** Instant (client-side)
- **Images:** Lazy load below fold
- **Skeleton:** Show immediately while fetching

---

## SCREEN 6: MARKET CREATION — ARCHITECTURE

### Data Model

```typescript
// types/market.ts
export interface MarketCreationForm {
  // Step 1: Details
  question: string;              // 10-200 chars
  description?: string;          // 0-500 chars
  category: MarketCategory;      // Required
  
  // Step 2: Configuration
  closingDate: string;           // ISO date, future
  resolutionCriteria: string;    // 10-300 chars
  
  // Metadata (auto-generated)
  creatorId?: string;
  createdAt?: string;
}

export type MarketCategory = 
  | 'Politics'
  | 'Technology'
  | 'Entertainment'
  | 'Sports'
  | 'Finance'
  | 'Media';

export interface MarketCreationResponse {
  success: boolean;
  market?: {
    id: string;
    slug: string;
    question: string;
    url: string;                 // Full market URL
  };
  error?: {
    code: string;
    message: string;
    field?: string;              // Which field failed validation
  };
}
```

### API Contract: POST /api/markets/create

**Request:**
```typescript
POST /api/markets/create
Headers:
  Content-Type: application/json
  Authorization: Bearer {token}  // V1: Mock

Body:
{
  question: string,
  description?: string,
  category: MarketCategory,
  closingDate: string,
  resolutionCriteria: string
}
```

**Response (Success):**
```typescript
{
  success: true,
  market: {
    id: "mkt_abc123",
    slug: "will-ai-replace-50-jobs-by-2030",
    question: "Will AI replace 50% of jobs by 2030?",
    url: "/markets/will-ai-replace-50-jobs-by-2030"
  }
}
```

**Response (Error - Validation):**
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Question must be 10-200 characters",
    field: "question"
  }
}
```

**Response (Error - Server):**
```typescript
{
  success: false,
  error: {
    code: "SERVER_ERROR",
    message: "Failed to create market. Please try again."
  }
}
```

**Mock Implementation:**
- Validate all fields server-side (double-check client validation)
- Generate random market ID: `mkt_${Date.now()}_${randomString}`
- Generate slug from question: lowercase, replace spaces with hyphens, remove special chars
- Store in localStorage (key: `markets_created_${userId}`)
- Simulate 1000ms network delay
- 98% success rate (2% random error for testing)

### Validation Rules

**Client-Side (Immediate Feedback):**
```typescript
// Question
- Required
- Min: 10 chars
- Max: 200 chars
- Regex: /^[a-zA-Z0-9\s\?!.,-]+$/  // No special HTML chars

// Description
- Optional
- Max: 500 chars

// Category
- Required
- Must be one of valid categories

// Closing Date
- Required
- Must be future date (min: now + 24h)
- Max: now + 365 days
- Must be valid ISO date

// Resolution Criteria
- Required
- Min: 10 chars
- Max: 300 chars
```

**Server-Side (Security Layer):**
```typescript
- All client-side rules enforced again
- HTML sanitization (strip tags)
- XSS prevention
- Rate limiting (10 markets per user per day)
```

### File Structure

```
app/
  markets/
    create/
      page.tsx                  # Main creation page
      layout.tsx                # Wrapper with progress indicator

components/
  market-creation/
    ProgressIndicator.tsx       # Step progress bar
    StepDetails.tsx             # Step 1 component
    StepConfiguration.tsx       # Step 2 component
    StepPreview.tsx             # Step 3 component
    SuccessScreen.tsx           # Post-creation screen
    FormField.tsx               # Reusable form input component
    ValidationMessage.tsx       # Error message component

lib/
  market-creation/
    validation.ts               # Validation functions
    slugify.ts                  # Slug generator
    formState.ts                # Form state management

api/
  markets/
    create/
      route.ts                  # Creation endpoint

hooks/
  useMarketCreation.ts          # Custom hook for form logic
```

### State Management

```typescript
// Multi-step form state
interface FormState {
  currentStep: 1 | 2 | 3;
  data: MarketCreationForm;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

// Custom hook
const useMarketCreation = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const updateField = (field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };
  
  const validateField = (field: string) => {
    const error = validate(field, state.data[field]);
    dispatch({ type: 'SET_ERROR', field, error });
    return !error;
  };
  
  const nextStep = () => {
    const valid = validateCurrentStep(state);
    if (valid) dispatch({ type: 'NEXT_STEP' });
  };
  
  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  const submitMarket = async () => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const response = await createMarket(state.data);
      dispatch({ type: 'SUBMIT_SUCCESS', response });
      return response;
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', error });
      throw error;
    }
  };
  
  return {
    state,
    updateField,
    validateField,
    nextStep,
    prevStep,
    submitMarket
  };
};
```

### Form Persistence

**V1: No persistence (acceptable for prototype)**
- If user navigates away, data is lost
- Future: Save to localStorage on each field change
- Future: "Save as draft" feature

### Security Considerations

**XSS Prevention:**
```typescript
// Sanitize user inputs
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],      // No HTML tags allowed
    ALLOWED_ATTR: []       // No attributes
  });
};
```

**Rate Limiting:**
```typescript
// Track creation attempts per IP/user
const rateLimit = {
  max: 10,                       // Max markets per day
  window: 86400000,              // 24 hours
  storage: 'memory'              // V1: in-memory, Phase 1: Redis
};
```

---

## SHARED UTILITIES

### Slug Generation

```typescript
// lib/shared/slugify.ts
export function generateSlug(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special chars
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with single
    .substring(0, 100);          // Max 100 chars
}
```

### Date Utilities

```typescript
// lib/shared/dateUtils.ts
export function isValidClosingDate(date: string): boolean {
  const d = new Date(date);
  const now = new Date();
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h
  const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // +365d
  
  return d >= minDate && d <= maxDate;
}

export function formatRelativeTime(date: string): string {
  // "Closes in 5 days", "Closes tomorrow", etc.
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  if (diffDays === 0) return 'Closes today';
  if (diffDays === 1) return 'Closes tomorrow';
  if (diffDays < 7) return `Closes in ${diffDays} days`;
  if (diffDays < 30) return `Closes in ${Math.floor(diffDays / 7)} weeks`;
  return `Closes in ${Math.floor(diffDays / 30)} months`;
}
```

---

## DATABASE SCHEMA (Mock V1, Real Phase 1)

### Positions Table (Future)
```sql
CREATE TABLE positions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  market_id UUID NOT NULL REFERENCES markets(id),
  side VARCHAR(3) NOT NULL CHECK (side IN ('YES', 'NO')),
  shares DECIMAL(18, 6) NOT NULL,
  avg_price DECIMAL(18, 6) NOT NULL,
  cost_basis DECIMAL(18, 6) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'active',
  resolved_outcome VARCHAR(10),
  realized_pnl DECIMAL(18, 6),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_positions (user_id, status),
  INDEX idx_market_positions (market_id)
);
```

### Markets Table (Future)
```sql
CREATE TABLE markets (
  id UUID PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  question TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  closing_date TIMESTAMP NOT NULL,
  resolution_criteria TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'active',
  resolved_outcome VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_status_category (status, category),
  INDEX idx_closing_date (closing_date)
);
```

---

## DEPLOYMENT CONFIGURATION

**Environment Variables:**
```bash
# V1 (Mock)
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_API_DELAY=500           # Simulate network delay

# Phase 1 (Real)
DATABASE_URL=postgresql://...
BLOCKCHAIN_RPC_URL=https://...
SMART_CONTRACT_ADDRESS=0x...
```

**Build Command:**
```bash
npm run build
# Outputs: .next/ directory (static + server)
```

**Vercel Deployment:**
- Auto-deploy on push to main
- Preview URLs for PRs
- Environment variables configured in dashboard

---

**Architect Sign-off:** Technical specs complete, ready for implementation
**Date:** 2026-02-12 20:30 UTC
