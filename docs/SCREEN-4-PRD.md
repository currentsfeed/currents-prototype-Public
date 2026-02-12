# PRD: Screen 4 - Take Position Flow

## Problem Statement
Users can view markets but cannot place positions. This is the core monetization action — without it, the product has no value exchange. User research shows position placement must feel confident: users need to preview outcomes before committing funds.

**User need:** "I want to buy YES or NO shares on a market I believe in, see exactly what I'll get for my money, and feel confident in the transaction."

## Success Metrics
- **Primary:** 60%+ position completion rate (modal opened → position confirmed)
- **Secondary:** Average position size ≥ $20 (shows confidence)
- **Guardrail:** <2% "undo" support requests (shows clarity of UI)

## User Stories

### Position Entry
- As a **trader**, I want to **select YES or NO**, so that **I can take a position on my belief**
- As a **trader**, I want to **enter a dollar amount**, so that **I control my risk**
- As a **trader**, I want to **use a slider for position sizing**, so that **it's fast and intuitive**

### Position Preview
- As a **trader**, I want to **see exactly how many shares I'll receive**, so that **I understand the trade**
- As a **trader**, I want to **see potential outcomes (win/loss)**, so that **I can assess risk**
- As a **trader**, I want to **see current probability + my impact**, so that **I understand how my position affects the market**

### Confirmation & Success
- As a **trader**, I want to **review my position before submitting**, so that **I can catch mistakes**
- As a **trader**, I want **immediate visual feedback on success**, so that **I know my position is live**
- As a **trader**, I want to **see my updated balance**, so that **I know funds were deducted correctly**

### Error Handling
- As a **trader with insufficient balance**, I want **clear messaging**, so that **I know I need to add funds**
- As a **trader**, I want to **easily cancel mid-flow**, so that **I'm never forced to complete**

## Acceptance Criteria

### Open Position Modal (AC-4.1)
- **Given** user clicks "Place Answer" on any market
- **When** modal opens
- **Then** YES/NO selector is visible (YES selected by default)
- **And** amount input shows placeholder "$25"
- **And** user's balance is displayed ("Balance: $100 USDC")

### Select Side (AC-4.2)
- **Given** position modal is open
- **When** user clicks YES or NO
- **Then** selected side is visually highlighted
- **And** preview updates to reflect selected side

### Enter Amount - Input (AC-4.3)
- **Given** position modal is open
- **When** user types amount in input field
- **Then** input validates numeric only
- **And** shows error if amount > balance
- **And** shows error if amount < $1 minimum
- **And** preview updates in real-time

### Enter Amount - Slider (AC-4.4)
- **Given** position modal is open
- **When** user drags slider
- **Then** amount input updates
- **And** slider shows preset marks: $10, $25, $50, $100
- **And** preview updates in real-time

### Position Preview (AC-4.5)
- **Given** user has entered valid amount
- **When** preview renders
- **Then** shows:
  - "You'll receive: X shares @ $Y per share"
  - "Potential win: $Z (ROI: W%)"
  - "Current probability: X% → Your impact: +Y%"

### Confirmation Screen (AC-4.6)
- **Given** user clicks "Review Position"
- **When** confirmation screen shows
- **Then** displays full position summary:
  - Market question
  - Side (YES/NO) with color coding
  - Amount: $X
  - Shares: Y
  - Potential outcomes
- **And** "Confirm" + "Cancel" buttons are clear

### Submit Position (AC-4.7)
- **Given** user clicks "Confirm"
- **When** transaction processes
- **Then** loading indicator shows ("Processing...")
- **And** on success:
  - Success animation plays
  - Modal shows "Position placed!"
  - Updated balance displays
  - "View Position" button available
- **And** after 2 seconds, modal auto-closes

### Insufficient Balance (AC-4.8)
- **Given** user enters amount > balance
- **When** they try to proceed
- **Then** "Review Position" button is disabled
- **And** error message shows: "Insufficient balance. You have $X USDC."
- **And** "Add Funds" button appears (links to future funding flow)

### Cancel Flow (AC-4.9)
- **Given** user is in position flow
- **When** they click "Cancel" or close modal
- **Then** modal closes immediately
- **And** no position is created
- **And** no funds are deducted

## UI Requirements

### Modal Flow
1. **Entry:** Select side + enter amount (+ preview)
2. **Review:** Full position summary + confirm/cancel
3. **Success:** Animation + confirmation + auto-close

### Visual Design
- **YES side:** Green accent (`--accent-green`)
- **NO side:** Red accent (`--accent-red`)
- **Position preview:** Clear hierarchy, large numbers
- **Success animation:** Confetti or subtle celebration

### Responsive Behavior
- Desktop: Modal (max-width 540px)
- Mobile: Full-screen with header/close button

## Technical Requirements (V1 - Mock Implementation)

### Mock Blockchain
- **No real smart contract in V1**
- Backend simulates transaction with mock data
- Response time: 1-2s (realistic feel)
- Success rate: 95% (simulate occasional failures)

### Mock Wallet Balance
- Frontend hardcodes $100 USDC balance
- Position deducts from local state only (not persistent)
- Future: Real balance from smart contract

### API Contract
```typescript
POST /api/positions/create
{
  marketId: string;
  side: "YES" | "NO";
  amount: number; // USD
}

Response 200:
{
  success: true;
  position: {
    id: string;
    marketId: string;
    side: "YES" | "NO";
    amount: 25.00;
    shares: 62.5;
    pricePerShare: 0.40;
    createdAt: "2026-02-12T20:00:00Z"
  };
  newBalance: 75.00
}

Response 400:
{
  success: false;
  error: "INSUFFICIENT_BALANCE" | "INVALID_AMOUNT" | "MARKET_CLOSED"
  message: "User-friendly error message"
}
```

## Out of Scope (Deferred to Phase 1)
- Real smart contract integration
- Real wallet balance reading
- Gas fee estimation
- Transaction history
- Advanced order types (limit orders, etc.)
- Portfolio rebalancing

## Open Questions
- ✅ Position size limits? → Min $1, max $1000 per position
- ✅ Share price calculation? → Use simplified AMM formula (mock)
- ✅ Success animation style? → Subtle confetti + green checkmark

## Dependencies
- Auth system (Screen 3) — users must be logged in
- Backend `/api/positions/create` endpoint
- Market data API (to fetch current probability)
- Design system modal + form components

## Risk Assessment
- **Low:** Mock implementation simplifies scope significantly
- **Medium:** Users may confuse mock with real transactions → Mitigation: Add subtle "Demo Mode" badge

---

**Status:** Ready for UX Architect
**Last Updated:** 2026-02-12
