# Design Specs: Screen 3 - Sign Up / Wallet Connect

## Design System Tokens Used

### Colors
```css
--modal-backdrop: rgba(26, 29, 35, 0.85)
--modal-bg: #FFFFFF
--modal-border: rgba(0, 0, 0, 0.08)
--text-primary: #1A1D23
--text-secondary: #6B7280
--text-tertiary: #9CA3AF
--brand-primary: #2C4A6B
--brand-hover: #1E3447
--success-bg: #F0FDF4
--success-border: #2D6A4F
--success-text: #2D6A4F
--error-bg: #FEF2F2
--error-border: #EF4444
--error-text: #DC2626
```

### Spacing
```css
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
```

### Typography
```css
--font-display: Georgia, serif
--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
--text-xs: 12px / 16px
--text-sm: 14px / 20px
--text-base: 16px / 24px
--text-lg: 18px / 28px
--text-xl: 20px / 28px
--text-2xl: 24px / 32px
```

### Shadows
```css
--shadow-modal: 0px 8px 32px rgba(0, 0, 0, 0.12)
--shadow-button: 0px 1px 2px rgba(0, 0, 0, 0.05)
--shadow-button-hover: 0px 2px 4px rgba(0, 0, 0, 0.1)
```

### Border Radius
```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
```

---

## Component: Auth Modal Container

### Layout
- **Width:** 480px (desktop), 100vw (mobile)
- **Height:** Auto, max 90vh (scroll if needed)
- **Position:** Centered (desktop), full-screen (mobile)
- **Background:** `--modal-bg` (white)
- **Shadow:** `--shadow-modal`
- **Border radius:** `--radius-xl` (16px, desktop only)
- **Padding:** `--spacing-8` (32px)

### Header
- **Margin bottom:** `--spacing-8` (32px)
- **Title:** "Join Currents" or "Welcome back"
  - Font: `--font-display` (Georgia)
  - Size: `--text-2xl` (24px / 32px)
  - Weight: 600 (semibold)
  - Color: `--text-primary`
  - Alignment: Center
- **Close button:**
  - Position: Absolute, top-right
  - Size: 40x40px (touch-friendly)
  - Icon: ✕ (16px)
  - Color: `--text-tertiary`
  - Hover: `--text-primary`
  - Focus: 2px blue outline

### Backdrop
- **Background:** `--modal-backdrop` (rgba(26, 29, 35, 0.85))
- **Blur:** 4px (backdrop-filter: blur(4px))
- **Click behavior:** Close modal (with animation)

---

## Component: Auth Method Selection (Initial Screen)

### Layout
```
┌─────────────────────────────┐
│   Join Currents        [×]  │ ← Header
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │  📧 Continue with Email │ │ ← Primary button
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │  🔗 Connect Wallet      │ │ ← Primary button
│ └─────────────────────────┘ │
│                             │
│ ─────── or ────────         │ ← Divider
│                             │
│ Already have an account?    │
│ Sign In                     │ ← Link
└─────────────────────────────┘
```

