# Screen 7: User Profile — UX Flow

## Entry Points
- Click username anywhere (market cards, leaderboards, search)
- Direct link: /users/[username]

## Happy Path
1. User clicks on username "alice_trader"
2. System fetches user profile data
3. Page displays: header (avatar, username, join date) + stats cards + tabs
4. Tabs: "Markets Created" | "Positions"
5. User browses markets created (grid view, clickable to market page)
6. User switches to "Positions" tab
7. System shows positions taken (only public/resolved)
8. User clicks on a market → navigates to market detail

## Error Paths
- User not found → 404 with "User not found" message
- Network failure → Retry button with error message
- Slow load → Loading skeleton for 2s+

## Empty States
- No markets created → "No markets created yet" with illustration
- No positions → "No positions taken yet"
- New user (today) → "New to Currents" badge

## Edge Cases
- Username with special characters (encode properly)
- Private profile flag → Show limited info (future feature)
- Banned user → Show "Account suspended" message

## Exit Points
- Click market → Navigate to /markets/[slug]
- Back button → Return to previous page
- Navigation → Use top nav
