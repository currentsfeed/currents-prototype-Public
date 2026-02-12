# Architecture: Screen 4 - Take Position Flow

## System Overview

### Technology Stack (V1 - Mock Implementation)
- **Frontend:** Next.js 14, React 19, TypeScript
- **State:** React hooks (useState, useReducer)
- **Backend:** Next.js API Routes (mock logic)
- **Smart Contract:** **Mock only** (real implementation = Phase 1)
- **Pricing:** Simplified AMM formula (mock)

### Mock vs. Real Comparison
| Component | V1 (Mock) | Phase 1 (Real) |
|-----------|-----------|----------------|
| Position creation | API call, instant | Smart contract transaction, 10-30s |
| Wallet balance | Frontend hardcoded | On-chain balance read |
| Share price | Mock AMM formula | Real AMM (Uniswap-style) |
| Transaction | Simulated (success/fail) | Real blockchain tx |
| Gas fees | N/A | Estimate + pay gas |
| Confirmation | Instant | Wait for block confirmation |

---

## ADR-004: Mock Implementation Strategy

**Context:** V1 needs functional UI without blockchain integration.

**Problem:** How to simulate realistic trading experience?

**Options:**
1. **Fully static** — Hardcoded responses, no calculations
2. **Realistic mock** — Calculate shares, simulate latency, occasional failures
3. **Testnet integration** — Deploy to testnet, use real contracts

**Decision:** **Realistic mock** (Option 2)

**Rationale:**
- Testnet too slow/unreliable for MVP
- Static mock feels broken to users
- Realistic mock validates full UI/UX flow
- Easy transition to real contracts later

**Implementation:**
```typescript
// Mock AMM formula (constant product)
const calculateShares = (amount: number, currentPrice: number): number => {
  const k = 10000; // Constant product (mock)
  const shares = amount / currentPrice;
  return shares;
};

// Simulate network latency
const mockTransactionDelay = () => {
  return new Promise(resolve => 
    setTimeout(resolve, 1000 + Math.random() * 1000) // 1-2s
  );
};

// Simulate occasional failures (5%)
const mockTransactionSuccess = () => Math.random() > 0.05;
```

**Consequences:**
- Frontend code ~90% reusable for Phase 1
- Users understand it's a demo (add "Demo Mode" badge)
- Backend API contract designed for real implementation
- Easy A/B test: mock vs. real when Phase 1 launches

---

## ADR-005: Position State Management

**Context:** Position flow has complex state (side, amount, preview, confirmation).

**Options:**
1. **Multiple useState** — Simple but verbose
2. **useReducer** — More structured, single source of truth
3. **External state (Zustand)** — Overkill for local modal state

**Decision:** **useReducer** with clear action types

**Rationale:**
- Reducer pattern ideal for multi-step flows
- Clear state transitions (entry → preview → confirm → success)
- Easier to test (pure functions)
- Time-travel debugging in dev

**Implementation:**
```typescript
interface PositionState {
  step: 'entry' | 'confirmation' | 'loading' | 'success' | 'error';
  side: 'YES' | 'NO';
  amount: number;
  shares: number | null;
  pricePerShare: number | null;
  error: string | null;
}

type PositionAction =
  | { type: 'SET_SIDE'; side: 'YES' | 'NO' }
  | { type: 'SET_AMOUNT'; amount: number }
  | { type: 'UPDATE_PREVIEW'; shares: number; pricePerShare: number }
  | { type: 'CONFIRM' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; positionId: string }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

const positionReducer = (state: PositionState, action: PositionAction): PositionState => {
  switch (action.type) {
    case 'SET_SIDE':
      return { ...state, side: action.side };
    case 'SET_AMOUNT':
      return { ...state, amount: action.amount };
    // ... etc
  }
};
```

**Consequences:**
- Slightly more code upfront
- Much easier to reason about state transitions
- Clear audit trail of user actions

---

## ADR-006: Preview Calculation Strategy

**Context:** Position preview must update as user types/drags slider.

**Problem:** Balance between reactivity and performance.

**Options:**
1. **Calculate on every keystroke** — Laggy, wasteful
2. **Debounce calculations** — Better, but still reacts to invalid input
3. **Debounce + validate first** — Optimal

**Decision:** **Debounce (300ms) + validate first**

**Rationale:**
- Instant feedback feels responsive
- 300ms debounce avoids excessive calculations
- Validation prevents errors from reaching preview

**Implementation:**
```typescript
const [amount, setAmount] = useState(25);
const [preview, setPreview] = useState<Preview | null>(null);

const calculatePreview = useCallback(
  debounce(async (amt: number, side: 'YES' | 'NO') => {
    if (amt < 1 || amt > balance) return; // Skip invalid
    
    const result = await fetch('/api/positions/preview', {
      method: 'POST',
      body: JSON.stringify({ marketId, side, amount: amt })
    }).then(r => r.json());
    
    setPreview(result);
  }, 300), // 300ms debounce
  [marketId, balance]
);

useEffect(() => {
  calculatePreview(amount, side);
}, [amount, side, calculatePreview]);
```

