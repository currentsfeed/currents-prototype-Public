# Screen 9: Settings — PRD

## Problem Statement
Users need a centralized place to manage account preferences, notification settings, and privacy controls. Currently no settings interface exists.

## Success Metrics
- Primary: 60% of users update at least one setting within first week
- Secondary: Settings save success rate > 99%
- Guardrail: No data loss on save failures

## User Stories
- As a user, I want to update my display name and bio
- As a privacy-conscious user, I want to control who can see my positions
- As a user, I want to manage email/push notification preferences
- As a user, I want to see my account status (balance, joined date)

## Acceptance Criteria
- Settings organized in sections: Account | Notifications | Privacy
- Forms validate before submission
- Save button shows loading state
- Success/error feedback after save
- Changes persist across sessions (mock localStorage for prototype)
- Mobile responsive

## Out of Scope
- Password reset
- 2FA setup
- Account deletion
- Connected wallets management

## Technical Notes
- Route: `/settings`
- API: `/api/users/me/settings` (GET, PUT)
- Protected route (requires auth context)
