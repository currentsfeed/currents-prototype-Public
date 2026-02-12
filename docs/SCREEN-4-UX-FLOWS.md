# UX Flows: Screen 4 - Take Position Flow

## User Flow 1: Buy YES Position (Happy Path)

**Entry Point:** Market page → "Place Answer" button

### Happy Path
1. User clicks "Place Answer" button on market card
2. Modal opens: "Take a Position"
3. Market question displayed at top (context)
4. YES/NO toggle selector (YES selected by default, green highlighted)
5. User sees balance: "Balance: $100 USDC" (top-right)
6. Amount input shows placeholder: "$25"
7. Slider below input (preset marks: $10, $25, $50, $100)
8. **Preview section updates in real-time:**
   - "You'll receive: **62.5 shares** @ $0.40/share"
   - "Potential win: **$37.50** (150% ROI)"
   - "Current: 40% → After you: 42% (+2%)"
9. User adjusts slider to $50
10. Preview updates instantly:
    - "You'll receive: **125 shares** @ $0.40/share"
    - "Potential win: **$75** (150% ROI)"
    - etc.
11. User clicks "Review Position"
12. **Confirmation screen:**
    - Large: "**BUY YES**" (green)
    - Market question
    - Amount: $50
    - Shares: 125 @ $0.40
    - Potential outcomes (win/loss)
    - Buttons: "Confirm" (green) + "Cancel" (subtle)
13. User clicks "Confirm"
14. Loading: "Processing your position..." (spinner)
15. **Success screen:**
    - ✓ animation (confetti)
    - "Position placed!"
    - "You bought 125 YES shares for $50"
    - New balance: "$50 USDC"
    - Buttons: "View Position" + "Place Another"
16. After 2s: Modal auto-closes (or user clicks button)
17. Returns to market page (probability updated)

### Error Paths
- **Insufficient balance:**
  - User enters $150 (balance is $100)
  - Input shows red outline
  - Error text: "Insufficient balance. You have $100 USDC."
  - "Review Position" button disabled
  - "Add Funds" button appears (future feature, currently shows "Coming soon" tooltip)

- **Amount too low (< $1):**
  - User enters $0.50
  - Error: "Minimum position: $1"
  - Button disabled

- **Amount too high (> $1000):**
  - User enters $1500
  - Error: "Maximum position: $1,000 per trade"
  - Button disabled

- **Network error during submission:**
  - Loading state → Error screen
  - "Couldn't process position. Please try again."
  - "Try Again" button → Returns to entry screen (data preserved)

- **Market closed:**
  - User clicks "Place Answer" on closed market
  - Modal shows: "This market is closed for new positions."
  - Only shows "View Results" button

### Empty State
- N/A (always shows form)

### Edge Cases
- **User closes modal mid-flow:**
  - No position created
  - No funds deducted
  - State resets

- **Balance changes during flow (parallel transaction):**
  - Re-validate balance on "Confirm" click
  - Show updated error if now insufficient

- **Slow network (>5s processing):**
  - Show progress: "Still processing... This is taking longer than usual."
  - Don't timeout before 30s

- **Position would move market significantly:**
  - Preview shows: "Your position will move the market from 40% to 55%" (highlight large impact)

### Exit Points
- Cancel/close → Return to market page (no position created)
- After success → Market page (position active)
- "View Position" → Navigate to positions page (future screen)
- "Place Another" → Reset modal, allow new position

---

## User Flow 2: Buy NO Position

**Entry Point:** Market page → "Place Answer"

### Happy Path
1. Same as YES flow, but:
2. User toggles to "NO" (red highlighted)
3. Preview updates with NO calculations:
   - "You'll receive: X shares @ $Y/share"
   - Probability shown as NO% chance
   - ROI calculated for NO outcome
4. Confirmation screen shows "**BUY NO**" (red)
5. Rest identical to YES flow

### Error Paths
- Same as YES flow

### Edge Cases
- **Switching from YES to NO mid-flow:**
  - Amount persists
  - Preview recalculates instantly
  - No data loss

---

## User Flow 3: Adjust Position Size via Slider

**Entry Point:** Within position modal

### Interaction Behavior
1. User drags slider left/right
2. **Input updates in real-time** (no lag)
3. **Preview recalculates** (debounced 150ms)
4. **Preset stops:**
   - Slider snaps to $10, $25, $50, $100 (haptic feedback on mobile)
   - Shows subtle tick marks at stops
5. **Custom amounts:**
   - User can drag to any value $1-$1000
   - Input shows exact value (e.g., $73)

### Error Paths
- User drags beyond balance → Slider stops at max valid amount, shows error

---

## User Flow 4: Adjust Position Size via Input

**Entry Point:** Within position modal

### Interaction Behavior
1. User clicks in amount input
2. Keyboard appears (mobile: numeric keyboard)
3. User types "45"
4. **Slider updates** to match input
5. **Preview recalculates** (debounced 300ms after last keystroke)
6. User presses Enter or clicks "Review Position"

### Error Paths
- **Non-numeric input:**
  - Filter on keystroke (only allow 0-9, one decimal point)
  - Paste filtered (strip non-numeric)

- **Invalid amount:**
  - Show error below input
  - Button disabled

---

## Wireframe Annotations