**Consequences:**
- Responsive without being wasteful
- Backend can cache preview calculations
- Easy to add loading indicator if preview takes >500ms

---

## Data Models

### Position (Frontend State)
```typescript
interface Position {
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;                // USD
  shares: number;                // Calculated
  pricePerShare: number;         // Current price
  potentialWin: number;          // If prediction correct
  potentialLoss: number;         // If prediction incorrect
  roi: number;                   // % return if win
  marketImpact: number;          // % change in probability
}
```

### Position (API Response)
```typescript
interface PositionResponse {
  id: string;                    // UUID
  userId: string;                // From auth
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;
  shares: number;
  pricePerShare: number;
  createdAt: string;             // ISO 8601
  status: 'active' | 'closed' | 'resolved';
}
```

### Market State (for calculations)
```typescript
interface MarketState {
  id: string;
  currentProbability: number;    // 0-100 (%)
  totalYesShares: number;        // Total YES shares outstanding
  totalNoShares: number;         // Total NO shares outstanding
  liquidityPool: number;         // Total USDC in pool (mock: $10k per market)
}
```

---

## API Contracts

### POST /api/positions/preview
**Purpose:** Calculate position preview without committing

**Request:**
```typescript
{
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;                // USD (1-1000)
}
```

**Response 200:**
```typescript
{
  success: true;
  preview: {
    shares: 62.5;
    pricePerShare: 0.40;
    potentialWin: 37.50;         // If correct
    potentialLoss: 25.00;        // If incorrect (amount)
    roi: 150;                    // % (win / amount * 100)
    currentProbability: 40;      // Before trade
    newProbability: 42;          // After trade
    marketImpact: 2;             // Percentage point change
  }
}
```

**Response 400:**
```typescript
{
  success: false;
  error: 'INVALID_AMOUNT' | 'MARKET_CLOSED' | 'MARKET_NOT_FOUND';
  message: string;
}
```

### POST /api/positions/create
**Purpose:** Create position (mock transaction)

**Request:**
```typescript
{
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;
}
```

**Response 200:**
```typescript
{
  success: true;
  position: {
    id: string;
    marketId: string;
    side: 'YES' | 'NO';
    amount: 25.00;
    shares: 62.5;
    pricePerShare: 0.40;
    createdAt: '2026-02-12T20:00:00Z';
  };
  newBalance: 75.00;             // Updated user balance
  market: {
    currentProbability: 42;      // Updated market probability
  }
}
```

**Response 400:**
```typescript
{
  success: false;
  error: 'INSUFFICIENT_BALANCE' | 'INVALID_AMOUNT' | 'MARKET_CLOSED';
  message: string;
}
```

**Response 500:**
```typescript
{
  success: false;
  error: 'SERVER_ERROR' | 'TRANSACTION_FAILED';
  message: string;
}
```

---

## Mock AMM Pricing Formula

### Simplified Constant Product AMM
```typescript
// Mock implementation (real = Uniswap V2 style)
const calculatePrice = (side: 'YES' | 'NO', market: MarketState): number => {
  const yesShares = market.totalYesShares;
  const noShares = market.totalNoShares;
  
  // Price = opposite shares / total shares
  if (side === 'YES') {
    return noShares / (yesShares + noShares);
  } else {
    return yesShares / (yesShares + noShares);
  }
};

const calculateShares = (
  amount: number,
  side: 'YES' | 'NO',
  market: MarketState
): number => {
  const price = calculatePrice(side, market);
  return amount / price;
};

const calculateNewProbability = (
  side: 'YES' | 'NO',
  sharesBought: number,
  market: MarketState
): number => {
  const newYesShares = market.totalYesShares + (side === 'YES' ? sharesBought : 0);
  const newNoShares = market.totalNoShares + (side === 'NO' ? sharesBought : 0);
  
  return (newYesShares / (newYesShares + newNoShares)) * 100;
};
```

**Assumptions (Mock):**
- Each market starts with 5000 YES + 5000 NO shares (50/50 probability)
- Liquidity pool: $10,000 per market
- No fees for MVP (real implementation will have 1-2% fee)
- No slippage protection (real implementation needs this)

---

## Security Considerations

