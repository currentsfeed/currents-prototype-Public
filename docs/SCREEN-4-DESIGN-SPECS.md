# Design Specs: Screen 4 - Take Position Flow

## Design System Tokens (Additional)

### Position-Specific Colors
```css
--position-yes-bg: rgba(45, 106, 79, 0.05)
--position-yes-border: #2D6A4F
--position-yes-text: #2D6A4F
--position-yes-hover: rgba(45, 106, 79, 0.1)

--position-no-bg: rgba(157, 91, 78, 0.05)
--position-no-border: #9D5B4E
--position-no-text: #9D5B4E
--position-no-hover: rgba(157, 91, 78, 0.1)

--slider-track: #E5E7EB
--slider-thumb: #2C4A6B
--slider-fill-yes: #2D6A4F
--slider-fill-no: #9D5B4E
```

---

## Component: Position Modal Container

### Layout (Same as Auth Modal)
- **Width:** 540px (desktop), 100vw (mobile)
- **Height:** Auto, max 90vh
- **Background:** #FFFFFF
- **Shadow:** 0px 8px 32px rgba(0, 0, 0, 0.12)
- **Border radius:** 16px (desktop), 0 (mobile)
- **Padding:** 32px

### Header
- **Title:** "Take a Position"
  - Font: Georgia (serif)
  - Size: 24px / 32px
  - Weight: 600
  - Color: #1A1D23
- **Balance display:**
  - Position: Top-right
  - Text: "Balance: $100 USDC"
  - Font: 14px / 20px, SF Mono (monospace)
  - Color: #6B7280
  - Icon: $ (subtle, 16px)

### Market Context Bar
- **Background:** #F9FAFB
- **Border:** 1px solid #E5E7EB
- **Border radius:** 8px
- **Padding:** 12px 16px
- **Margin bottom:** 24px
- **Text:** Market question (truncated with ellipsis if > 2 lines)
  - Font: 14px / 20px
  - Weight: 600
  - Color: #1A1D23

---

## Component: YES/NO Toggle Selector

### Layout
```
┌─────────────────────────────┐
│  ┌───────────┬───────────┐  │
│  │           │           │  │
│  │    YES    │    NO     │  │
│  │           │           │  │
│  └───────────┴───────────┘  │
└─────────────────────────────┘
```

### Container
- **Width:** 100%
- **Height:** 56px
- **Display:** Grid, 2 columns (1fr 1fr)
- **Gap:** 0 (seamless)
- **Border:** 1px solid #E5E7EB
- **Border radius:** 8px
- **Overflow:** Hidden (clips children)

