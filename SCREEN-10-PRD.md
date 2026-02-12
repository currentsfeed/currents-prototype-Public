# Screen 10: Notifications — PRD

## Problem Statement
Users need to track activity related to their markets and positions (resolutions, price changes, comments) but have no notification feed. They miss important updates.

## Success Metrics
- Primary: 70% of users check notifications within 24h of activity
- Secondary: Notification click-through rate > 40%
- Guardrail: No more than 10% spam reports

## User Stories
- As a trader, I want to see when my positions change value
- As a market creator, I want to know when my market resolves
- As an active user, I want to see recent activity in one place
- As a returning user, I want to mark notifications as read

## Acceptance Criteria
- Displays notifications in reverse chronological order
- Shows: icon, message, timestamp, read/unread state
- Click notification → navigate to relevant market/profile
- "Mark all as read" button
- Empty state for no notifications
- Real-time badge count (mocked)
- Mobile responsive

## Out of Scope
- Push notifications to device
- Notification preferences (that's in Settings)
- Delete individual notifications
- Notification search/filter

## Technical Notes
- Route: `/notifications`
- API: `/api/users/me/notifications` (GET)
- Protected route (requires auth)