### Authentication
- **Requirement:** User must be authenticated (check auth cookie)
- **Implementation:** Middleware validates session before position creation

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('privy-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/api/positions')) {
    return new NextResponse(
      JSON.stringify({ error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
}
```

### Input Validation
```typescript
const validatePositionRequest = (body: any): ValidationResult => {
  if (!body.marketId || typeof body.marketId !== 'string') {
    return { valid: false, error: 'Invalid market ID' };
  }
  
  if (!['YES', 'NO'].includes(body.side)) {
    return { valid: false, error: 'Side must be YES or NO' };
  }
  
  if (typeof body.amount !== 'number' || body.amount < 1 || body.amount > 1000) {
    return { valid: false, error: 'Amount must be between $1 and $1,000' };
  }
  
  return { valid: true };
};
```

### Rate Limiting
```typescript
const POSITION_RATE_LIMITS = {
  windowMs: 60 * 1000,           // 1 minute
  max: 10,                       // 10 positions per minute
  message: 'Too many positions. Please wait.'
};
```

---

## Performance Requirements

### Target Metrics
- **Modal open:** <100ms
- **Preview calculation:** <200ms
- **Position creation:** 1-2s (simulated transaction time)
- **Success animation:** <500ms

### Optimization Strategies
1. **Debounced preview:** Avoid excessive API calls
2. **Optimistic UI:** Update UI before API confirms
3. **Prefetch market data:** Load on page, not on modal open
4. **Cancel pending requests:** If user changes input mid-flight

```typescript
// Cancel previous preview request if new one starts
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/positions/preview', {
    method: 'POST',
    body: JSON.stringify({ marketId, side, amount }),
    signal: controller.signal
  });
  
  return () => controller.abort(); // Cancel on new input
}, [amount, side]);
```

---

## Error Handling

### Error Categories
1. **User errors** (insufficient balance) → Clear message, show solution
2. **Network errors** (API timeout) → Retry button, preserve state
3. **Server errors** (transaction failed) → Log error, show generic message

### Retry Strategy
```typescript
const createPosition = async (data: PositionData, retries = 2): Promise<Position> => {
  try {
    const response = await fetch('/api/positions/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (error.error === 'INSUFFICIENT_BALANCE') {
        throw new UserError(error.message);
      }
      throw new ServerError(error.message);
    }
    
    return await response.json();
  } catch (error) {
    if (retries > 0 && error instanceof NetworkError) {
      await sleep(1000);
      return createPosition(data, retries - 1);
    }
    throw error;
  }
};
```

---

## Monitoring & Observability

### Key Metrics
1. **Position completion rate** = created / modal opened
2. **Drop-off points** = where users abandon flow
3. **Average position size** = median amount
4. **Side distribution** = YES % vs. NO %
5. **Error rate by type** = insufficient balance, network, server

### Event Tracking
```typescript
// Track user flow
analytics.track('position_modal_opened', { marketId });
analytics.track('position_side_selected', { side });
analytics.track('position_amount_entered', { amount });
analytics.track('position_confirmed', { side, amount });
analytics.track('position_created', { 
  positionId, 
  side, 
  amount, 
  shares,
  duration: Date.now() - startTime
});
```

### Logging
```typescript
logger.info('position.preview', { marketId, side, amount, shares, pricePerShare });
logger.info('position.created', { positionId, userId, marketId, side, amount });
logger.error('position.failed', { error, marketId, side, amount, userId });
```

---

## Testing Strategy

### Unit Tests
- `calculatePrice()` returns correct prices
- `calculateShares()` returns correct shares
- Reducer state transitions
- Input validation functions

### Integration Tests
- Preview API returns valid data
- Create API creates position and updates balance
- Error responses for invalid input
- Rate limiting enforced

### E2E Tests (Playwright)
- Full flow: Open modal → Select YES → Enter $50 → Confirm → Success
- Error recovery: Try $200 (insufficient) → See error → Adjust to $50 → Success
- Cancel mid-flow: Open modal → Enter data → Close → No position created
- Slider interaction: Drag slider → Preview updates → Confirm → Success

---

## Phase 1 Transition Plan

### Backend Changes (Mock → Real)
1. Replace mock AMM with real smart contract calls
2. Add gas estimation endpoint
3. Add transaction status polling
4. Add wallet balance reading (on-chain)
5. Add transaction history storage

### Frontend Changes (Mock → Real)
1. Add MetaMask transaction prompts
2. Add loading state during confirmation (10-30s)
3. Add transaction hash display
4. Add "View on Etherscan" link
5. Add gas fee display in preview

### API Contract Compatibility
```typescript
// V1 (Mock)
POST /api/positions/create { marketId, side, amount }
→ Instant response

// Phase 1 (Real)
POST /api/positions/create { marketId, side, amount }
→ Returns { transactionHash, status: 'pending' }

GET /api/positions/:id/status
→ Poll until status: 'confirmed'
```

---

## Scalability Considerations

### Current Target: 1,000 concurrent users
- In-memory market state (mock data)
- Serverless API routes scale automatically
- No database writes (all mock)

### Phase 1 (Real Blockchain)
- RPC node handling (Infura/Alchemy)
- Transaction queue management
- Database for transaction tracking
- Websocket for real-time updates

---

**Status:** Ready for Engineers
**Dependencies:** Auth system (Screen 3), Market data API
**Last Updated:** 2026-02-12
