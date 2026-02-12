# Screen 8: Category Page — PRD

## Problem Statement
Users want to explore markets within specific topics (Politics, Crypto, Technology, etc.) but currently have no way to filter or browse by category.

## Success Metrics
- Primary: 40% of homepage visitors navigate to a category page
- Secondary: Avg 3+ markets viewed per category visit
- Guardrail: Page load time < 1.5s

## User Stories
- As a user interested in politics, I want to see all politics markets in one place
- As a crypto trader, I want to filter crypto markets by status (open/resolved)
- As a browser, I want to sort markets by popularity or belief %

## Acceptance Criteria
- Category page shows: category name, description, market count
- Markets displayed in grid (responsive)
- Filter by status: All | Open | Resolved
- Sort by: Popular | Recent | Belief %
- Empty state if no markets in category
- Mobile responsive

## Out of Scope
- Advanced filters (date range, participants count)
- Category subscriptions/notifications
- Sub-categories

## Technical Notes
- Route: `/categories/[slug]`
- API: `/api/categories/[slug]` (GET)
- Categories: politics, crypto, technology, economics, sports, science
