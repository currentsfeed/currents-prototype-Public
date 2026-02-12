# Screen 7: User Profile — PRD

## Problem Statement
Users need to discover other participants, evaluate their track record, and explore their market activity. Currently there's no way to view another user's reputation, history, or expertise.

## Success Metrics
- Primary: Profile page load time < 1s
- Secondary: 30% of profile viewers navigate to a market from the profile
- Guardrail: Zero privacy violations (no unauthorized data exposed)

## User Stories
- As a trader, I want to view another user's profile so that I can assess their track record
- As a curious user, I want to see what markets someone has created so I can find similar content
- As a participant, I want to view someone's positions so I can learn from their strategies

## Acceptance Criteria
- Profile displays: username, avatar, join date, stats (markets created, positions taken, net outcome)
- Shows list of markets created by user (with status)
- Shows list of positions taken (respecting privacy: only resolved/public markets)
- Mobile responsive (320px+)
- Loading state for async data
- Empty states when user has no activity
- 404 state for non-existent users

## Out of Scope
- Private messaging
- Following/social features
- Detailed profit/loss analytics
- Edit profile (that's in Settings)

## Technical Notes
- Route: `/users/[username]`
- API: `/api/users/[username]` (GET)
- Mock data for prototype