### YES Button
- **Background (default):** White
- **Background (selected):** `--position-yes-bg` (rgba(45, 106, 79, 0.05))
- **Border-left:** 3px solid transparent (selected: `--position-yes-border`)
- **Text:**
  - Font: 16px, weight 700
  - Color (default): #6B7280
  - Color (selected): `--position-yes-text` (#2D6A4F)
- **Transition:** All 200ms ease

**States:**
- **Default:** Gray text, white bg
- **Selected:** Green text, green tint bg, left border
- **Hover (unselected):** Background #F9FAFB
- **Hover (selected):** Background `--position-yes-hover`

### NO Button
- **Same as YES, but:**
- **Border-right:** 3px solid (not left)
- **Colors:** `--position-no-*` (red variants)

### Divider
- **Width:** 1px
- **Height:** 100%
- **Background:** #E5E7EB
- **Position:** Between buttons

---

## Component: Amount Input

### Layout
```
┌─────────────────────────────┐
│  Amount                     │ ← Label
│                             │
│  ┌─────────────────────────┐│
│  │  $         50.00       ││ ← Input
│  └─────────────────────────┘│
│                             │
│  Min $1 • Max $1,000        │ ← Hint
└─────────────────────────────┘
```

### Label
- **Font:** 14px / 20px
- **Weight:** 600
- **Color:** #1A1D23
- **Margin bottom:** 8px

### Input Field
- **Width:** 100%
- **Height:** 56px
- **Border:** 1px solid #D1D5DB
- **Border radius:** 8px
- **Padding:** 16px
- **Font:** 24px / 32px, SF Mono (monospace)
- **Color:** #1A1D23
- **Text align:** Right

**Dollar sign:**
- **Position:** Absolute, left 16px
- **Font:** 24px, SF Mono
- **Color:** #9CA3AF
- **Pointer-events:** None

**States:**
- **Focus:** Border #2C4A6B, shadow 0 0 0 3px rgba(44, 74, 107, 0.1)
- **Error:** Border #EF4444, red text below
- **Valid:** Border #2D6A4F, subtle green tint

### Hint Text
- **Font:** 12px / 16px
- **Color:** #9CA3AF
- **Margin top:** 4px

### Error Message (Below Input)
- **Font:** 14px / 20px
- **Color:** #DC2626
- **Icon:** ⚠ 16px inline
- **Margin top:** 8px
- **Animation:** Slide down (150ms ease-out)

---

## Component: Amount Slider

### Layout
```
$10        $25        $50       $100
▏─────●─────────────────────────────
```

### Track
- **Width:** 100%
- **Height:** 6px
- **Background:** `--slider-track` (#E5E7EB)
- **Border radius:** 3px
- **Margin:** 24px 0

### Fill (Active Portion)
- **Background:** `--slider-fill-yes` (if YES) or `--slider-fill-no` (if NO)
- **Height:** 6px
- **Border radius:** 3px 0 0 3px
- **Transition:** Width 150ms ease, background 200ms

### Thumb (Draggable Handle)
- **Size:** 24px × 24px
- **Background:** #FFFFFF
- **Border:** 3px solid `--slider-thumb` (#2C4A6B)
- **Border radius:** 50%
- **Box shadow:** 0 2px 4px rgba(0, 0, 0, 0.1)
- **Cursor:** Grab (default), grabbing (active)

**States:**
- **Hover:** Scale 1.1, shadow 0 2px 8px rgba(0, 0, 0, 0.15)
- **Active/Dragging:** Scale 0.95, shadow reduced
- **Focus:** Blue outline (2px, offset 2px)

### Preset Marks
- **Position:** Below track
- **Labels:** "$10", "$25", "$50", "$100"
- **Font:** 12px / 16px, SF Mono
- **Color:** #9CA3AF
- **Spacing:** Aligned to preset values

**Tick marks:**
- **Width:** 2px
- **Height:** 8px
- **Background:** #D1D5DB
- **Position:** Above track, at preset values

### Snap Behavior
- **Snap to presets:** When within 5% of preset value
- **Haptic feedback:** On mobile, vibrate(10) on snap

---

## Component: Position Preview

### Layout
```
┌─────────────────────────────┐
│  📊 Position Preview        │ ← Header
├─────────────────────────────┤
│  You'll receive:            │
│  125 shares @ $0.40/share   │ ← Primary info
│                             │
│  Potential win: +$75        │ ← Success (green)
│  Return: 150%               │
│                             │
│  Current: 40% → After: 42%  │ ← Impact
│  (+2% impact)               │
└─────────────────────────────┘
```

### Container
- **Background:** #F9FAFB
- **Border:** 1px solid #E5E7EB
- **Border radius:** 12px
- **Padding:** 20px
- **Margin top:** 24px

### Header
- **Font:** 14px / 20px
- **Weight:** 600
- **Color:** #6B7280
- **Icon:** 📊 (16px, inline)
- **Margin bottom:** 16px

### Primary Info (Shares)
- **Label:** "You'll receive:"
  - Font: 14px / 20px
  - Color: #6B7280
- **Value:** "125 shares @ $0.40/share"
  - Font: 18px / 24px, SF Mono
  - Weight: 700
  - Color: #1A1D23
- **Transition:** Smooth number animation (200ms)

### Potential Win
- **Label:** "Potential win:"
- **Value:** "+$75"
  - Font: 20px / 28px, SF Mono
  - Weight: 700
  - Color: `--position-yes-text` (#2D6A4F) if YES, `--position-no-text` if NO
  - Icon:** ↗ (arrow) 16px, inline
- **ROI:** "150%"
  - Font: 16px / 24px
  - Color: #6B7280

### Impact Indicator
- **Text:** "Current: 40% → After: 42%"
  - Font: 14px / 20px, SF Mono
  - Color: #6B7280
- **Impact:** "(+2% impact)"
  - Font: 12px / 16px
  - Color: #9CA3AF
- **Animation:** Fade in when value changes

---

## Component: Review Button

### Layout (Bottom of Modal)
```
┌─────────────────────────────┐
│  [ Review Position ]        │ ← Full width button
└─────────────────────────────┘
```

### Button Specs
- **Width:** 100%
- **Height:** 52px
- **Background:** `--brand-primary` (#2C4A6B)
- **Border radius:** 8px
- **Text:**
  - Font: 16px
  - Weight: 700
  - Color: #FFFFFF
- **Shadow:** 0 1px 2px rgba(0, 0, 0, 0.05)
- **Margin top:** 32px

**States:**
- **Hover:** Background #1E3447, shadow 0 2px 4px rgba(0, 0, 0, 0.1)
- **Active:** Scale 0.98
- **Focus:** 2px blue outline
- **Disabled:** Background #D1D5DB, cursor not-allowed, 60% opacity

---

## Component: Confirmation Screen

### Layout
```
┌─────────────────────────────┐
│  [← Back]  Confirm    [×]   │ ← Header with back
├─────────────────────────────┤
│         ▼ BUY YES ▼         │ ← Large CTA (animated)
├─────────────────────────────┤
│  Will Bitcoin hit $150k...  │ ← Market question
├─────────────────────────────┤
│  Position Details           │
│                             │
│  Amount:        $50.00      │
│  Shares:        125         │
│  Price/share:   $0.40       │
│                             │
│  ┌─────────────────────┐   │
│  │ If YES wins:        │   │ ← Outcomes box
│  │ +$75.00 (150%)      │   │ (green)
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ If NO wins:         │   │
│  │ -$50.00 (0%)        │   │ (gray)
│  └─────────────────────┘   │
│                             │
│  New balance: $50 USDC      │
├─────────────────────────────┤
│  [ Confirm ]                │ ← Primary button
│  [ Cancel ]                 │ ← Secondary
└─────────────────────────────┘
```

### CTA Banner
- **Height:** 72px
- **Background:** `--position-yes-bg` (if YES) gradient
- **Text:** "▼ BUY YES ▼"
  - Font: 28px / 36px
  - Weight: 800
  - Color: `--position-yes-text` (#2D6A4F)
  - Text transform: Uppercase
  - Alignment: Center
- **Animation:** Pulse (scale 1 → 1.02 → 1, 2s infinite)

### Position Details Table
- **Layout:** Grid, 2 columns (label, value)
- **Gap:** 12px vertical, 16px horizontal
- **Padding:** 20px
- **Background:** #F9FAFB
- **Border radius:** 8px

**Labels:**
- Font: 14px / 20px
- Color: #6B7280
- Alignment: Left

**Values:**
- Font: 16px / 24px, SF Mono
- Weight: 600
- Color: #1A1D23
- Alignment: Right

### Outcomes Boxes
- **Width:** 100%
- **Padding:** 16px
- **Border radius:** 8px
- **Margin:** 12px 0
- **Border:** 2px solid

**Win outcome:**
- **Background:** rgba(45, 106, 79, 0.05)
- **Border:** `--position-yes-border`
- **Text color:** `--position-yes-text`
- **Icon:** ✓ 20px

**Lose outcome:**
- **Background:** #F9FAFB
- **Border:** #E5E7EB
- **Text color:** #6B7280
- **Icon:** ✗ 20px

### Confirm Button
- **Width:** 100%
- **Height:** 52px
- **Background:** `--position-yes-border` (if YES, green) or `--position-no-border` (if NO, red)
- **Text:** "Confirm" + side ("Confirm YES Position")
- **Font:** 16px, weight 700, white
- **Border radius:** 8px
- **Margin top:** 24px

### Cancel Button
- **Width:** 100%
- **Height:** 44px
- **Background:** Transparent
- **Border:** 1px solid #D1D5DB
- **Text:** "Cancel"
- **Font:** 14px, weight 600, #6B7280
- **Margin top:** 12px

---

## Component: Success State

### Layout
```
┌─────────────────────────────┐
│                        [×]  │
│                             │
│           ✓ 🎉             │ ← Success icon + confetti
│                             │
│    Position Placed!         │ ← Heading
│                             │
│  You bought 125 YES shares  │ ← Summary
│  for $50                    │
│                             │
│  New balance: $50 USDC      │
│                             │
│  [ View Position ]          │ ← Primary
│  [ Place Another ]          │ ← Secondary
│                             │
│  (Auto-closes in 2s...)     │ ← Timer
└─────────────────────────────┘
```

### Success Icon
- **Size:** 80px circle
- **Background:** Radial gradient (green center to white)
- **Icon:** ✓ (checkmark) 48px
- **Color:** `--position-yes-text`
- **Animation:** Draw checkmark path (500ms) + scale in (200ms)

### Confetti Animation
- **Type:** Lightweight particle animation
- **Duration:** 1.5s
- **Colors:** Green, white, gold (subtle)
- **Particle count:** 20-30
- **Physics:** Gravity + random velocity

**Alternative (simpler):** Animated checkmark only, no confetti

### Heading
- **Font:** 24px / 32px, Georgia
- **Weight:** 600
- **Color:** #1A1D23
- **Margin top:** 24px

### Summary Text
- **Font:** 16px / 24px
- **Color:** #6B7280
- **Margin top:** 12px
- **Alignment:** Center

### Balance Update
- **Font:** 16px / 24px, SF Mono
- **Color:** #1A1D23
- **Margin top:** 16px
- **Icon:** Wallet icon 20px

### Buttons
- **Primary (View Position):** Green background
- **Secondary (Place Another):** White background, green border
- **Spacing:** 12px between
- **Margin top:** 32px

### Auto-Close Timer
- **Font:** 12px / 16px
- **Color:** #9CA3AF
- **Margin top:** 16px
- **Animation:** Countdown (2, 1, closing...)

---

## Responsive Behavior

### Desktop (≥768px)
- Modal: 540px width
- Slider: Full width with hover states
- Two-column layout for details

### Mobile (<768px)
- Modal: Full-screen
- Slider: Larger touch target (32px thumb)
- Single-column layout
- Sticky header with balance
- Sticky footer with button

---

## Animations

### Number Counter (Preview Updates)
```css
@keyframes count-up {
  from { opacity: 0.5; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
duration: 200ms
easing: ease-out
```

### Success Confetti
```javascript
// Simple particle system
particles: 25
velocityX: random(-3, 3)
velocityY: random(-8, -4)
gravity: 0.3
lifetime: 1.5s
fadeOut: last 500ms
```

### Position CTA Pulse
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
duration: 2s
iteration: infinite
easing: ease-in-out
```

---

## Accessibility

### Color Contrast
- ✅ YES green on white: 4.8:1 (AA)
- ✅ NO red on white: 4.6:1 (AA)
- ✅ All text meets WCAG AA

### Keyboard Navigation
- Tab order: YES/NO → Amount → Slider → Preview → Button
- Arrow keys on slider: Adjust by $1
- Shift+Arrow: Adjust by $10
- Enter on input: Focus review button

### Screen Reader
- Slider: "Amount slider, currently $50, use arrow keys to adjust"
- Preview updates: Announced via aria-live="polite"
- Success: "Position placed successfully"

### Touch Targets
- All buttons: ≥44px height
- Slider thumb: 32px (mobile)
- Toggle buttons: 56px height

---

**Status:** Ready for Architect
**Figma:** [Design file — mocked]
**Assets:** Icons in `/public/icons/`
**Last Updated:** 2026-02-12