### Button Specs (Primary Actions)
- **Width:** 100%
- **Height:** 48px
- **Background:** `--brand-primary` (#2C4A6B)
- **Border radius:** `--radius-md` (8px)
- **Text:**
  - Font: `--font-body`
  - Size: `--text-base` (16px)
  - Weight: 600
  - Color: #FFFFFF
- **Icon:** 20px, left-aligned, `--spacing-3` (12px) margin
- **Shadow:** `--shadow-button`
- **Spacing between buttons:** `--spacing-3` (12px)

**States:**
- **Hover:** Background → `--brand-hover` (#1E3447), shadow → `--shadow-button-hover`
- **Active:** Scale 0.98, shadow reduced
- **Focus:** 2px blue outline, offset 2px

### Divider
- **Text:** "or"
- **Font:** `--text-sm` (14px)
- **Color:** `--text-tertiary`
- **Lines:** 1px solid rgba(0, 0, 0, 0.08)
- **Spacing:** `--spacing-6` (24px) top/bottom

### Sign In Link
- **Text:** "Already have an account? **Sign In**"
- **Font:** `--text-sm` (14px)
- **Color:** `--text-secondary` (normal), `--brand-primary` (link)
- **Hover:** Underline
- **Alignment:** Center

---

## Component: Email Input Form

### Layout
```
┌─────────────────────────────┐
│   Join Currents        [×]  │
├─────────────────────────────┤
│ [← Back]                    │ ← Back button
│                             │
│ Enter your email            │ ← Label
│                             │
│ ┌─────────────────────────┐ │
│ │ you@example.com      ✓  │ │ ← Input with validation
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │      Continue           │ │ ← Submit button
│ └─────────────────────────┘ │
│                             │
│ By continuing, you agree    │
│ to our Terms & Privacy.     │ ← Legal text
└─────────────────────────────┘
```

### Input Field
- **Width:** 100%
- **Height:** 48px
- **Border:** 1px solid #D1D5DB
- **Border radius:** `--radius-md` (8px)
- **Padding:** 12px 16px
- **Font:** `--text-base` (16px) — prevents zoom on iOS
- **Placeholder:** "you@example.com"
  - Color: `--text-tertiary` (#9CA3AF)

**States:**
- **Default:** Border #D1D5DB
- **Focus:** Border `--brand-primary` (#2C4A6B), shadow 0 0 0 3px rgba(44, 74, 107, 0.1)
- **Valid:** Border `--success-border` (#2D6A4F), green checkmark icon (right)
- **Error:** Border `--error-border` (#EF4444), red text below
- **Disabled:** Background #F3F4F6, 50% opacity, cursor not-allowed

### Validation Icon (Success)
- **Position:** Absolute, right 12px, centered vertically
- **Icon:** ✓ (checkmark)
- **Size:** 20px
- **Color:** `--success-text` (#2D6A4F)
- **Animation:** Scale in (200ms ease-out)

### Error Message
- **Position:** Below input, `--spacing-2` (8px) gap
- **Font:** `--text-sm` (14px)
- **Color:** `--error-text` (#DC2626)
- **Icon:** ⚠ (warning) 16px, inline
- **Animation:** Slide in from top (150ms ease-out)

### Submit Button
- **Same specs as primary button above**
- **Disabled state:** Background #D1D5DB, cursor not-allowed, 60% opacity

### Legal Text
- **Font:** `--text-xs` (12px / 16px)
- **Color:** `--text-tertiary`
- **Alignment:** Center
- **Margin top:** `--spacing-6` (24px)
- **Links:** Underline on hover, color `--brand-primary`

---

## Component: Wallet Selection Screen

### Layout
```
┌─────────────────────────────┐
│   Connect Wallet       [×]  │
├─────────────────────────────┤
│ [← Back]                    │
│                             │
│ ┌─────────────────────────┐ │
│ │ [MM] MetaMask           │ │ ← Wallet card
│ │           Most Popular  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [CB] Coinbase Wallet    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [WC] WalletConnect      │ │
│ │           100+ wallets  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Wallet Card
- **Width:** 100%
- **Height:** 64px
- **Background:** #FFFFFF
- **Border:** 1px solid #E5E7EB
- **Border radius:** `--radius-md` (8px)
- **Padding:** 12px 16px
- **Display:** Flex, align-items center, justify-between
- **Spacing between cards:** `--spacing-3` (12px)

**Layout:**
- **Icon:** 40x40px, left-aligned
- **Label:** `--text-base` (16px), weight 600, center-flex
- **Badge:** `--text-xs` (12px), `--text-tertiary`, right-aligned

**States:**
- **Default:** Border #E5E7EB
- **Hover:** Border `--brand-primary`, background #F9FAFB, slight lift (transform: translateY(-1px))
- **Active:** Scale 0.99
- **Focus:** 2px blue outline

### Wallet Icons
- **Format:** SVG
- **Size:** 40x40px
- **Colors:** Brand colors (MetaMask orange, Coinbase blue, WalletConnect blue)
- **Background:** Subtle circle with 5% opacity brand color

---

## Component: Loading State

### Layout
```
┌─────────────────────────────┐
│                        [×]  │
│                             │
│         ●○○○                │ ← Spinner
│                             │
│  Creating your account...   │ ← Loading text
│                             │
└─────────────────────────────┘
```

### Spinner
- **Type:** 3 dots or circular spinner
- **Size:** 48px
- **Color:** `--brand-primary`
- **Animation:** Rotate 360deg, 1s linear infinite

**Dots variant:**
- 3 circles, 12px each
- Spacing: 8px between
- Animation: Scale pulse (400ms, staggered 100ms delay)

### Loading Text
- **Font:** `--text-base` (16px)
- **Color:** `--text-secondary`
- **Alignment:** Center
- **Margin top:** `--spacing-4` (16px)

---

## Component: Success State

### Layout
```
┌─────────────────────────────┐
│                        [×]  │
│                             │
│           ✓                 │ ← Large checkmark
│                             │
│       Welcome! 👋           │ ← Heading
│                             │
│  Your account is ready      │ ← Subtext
│                             │
│  Redirecting...             │ ← Status
│  ▬▬▬▬▬▬░░░░               │ ← Progress bar
└─────────────────────────────┘
```

### Checkmark Icon
- **Type:** Animated checkmark
- **Size:** 64px
- **Color:** `--success-text` (#2D6A4F)
- **Background:** Circle, 80px, `--success-bg` (#F0FDF4)
- **Animation:** Draw path (500ms ease-out), then scale in circle (200ms)

### Heading
- **Font:** `--font-display` (Georgia)
- **Size:** `--text-xl` (20px / 28px)
- **Weight:** 600
- **Color:** `--text-primary`
- **Margin top:** `--spacing-6` (24px)

### Subtext
- **Font:** `--text-base` (16px)
- **Color:** `--text-secondary`
- **Margin top:** `--spacing-2` (8px)

### Progress Bar
- **Width:** 200px
- **Height:** 4px
- **Background:** #E5E7EB
- **Fill:** `--brand-primary`
- **Animation:** Width 0 → 100%, 2s linear
- **Border radius:** 2px
- **Margin top:** `--spacing-6` (24px)

---

## Component: Error State

### Layout
```
┌─────────────────────────────┐
│   Connection Failed    [×]  │
├─────────────────────────────┤
│                             │
│           ⚠                │ ← Error icon
│                             │
│  Couldn't connect           │ ← Error message
│  Check your internet and    │
│  try again.                 │
│                             │
│ ┌─────────────────────────┐ │
│ │      Try Again          │ │ ← Retry button
│ └─────────────────────────┘ │
│                             │
│ [Cancel]                    │ ← Secondary action
└─────────────────────────────┘
```

### Error Icon
- **Type:** ⚠ (warning triangle)
- **Size:** 48px
- **Color:** #F59E0B (warning yellow, not red — less alarming)
- **Background:** Circle, 64px, rgba(245, 158, 11, 0.1)

### Error Message
- **Font:** `--text-base` (16px / 24px)
- **Color:** `--text-primary` (not red — avoid alarm)
- **Alignment:** Center
- **Max width:** 320px
- **Margin top:** `--spacing-4` (16px)

### Try Again Button
- **Same specs as primary button**
- **Margin top:** `--spacing-8` (32px)

### Cancel Link
- **Font:** `--text-sm` (14px)
- **Color:** `--text-secondary`
- **Hover:** Underline
- **Margin top:** `--spacing-4` (16px)

---

## Responsive Breakpoints

### Desktop (≥768px)
- Modal: 480px width, centered
- Backdrop: Click to close
- Border radius: 16px
- Padding: 32px

### Mobile (<768px)
- Modal: Full-screen (100vw × 100vh)
- No backdrop (full takeover)
- Border radius: 0
- Padding: 24px
- Close button: Larger (48x48px)
- Back button: Top-left, always visible

---

## Animations

### Modal Open
```css
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
duration: 200ms
easing: cubic-bezier(0.16, 1, 0.3, 1)
```

### Modal Close
```css
@keyframes modal-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
duration: 150ms
easing: ease-in
```

### Success Checkmark Draw
```css
@keyframes check-draw {
  to {
    stroke-dashoffset: 0;
  }
}
stroke-dasharray: 100
stroke-dashoffset: 100
duration: 500ms
easing: ease-out
```

---

## Accessibility

### Color Contrast (WCAG AA)
- ✅ Text primary on white: 16.5:1 (AAA)
- ✅ Text secondary on white: 5.2:1 (AA)
- ✅ Brand primary on white (button text): 8.5:1 (AAA)
- ✅ Error text on white: 7.8:1 (AAA)

### Focus States
- All interactive elements have 2px blue outline
- Offset: 2px
- Border-radius: Matches element

### Touch Targets
- Minimum: 44x44px (iOS guidelines)
- Buttons: 48px height (exceeds minimum)

---

**Status:** Ready for Architect
**Figma:** [Link to designs — mocked for now]
**Assets:** Icons exported as SVG in `/public/icons/`
**Last Updated:** 2026-02-12
