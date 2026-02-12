# UX Architect: User Flows - Screens 5-6

## SCREEN 5: MY POSITIONS — USER FLOWS

### Primary Flow: View Active Positions

```
Entry Point: Header nav "My Positions" or direct URL
↓
[/my-positions loads]
↓
Check: User has positions?
├─ YES → Display Position Dashboard
│   ├─ Summary Card (Total P&L, Active/Resolved counts)
│   ├─ Filter Tabs (All | Active | Resolved)
│   └─ Position Cards (grid on desktop, stack on mobile)
│       ├─ Market thumbnail
│       ├─ Question text
│       ├─ Position details (YES/NO, shares, entry)
│       ├─ Current market probability
│       ├─ P&L badge (colored by gain/loss)
│       └─ Action: "View Market" link
│
└─ NO → Empty State
    ├─ Illustration
    ├─ "No positions yet"
    ├─ Encouraging subtext
    └─ CTA: "Browse Markets" → /

User Actions:
- Click filter → List updates instantly
- Click position card → Navigate to market detail page
- Scroll → Lazy load if >20 positions (future)
```

### Secondary Flow: Filter Positions

```
User on: /my-positions (with multiple positions)
↓
User clicks: "Resolved" filter
↓
System:
- Updates URL param (?status=resolved)
- Filters list to show only resolved positions
- Maintains scroll position
- Persists filter in session
↓
User returns later → Filter state restored
```

### Edge Cases

**Case 1: Single Position**
- Display same layout (no special single-item view)
- Summary card still shows (sets expectations for future)

**Case 2: All Positions Resolved**
- "Active" filter shows empty state: "No active positions. Browse new markets?"
- "All" and "Resolved" filters show positions normally

**Case 3: Slow Load**
- Show skeleton loaders for cards (3-5 placeholders)
- Summary card loads first (lightest query)
- Timeout after 10s → Show error state with retry

**Case 4: Very Long Market Questions**
- Truncate at 2 lines with ellipsis
- Full text available on hover (desktop) or by clicking through to market

---

## SCREEN 6: MARKET CREATION — USER FLOWS

### Primary Flow: Create Market (Happy Path)

```
Entry Point: Header CTA "Create Market" or homepage button
↓
[/markets/create loads]
↓
STEP 1: Market Details
├─ Question input (autofocus, character counter)
├─ Description textarea (optional, character counter)
└─ Category dropdown
↓
User fills fields
↓
Validation on blur:
- Question: 10-200 chars, ends with "?"
- Description: 0-500 chars
- Category: required
↓
User clicks "Next"
↓
Check: All required fields valid?
├─ NO → Highlight errors, focus first invalid field
└─ YES → Proceed to Step 2
↓
STEP 2: Configuration
├─ Closing Date picker (calendar UI)
└─ Resolution Criteria textarea
↓
User fills fields
↓
Validation:
- Date: min 24h future, max 365 days
- Criteria: 10-300 chars
↓
User clicks "Preview"
↓
STEP 3: Preview
├─ Market Card preview (matches homepage style)
├─ "Edit" button (returns to Step 1)
└─ "Create Market" button (primary CTA)
↓
User clicks "Create Market"
↓
Loading state (button shows spinner)
↓
API call: POST /api/markets/create
↓
Success:
├─ Confetti animation
├─ "Market Created!" headline
├─ "Your market is now live" subtext
├─ Link to market: "/markets/[slug]"
└─ CTAs: "View Market" | "Create Another"
```

### Secondary Flow: Edit During Preview

```
User on: Step 3 (Preview)
↓
User clicks: "Edit"
↓
System:
- Returns to Step 1
- Pre-fills all form data
- Shows validation state (all valid)
↓
User makes changes
↓
User clicks "Next" → Returns to Step 3 with updates
```

### Error Flow: Submission Fails

```
User clicks: "Create Market" on Step 3
↓
API call fails (network error, server error, validation error)
↓
System:
- Dismisses loading state
- Shows error toast: "Failed to create market. Please try again."
- Keeps user on Step 3 (data preserved)
- Offers "Retry" button
↓
User clicks "Retry" → Repeats submission
```

### Edge Cases

**Case 1: Abandoned Form (Mid-Creation)**
- No auto-save in V1
- Browser back button → Show confirm dialog: "Discard market draft?"
- If user returns later → Form is empty (no persistence)

**Case 2: Duplicate Question**
- Backend detects similar question already exists
- Returns error: "A similar market already exists. [View Market]"
- User can modify question or cancel

**Case 3: Invalid Characters**
- Client-side sanitization strips HTML/script tags
- Backend double-checks (security layer)
- User sees cleaned version in preview

**Case 4: Mobile Keyboard Overlap**
- Form scrolls to keep focused field visible
- Next/Done keyboard buttons advance through fields
- Sticky progress bar at top (always visible)

---

## NAVIGATION & INFORMATION ARCHITECTURE

### My Positions
- **Location:** `/my-positions`
- **Access:** Header nav (persistent), Profile dropdown
- **Auth:** Requires login (redirect to sign-in if unauthenticated)
- **Exit Points:** Click market → market detail, Browse Markets → homepage

### Market Creation
- **Location:** `/markets/create`
- **Access:** Header CTA "Create Market" (primary), Homepage CTAs
- **Auth:** Requires login (redirect + return URL)
- **Exit Points:** Success → view market or homepage, Cancel → confirmation modal → homepage

---

## WIREFRAME NOTES (For Designer)

### My Positions Layout
```
┌─────────────────────────────────────┐
│ Header (persistent nav)             │
├─────────────────────────────────────┤
│ Summary Card                         │
│ ┌───────────────────────────────┐   │
│ │ Total P&L: +$234.50 (+12.3%) │   │
│ │ Active: 5  |  Resolved: 12    │   │
│ └───────────────────────────────┘   │
│                                      │
│ [All] [Active] [Resolved]           │
│                                      │
│ ┌────────┐ ┌────────┐ ┌────────┐  │
│ │Position│ │Position│ │Position│  │
│ │  Card  │ │  Card  │ │  Card  │  │
│ └────────┘ └────────┘ └────────┘  │
│ ┌────────┐ ┌────────┐ ┌────────┐  │
│ │Position│ │Position│ │Position│  │
│ │  Card  │ │  Card  │ │  Card  │  │
│ └────────┘ └────────┘ └────────┘  │
└─────────────────────────────────────┘
```

### Market Creation Layout (Step 1)
```
┌─────────────────────────────────────┐
│ Header                               │
├─────────────────────────────────────┤
│ ◉──○──○  Create Market               │
│ Details  Config  Preview             │
│                                      │
│ Market Question *                    │
│ ┌───────────────────────────────┐   │
│ │ [text input]              120 │   │
│ └───────────────────────────────┘   │
│                                      │
│ Description (optional)               │
│ ┌───────────────────────────────┐   │
│ │ [textarea]                500 │   │
│ │                               │   │
│ └───────────────────────────────┘   │
│                                      │
│ Category *                           │
│ ┌───────────────────────────────┐   │
│ │ [ Select category ▼ ]         │   │
│ └───────────────────────────────┘   │
│                                      │
│            [Cancel]  [Next →]        │
└─────────────────────────────────────┘
```

---

**UX Architect Sign-off:** Flows validated, ready for Designer
**Date:** 2026-02-12 20:22 UTC
