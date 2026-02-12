# Designer: Visual Specifications - Screens 5-6

## DESIGN SYSTEM REFERENCE

Using Currents existing design system:
- **Colors:** `--bg-primary`, `--bg-card`, `--accent-green`, `--accent-red`, `--accent-brand`
- **Typography:** Inter font, existing scale (text-hero, text-h2, text-h3, text-body, text-small)
- **Spacing:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- **Borders:** `border-radius: 16px` for cards, `24px` for hero elements

---

## SCREEN 5: MY POSITIONS — VISUAL DESIGN

### Summary Card
```
Background: var(--bg-card)
Border-radius: 16px
Padding: 24px
Margin-bottom: 32px

Layout (Desktop: Row, Mobile: Stack):
┌────────────────────────────────────────┐
│  💰 Total P&L                          │
│  $234.50  +12.3%                       │
│  [green if positive, red if negative]  │
│                                        │
│  ────                                  │
│                                        │
│  5 Active    12 Resolved               │
│  [text-secondary]                      │
└────────────────────────────────────────┘

Typography:
- "Total P&L": 12px, font-weight: 600, text-secondary
- "$234.50": 32px, font-weight: 700, accent-green/accent-red
- "+12.3%": 18px, font-weight: 600, accent-green/accent-red
- "5 Active": 14px, font-weight: 600, text-primary
```

### Filter Tabs
```
Container: flex, gap: 8px, margin-bottom: 24px

Tab (inactive):
- Background: transparent
- Color: text-secondary
- Padding: 8px 16px
- Border-radius: 8px
- Font: 14px, font-weight: 600
- Hover: background: rgba(255,255,255,0.05)

Tab (active):
- Background: rgba(255, 77, 42, 0.1)  [brand color at 10%]
- Color: accent-brand
- Border: 1px solid accent-brand
```

### Position Card
```
Background: var(--bg-card)
Border-radius: 16px
Padding: 16px
Transition: all 0.2s ease
Hover: background: var(--bg-card-hover), cursor: pointer

Layout:
┌──────────────────────────────────────┐
│ ┌────────┐  Will AI replace 50% of  │
│ │ Image  │  jobs by 2030?            │
│ │ 80x80  │                           │
│ │  64%   │  Technology                │
│ └────────┘  [category badge]         │
│                                      │
│ Your Position: YES                   │
│ 100 shares @ $0.64                   │
│                                      │
│ Current: 68%    Value: $68.00        │
│                                      │
│ ┌──────────────┐                    │
│ │  +$4.00  +6.3%  │                 │
│ │  [P&L badge]    │                 │
│ └──────────────┘                    │
└──────────────────────────────────────┘

Dimensions:
- Desktop: min-width: 360px, grid: repeat(auto-fit, minmax(360px, 1fr))
- Mobile: full width stack

Market Image:
- Size: 80x80px
- Border-radius: 12px
- Position: absolute, top-left
- Overlay gradient: linear-gradient(to top, rgba(0,0,0,0.4), transparent)
- Probability overlay: white text, 18px bold, bottom-center of image

Typography:
- Question: 16px, font-weight: 600, line-height: 1.3, text-primary
- Category: 10px, uppercase, font-weight: 700, text-tertiary
- Position details: 12px, text-secondary
- P&L: 18px, font-weight: 700, accent-green/accent-red

P&L Badge:
- Background: accent-green (positive) or accent-red (negative) at 0.1 opacity
- Border: 1px solid accent-green/accent-red
- Padding: 8px 12px
- Border-radius: 8px
- Display: inline-flex, gap: 8px
```

### Empty State
```
Container: centered, max-width: 400px, margin: 80px auto

┌────────────────────────────┐
│                            │
│      📊  [Icon/Emoji]      │
│                            │
│   No positions yet         │
│   [32px, font-weight: 700] │
│                            │
│   Explore markets and      │
│   place your first         │
│   prediction to get        │
│   started.                 │
│   [14px, text-secondary]   │
│                            │
│   [Browse Markets]         │
│   [btn-primary]            │
│                            │
└────────────────────────────┘

Icon: 64x64px, opacity: 0.6, margin-bottom: 24px
Button: accent-brand background, white text, 16px padding
```

### Responsive Breakpoints
- Desktop: ≥1024px → 3-column grid
- Tablet: 768-1023px → 2-column grid
- Mobile: <768px → single column stack

---

## SCREEN 6: MARKET CREATION — VISUAL DESIGN

### Progress Indicator
```
Position: sticky top, z-index: 10
Background: var(--bg-header)
Padding: 16px 24px
Border-bottom: 1px solid rgba(255,255,255,0.05)

Layout:
◉────────○────────○
Details  Config  Preview

Active step: accent-brand circle (filled)
Complete step: accent-green circle (checkmark)
Incomplete: text-tertiary circle (outline)

Line between steps:
- Complete: accent-green
- In progress: gradient (green → tertiary)
- Incomplete: text-tertiary

Typography: 12px, font-weight: 600
```

### Form Container
```
Max-width: 600px
Margin: 48px auto
Padding: 0 24px

Mobile: Margin: 24px auto, Padding: 0 16px
```