### Modal Layout (Entry Screen)
```
┌─────────────────────────────────────┐
│  Take a Position              [×]   │  ← Header + close
├─────────────────────────────────────┤
│  Market: Will Bitcoin hit $150k?   │  ← Context (market question)
│  by end of Q1 2026?                 │
├─────────────────────────────────────┤
│  Balance: $100 USDC          [Help] │  ← Balance (always visible)
│                                     │
│  ┌─────────┬─────────┐            │
│  │   YES   │   NO    │             │  ← Toggle selector (large tap targets)
│  └─────────┴─────────┘            │
│                                     │
│  Amount                             │
│  ┌─────────────────────────────┐   │
│  │  $      25                  │   │  ← Amount input (large, clear)
│  └─────────────────────────────┘   │
│                                     │
│  ▏─────●─────────────────────────  │  ← Slider (marks at 10, 25, 50, 100)
│  $10        $50          $100       │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 📊 Position Preview          │  │  ← Preview (updates live)
│  │                              │  │
│  │ You'll receive:              │  │
│  │ 62.5 shares @ $0.40/share    │  │  ← Large, bold numbers
│  │                              │  │
│  │ Potential win: $37.50        │  │  ← Green text
│  │ Return: 150%                 │  │
│  │                              │  │
│  │ Current: 40% → After: 42%    │  │  ← Impact indicator
│  └──────────────────────────────┘  │
│                                     │
│  [ Review Position ]                │  ← Primary button (full width)
└─────────────────────────────────────┘
```

### Modal Layout (Confirmation Screen)
```
┌─────────────────────────────────────┐
│  [←]  Confirm Position        [×]   │  ← Back button + close
├─────────────────────────────────────┤
│                                     │
│       ▼ BUY YES ▼                  │  ← Large, green, prominent
│                                     │
│  Will Bitcoin hit $150k by          │  ← Market question
│  end of Q1 2026?                    │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Position Details             │  │
│  │                              │  │
│  │ Amount:         $50.00       │  │  ← Summary
│  │ Shares:         125          │  │
│  │ Price/share:    $0.40        │  │
│  │                              │  │
│  │ If YES wins:    +$75 (150%)  │  │  ← Green
│  │ If NO wins:     -$50 (0%)    │  │  ← Red/gray
│  └──────────────────────────────┘  │
│                                     │
│  New balance: $50 USDC              │  ← Shows post-position balance
│                                     │
│  [ Confirm ]                        │  ← Green, bold
│  [ Cancel ]                         │  ← Subtle, gray
└─────────────────────────────────────┘
```

### Modal Layout (Success Screen)
```
┌─────────────────────────────────────┐
│                               [×]   │
│                                     │
│         ✓ 🎉                       │  ← Large success icon + confetti
│                                     │
│    Position Placed!                 │  ← Large heading
│                                     │
│  You bought 125 YES shares          │  ← Confirmation message
│  for $50                            │
│                                     │
│  New balance: $50 USDC              │  ← Updated balance
│                                     │
│  [ View Position ]                  │  ← Primary action
│  [ Place Another ]                  │  ← Secondary action
│                                     │
│  (Auto-closes in 2s...)             │  ← Countdown
└─────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (≥768px)
- Modal: 540px width, centered
- Slider: Full width with hover states
- Buttons: Standard size

### Mobile (<768px)
- Modal: Full-screen
- Header: Sticky with back button
- Input: Large (min 44px height)
- Numeric keyboard for amount input
- Slider: Haptic feedback on stops

---

## Accessibility Requirements

### Keyboard Navigation
- **Tab order:** Close → YES/NO → Amount input → Slider → Review button
- **Arrow keys on slider:** Left/right adjust by $1
- **Shift+Arrow:** Adjust by $10
- **Enter on input:** Proceed to review

### Screen Reader
- Modal announces: "Take a position on: [market question]"
- Balance announced on focus: "Your balance: $100 USDC"
- Preview updates announced: "You'll receive 62.5 shares"
- Error announcements via aria-live="assertive"

### Visual
- **Color contrast:** All text meets WCAG AA (4.5:1)
- **Focus indicators:** Clear 2px blue outline
- **Error states:** Not color-only (icon + text)

---

## Usability Testing Plan

### Task 1: Place YES position
- **Goal:** Buy $25 of YES shares
- **Success:** Position confirmed, modal closes
- **Time target:** <45 seconds
- **Test:** Is flow intuitive? Do users understand preview?

### Task 2: Adjust amount with slider
- **Goal:** Change position from $25 to $75
- **Success:** Slider moved, preview updates
- **Time target:** <10 seconds
- **Test:** Is slider responsive? Do preset stops help?

### Task 3: Error recovery (insufficient balance)
- **Scenario:** Try to place $200 position (balance $100)
- **Success:** User sees error, understands problem
- **Test:** Is error message clear? Is recovery path obvious?

### Metrics
- **Task success rate:** 95%+
- **Errors:** <5% (unintended actions)
- **Satisfaction:** 4.5/5+
- **Quote capture:** "What did you like/dislike about placing a position?"

---

**Status:** Ready for Designer
**Handoff:** Wireframes above, interaction specs defined
**Dependencies:** Auth (Screen 3) must be complete
**Last Updated:** 2026-02-12
