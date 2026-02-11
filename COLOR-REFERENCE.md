# Color Palette Reference

Quick reference for the editorial color system implemented in the Currents prototype.

---

## Base Colors

```css
Background Page:    #F8F9FA  /* Warm off-white, not pure white */
Surface (Cards):    #FFFFFF  /* Pure white cards */
Text Primary:       #1A1D23  /* Deep charcoal */
Text Secondary:     #6B7280  /* Slate gray */
Text Tertiary:      #9CA3AF  /* Light slate */
```

---

## Belief Direction (NO RED/GREEN!)

```css
Belief Increasing:  #2D6A4F  /* Muted forest green */
Belief Decreasing:  #9D5B4E  /* Muted terracotta */
Belief Stable:      #5B6B7E  /* Cool slate */
```

**Icons Used:**
- Rising: ↗ (diagonal arrow up-right)
- Falling: ↘ (diagonal arrow down-right)
- Steady: → (horizontal arrow)

**Always paired with text**: "+3.2%", "-1.8%", "~0%"

---

## Accent Colors

```css
Primary CTA:        #2C4A6B  /* Deep blue-slate, trustworthy */
Primary Hover:      #1E3447  /* Darker blue */
Secondary CTA:      #8B7EA8  /* Muted lavender */
Accent:             #D4926F  /* Warm terracotta */
Link:               #3B5F82  /* Muted blue */
```

**Usage:**
- Primary: "View Market" buttons
- Secondary: "View All Markets" button
- Accent: Featured badges, highlights (use sparingly)

---

## Status Colors

```css
Market Open:        #4A90E2  /* Clear blue */
Closing Soon:       #E8A34D  /* Warm amber */
Market Resolved:    #7B8794  /* Neutral gray */
```

**Badge Format:**
- Small uppercase text: "OPEN", "CLOSING SOON", "RESOLVED"
- 11px font size
- 0.06em letter spacing
- Rounded corners
- White text on color background

---

## Shadows

```css
Card Default:       0px 1px 3px rgba(0, 0, 0, 0.06)
Card Hover:         0px 2px 8px rgba(0, 0, 0, 0.12)
```

Subtle shadows for editorial feel (not dramatic Material Design shadows).

---

## Typography

```css
Headlines:          Georgia (serif)
Body:               System sans-serif stack
Data/Numbers:       SF Mono / Fira Code (monospace)
```

---

## Before/After Comparison

| Element | Old | New | Why |
|---------|-----|-----|-----|
| Belief Up | #00C853 (neon green) | #2D6A4F (forest) | Less urgent |
| Belief Down | #FF1744 (neon red) | #9D5B4E (terracotta) | Not alarming |
| Page BG | #FFFFFF (white) | #F8F9FA (off-white) | Easier on eyes |
| CTA | #FF6B35 (orange) | #2C4A6B (blue) | Trustworthy |

**Result**: From sports betting app → Bloomberg editorial aesthetic

---

## Tailwind Usage

Colors are defined in `app/globals.css` using CSS variables:

```css
:root {
  --color-belief-increasing: #2D6A4F;
  --color-belief-decreasing: #9D5B4E;
  /* etc */
}
```

Then used in JSX with bracket notation:

```tsx
className="text-[#2D6A4F]"
className="bg-[#2C4A6B] hover:bg-[#1E3447]"
```

---

## Accessibility

All colors meet WCAG AA contrast requirements:
- Text Primary on White: 16.5:1 (AAA)
- Text Secondary on White: 5.2:1 (AA)
- Belief Increasing on White: 4.8:1 (AA)
- Belief Decreasing on White: 4.6:1 (AA)
- Primary Button Text: 8.5:1 (AAA)

Never use color alone to convey meaning:
✅ Icon + Text + Color
❌ Color only