### Input Fields

**Text Input:**
```
Background: var(--bg-card)
Border: 1px solid rgba(255,255,255,0.1)
Border-radius: 12px
Padding: 12px 16px
Font: 16px, text-primary
Transition: border-color 0.2s

Focus:
- Border: 1px solid accent-brand
- Outline: 2px solid rgba(255, 77, 42, 0.2)

Error:
- Border: 1px solid accent-red
- Color: accent-red (for error message)

Character Counter:
- Position: bottom-right of input
- Font: 12px, text-tertiary
- Turns accent-red when exceeding limit
```

**Textarea:**
```
Same as text input, but:
- Min-height: 120px
- Resize: vertical
- Max-height: 300px
```

**Dropdown:**
```
Background: var(--bg-card)
Border: 1px solid rgba(255,255,255,0.1)
Border-radius: 12px
Padding: 12px 16px
Appearance: none (custom arrow)
Arrow: accent-brand, right: 16px

Options:
- Background: var(--bg-elevated)
- Hover: var(--bg-card-hover)
- Selected: accent-brand background (0.1 opacity)
```

**Date Picker:**
```
Use native <input type="date"> styled to match:
- Background: var(--bg-card)
- Border: 1px solid rgba(255,255,255,0.1)
- Border-radius: 12px
- Padding: 12px 16px
- Calendar icon: accent-brand
```

### Labels
```
Font: 14px, font-weight: 600, text-primary
Margin-bottom: 8px
Required indicator: accent-red "*"
```

### Error Messages
```
Font: 12px, font-weight: 500, accent-red
Margin-top: 4px
Icon: ⚠️ before text
```

### Buttons

**Primary (Next, Create):**
```
Background: accent-brand
Color: white
Padding: 12px 24px
Border-radius: 8px
Font: 16px, font-weight: 600
Hover: background: accent-brand-hover
Active: scale(0.98)
Loading: spinner animation, disabled state

Min-width: 120px
```

**Secondary (Cancel, Back):**
```
Background: transparent
Color: text-secondary
Border: 1px solid rgba(255,255,255,0.1)
Padding: 12px 24px
Border-radius: 8px
Hover: background: rgba(255,255,255,0.05)
```

### Preview Card
```
Exact replica of homepage MarketCard component
- Same dimensions, typography, interactions
- Shows live preview of user inputs
- Non-interactive (no hover states)

Container:
- Background: var(--bg-card)
- Border: 2px dashed rgba(255,255,255,0.2)
- Padding: 24px
- Border-radius: 16px
- Margin-bottom: 32px

Label above card:
"Preview" - 14px, font-weight: 600, text-secondary
```

### Success Screen
```
Container: centered, max-width: 500px, margin: 80px auto

┌────────────────────────────┐
│                            │
│      🎉  [Confetti]        │
│                            │
│   Market Created!          │
│   [48px, font-weight: 700] │
│                            │
│   Your market is now live  │
│   and ready for            │
│   predictions.             │
│   [16px, text-secondary]   │
│                            │
│   ┌──────────────────┐    │
│   │  Market Preview  │    │
│   │  [Small card]    │    │
│   └──────────────────┘    │
│                            │
│   [View Market]            │
│   [btn-primary]            │
│                            │
│   Create Another Market    │
│   [text link, accent-brand]│
│                            │
└────────────────────────────┘

Confetti Animation:
- CSS particles or SVG animation
- Duration: 2 seconds
- Colors: accent-brand, accent-green, accent-orange
- Falls from top, fades out
```

### Loading States

**Button Loading:**
```
Spinner: 16px, accent-brand border (3px)
Rotation: 0.8s linear infinite
Replaces button text
Button disabled during loading
```

**Skeleton Loaders (For positions list):**
```
Background: linear-gradient(90deg, 
  rgba(255,255,255,0.05) 0%,
  rgba(255,255,255,0.1) 50%,
  rgba(255,255,255,0.05) 100%
)
Animation: shimmer 1.5s infinite
Border-radius: matches content shape
```

---

## ACCESSIBILITY

### Color Contrast
- All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- P&L colors supplemented with +/- icons for color-blind users

### Focus States
- All interactive elements have visible focus ring
- Focus ring: 2px solid accent-brand, offset: 2px

### Keyboard Navigation
- Tab order: logical (top-to-bottom, left-to-right)
- Enter key submits forms
- Escape key closes modals/confirms cancel

### Screen Readers
- All images have alt text
- Form labels properly associated (htmlFor)
- Error messages announced via aria-live
- Loading states announced
- Success state announced

---

## MOTION & ANIMATION

### Transitions
- Default: `transition: all 0.2s ease`
- Hover: `transform: translateY(-2px)` + shadow
- Active: `transform: scale(0.98)`

### Page Transitions
- Fade in: opacity 0→1, 0.3s ease
- Slide in (modals): translateY(20px)→0, 0.3s ease

### Confetti
- Particle count: 50-100
- Duration: 2s
- Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

---

**Designer Sign-off:** Visual specs complete, ready for Architect + Engineers
**Date:** 2026-02-12 20:25 UTC
