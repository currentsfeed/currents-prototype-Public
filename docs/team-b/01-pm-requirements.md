# PM Requirements: Screens 5-6

## SCREEN 5: MY POSITIONS

### Problem Statement
Users who take positions on markets need visibility into their active bets, current P&L, and position management. Without a dedicated dashboard, users can't track performance or make informed decisions about closing positions. This reduces engagement and trust in the platform.

### Success Metrics
- Primary: 80%+ of users with positions visit dashboard within 24h of placing first position
- Secondary: Average session time on positions page > 45 seconds
- Guardrail: <2% error rate when loading positions

### User Stories

**As a trader, I want to:**
- View all my active positions in one place, so that I can track my portfolio
- See real-time P&L for each position, so that I can make informed decisions
- Filter positions by status (active/resolved), so that I can focus on what matters
- Quickly understand which positions are winning/losing, so that I can react accordingly
- Access position details and market context, so that I can evaluate my decisions

**As a new user, I want to:**
- See an encouraging empty state, so that I'm motivated to place my first position
- Understand what positions are, so that I can start participating

### Acceptance Criteria

**AC1: Position List Display**
- Given user has 1+ active positions
- When user navigates to /my-positions
- Then system displays list of all positions sorted by date (newest first)
- And each position shows: market question, current probability, position type (YES/NO), shares, entry price, current value, P&L ($ and %), status

**AC2: Empty State**
- Given user has no positions
- When user navigates to /my-positions
- Then system displays empty state with:
  - Clear illustration/icon
  - Headline: "No positions yet"
  - Subtext: "Explore markets and place your first prediction"
  - CTA button: "Browse Markets" → links to homepage

**AC3: P&L Calculation**
- Given user has position with entry price and current market price
- When position is displayed
- Then P&L is calculated as: (current_value - cost_basis)
- And P&L percentage = ((current_value - cost_basis) / cost_basis) * 100
- And positive P&L displays in green, negative in red, zero in neutral

**AC4: Position Filters**
- Given user has both active and resolved positions
- When user toggles filter (All/Active/Resolved)
- Then list updates to show only matching positions
- And filter state persists across page refreshes

**AC5: Responsive Layout**
- Given user accesses from mobile device
- When viewport < 768px
- Then positions display in stacked card layout
- And all critical info remains visible (no horizontal scroll)

### Out of Scope (V1)
- Position closing/selling (Phase 1)
- Position sharing (Phase 2)
- Portfolio analytics/charts (Phase 2)
- Export to CSV (Phase 2)
- Real-time WebSocket updates (using refresh for V1)

### Open Questions
- ✅ Should we show total portfolio value/P&L at top? → YES, add summary card
- ✅ Do we need pagination? → Not for V1 (mock data <20 items)
- ✅ Should resolved positions show resolution outcome? → YES

---

## SCREEN 6: MARKET CREATION FLOW

### Problem Statement
Platform requires user-generated content to scale. Currently only admins can create markets. Users have insights and topics they want to predict, but no path to contribute. Without creation flow, we lose engaged community members and market diversity.

### Success Metrics
- Primary: 5%+ of active users attempt to create a market in first month
- Secondary: 70%+ form completion rate (start → submit)
- Guardrail: <1% of created markets flagged for policy violations

### User Stories

**As a content creator, I want to:**
- Create prediction markets on topics I care about, so that I can contribute to the community
- Preview how my market will look, so that I can ensure quality before publishing
- Understand market creation rules, so that I can avoid mistakes
- Get feedback if my inputs are invalid, so that I can correct them quickly

**As a community moderator, I want to:**
- See clearly structured market data, so that I can review submissions efficiently
- Trust that creator inputs are sanitized, so that we avoid spam/abuse

### Acceptance Criteria

**AC1: Form Structure**
- Given user clicks "Create Market"
- When form loads
- Then system displays multi-step form with steps:
  1. Market Details (question, description, category)
  2. Market Configuration (closing date, resolution criteria)
  3. Preview & Confirm
- And progress indicator shows current step

**AC2: Question Validation**
- Given user enters market question
- When question field loses focus
- Then system validates:
  - Length: 10-200 characters
  - Ends with "?" or is a clear statement
  - No profanity/spam patterns
- And displays inline error if invalid

**AC3: Category Selection**
- Given user is on Market Details step
- When selecting category
- Then system displays dropdown with: Politics, Technology, Entertainment, Sports, Finance, Media
- And exactly one category must be selected

**AC4: Closing Date**
- Given user selects closing date
- When date is chosen
- Then system validates:
  - Date is in future (min 24h from now)
  - Date is ≤ 365 days from now
- And displays clear error if invalid

**AC5: Preview State**
- Given user completes steps 1-2
- When user reaches Preview step
- Then system displays market card exactly as it will appear on homepage
- And user can edit (back button) or confirm (create button)

**AC6: Success Flow**
- Given user clicks "Create Market" on preview
- When submission succeeds
- Then system:
  - Shows success screen with confetti/celebration animation
  - Displays "Market Created!" headline
  - Shows link to new market page
  - Shows CTA: "Create Another" or "View Market"

**AC7: Error Handling**
- Given submission fails (network/server error)
- When error occurs
- Then system:
  - Displays error message (not technical jargon)
  - Preserves form data (no data loss)
  - Offers retry button

**AC8: Mobile Experience**
- Given user on mobile device
- When form is displayed
- Then:
  - Form fields are touch-friendly (min 44px tap targets)
  - Keyboard appears with correct input type (text/date)
  - Progress indicator adapts to narrow screen

### Out of Scope (V1)
- Rich text editor for description (plain text only)
- Image upload (admin-curated images only)
- Market templates (Phase 2)
- Draft saving (Phase 2)
- Smart contract deployment (mocked for V1)

### Open Questions
- ✅ Should markets be published immediately or require approval? → Immediate for V1 (trust users)
- ✅ Do we need resolution source field? → Not for V1 (admin resolves)
- ✅ Should users stake tokens to create? → No for V1

---

## MOCK DATA STRATEGY

**For My Positions:**
- Create `mockPositions.ts` with 5-10 sample positions
- Mix of active/resolved, winning/losing
- Use existing market data for consistency

**For Market Creation:**
- API POST /api/markets/create returns success after 1s delay
- Generate random market ID
- Store in localStorage (no real backend for V1)

---

**PM Sign-off:** Ready for UX Architect
**Date:** 2026-02-12 20:20 UTC
