# UX Flows: Screen 3 - Sign Up / Wallet Connect

## User Flow 1: Email Signup (New User)

**Entry Point:** Homepage → "Sign Up" button (header)

### Happy Path
1. User clicks "Sign Up"
2. Modal opens with title "Join Currents"
3. User sees 2 primary options:
   - "Continue with Email" (button)
   - "Connect Wallet" (button)
4. User clicks "Continue with Email"
5. Form appears: "Enter your email"
6. User types email → real-time validation (green checkmark if valid)
7. User clicks "Continue"
8. Loading state: "Creating your account..."
9. Success: Modal shows "Welcome! 👋" + auto-redirect in 2s
10. Redirects to markets page (authenticated)

### Error Paths
- **Invalid email format** → Red text below input: "Please enter a valid email"
- **Email already exists** → Message: "Looks like you already have an account. Try signing in instead." + "Sign In" button
- **Network error** → "Couldn't connect. Check your internet and try again." + "Try Again" button
- **Privy service error** → "Something went wrong on our end. Please try again in a moment." + "Try Again"

### Empty State
- N/A (modal always shows options)

### Edge Cases
- **User closes modal mid-flow** → Modal closes, no account created
- **User navigates away** → No account created, state resets
- **Spam detection triggered** → "Too many attempts. Please wait 5 minutes." + countdown timer

### Exit Points
- Cancel/close modal → Return to previous page
- Success → Markets page (authenticated)
- "Already have an account? Sign in" link → Opens Sign In modal

---

## User Flow 2: Wallet Connect (MetaMask)

**Entry Point:** Homepage → "Sign Up" button → "Connect Wallet"

### Happy Path
1. User clicks "Sign Up"
2. Modal opens with "Join Currents"
3. User clicks "Connect Wallet"
4. Wallet selection screen shows:
   - MetaMask (icon + "Most popular")
   - Coinbase Wallet
   - WalletConnect ("100+ wallets")
5. User clicks "MetaMask"
6. MetaMask extension popup opens:
   - "Connect with MetaMask"
   - Shows Currents origin
   - User's wallet address visible
7. User clicks "Connect" in MetaMask
8. MetaMask requests signature: "Sign this message to verify you own this wallet"
9. User clicks "Sign"
10. Loading: "Connecting your wallet..."
11. Success: "Wallet connected! 🎉" + auto-redirect
12. Redirects to markets page (authenticated)

### Error Paths
- **MetaMask not installed** → "MetaMask not detected. Install MetaMask extension to continue." + "Install MetaMask" button (opens metamask.io)
- **User rejects connection** → Modal returns to wallet selection, message: "Connection canceled. Try again when ready."
- **User rejects signature** → "Signature required to verify wallet ownership." + "Try Again" button
- **Network mismatch (wrong chain)** → "Please switch to Ethereum mainnet in MetaMask."
- **MetaMask locked** → "Unlock MetaMask to continue."

### Empty State
- N/A

### Edge Cases
- **Mobile browser (no extension)** → Deep link to MetaMask app: `https://metamask.app.link/dapp/currents.app`
- **Multiple accounts in MetaMask** → User chooses in MetaMask UI (Currents shows whichever they select)
- **Wallet already connected to existing account** → Authenticate to existing account (don't create duplicate)

### Exit Points
- Cancel/back → Returns to wallet selection or initial modal
- Success → Markets page (authenticated)

---

## User Flow 3: Sign In (Returning User - Email)

**Entry Point:** Homepage → "Sign In" button

### Happy Path
1. User clicks "Sign In"
2. Modal opens: "Welcome back"
3. Shows "Continue with Email" and "Connect Wallet"
4. User clicks "Continue with Email"
5. Enters email → Privy recognizes existing account
6. Privy sends magic link or shows password input (depends on Privy config)
7. User completes authentication
8. Redirects to markets page

### Error Paths
- **Email not found** → "No account found. Would you like to sign up?"
- **Magic link expired** → "Link expired. Request a new one."
- **Too many attempts** → Temporary lockout with countdown

### Edge Cases
- **User has session cookie** → Skip sign-in entirely, auto-authenticate
- **Session expired mid-browse** → Show subtle "Session expired. Sign in to continue." banner, then auth modal

### Exit Points
- Cancel → Return to previous page
- Success → Markets page
- "Don't have an account? Sign up" → Opens Sign Up modal

---

## User Flow 4: Sign In (Returning User - Wallet)

**Entry Point:** Homepage → "Sign In" → "Connect Wallet"

### Happy Path
1. User clicks "Sign In"
2. Modal opens
3. User clicks "Connect Wallet" → Selects MetaMask
4. MetaMask opens
5. Privy recognizes wallet address → Skips account creation, just authenticates
6. User signs message
7. Success → Redirects to markets

### Error Paths
- Same as Sign Up wallet flow

### Edge Cases
- **New wallet address from returning user (changed wallets)** → System treats as new account
- **User wants to link multiple wallets to same account** → Feature not in v1 (out of scope)

---

## Wireframe Annotations

### Modal Structure
- **Fixed width:** 480px (desktop), full-screen (mobile)
- **Backdrop:** Dark overlay (80% opacity), click to close
- **Close button:** Top-right "×" button (always visible)
- **Header:** "Join Currents" or "Welcome back" (context-sensitive)

### Email Input
- **Label:** "Email address"
- **Placeholder:** "you@example.com"
- **Validation:** Real-time on blur (debounced 300ms)
- **States:** Default, Focus, Valid (green check), Error (red text)

### Wallet Selection
- **Layout:** Vertical list, cards with:
  - Wallet icon (left)
  - Wallet name (center)
  - Badge (right, e.g., "Popular")
- **Hover:** Subtle lift + border highlight
- **Tap area:** Full card (min 48px height for touch targets)

### Loading States
- **Spinner:** Center of modal
- **Text:** "Creating your account..." / "Connecting wallet..."
- **Duration:** Realistic (1-3s), not instant (feels broken) or too long (frustrating)

### Success State
- **Icon:** Large checkmark or celebration emoji
- **Text:** "Welcome!" or "Wallet connected!"
- **Auto-close:** 2 seconds, with progress indicator
- **Manual close:** "Continue" button if auto-close disabled

---

## Accessibility Requirements

### Keyboard Navigation
- **Tab order:** Modal open → Close button → Primary action → Secondary action → Links
- **Enter:** Activates focused button
- **Escape:** Closes modal (with confirmation if data entered)

### Screen Reader
- **Modal announcement:** "Sign up dialog. Join Currents."
- **Focus trap:** Focus stays within modal until closed
- **Error announcements:** Errors read immediately via aria-live

### Mobile
- **Touch targets:** Minimum 48x48px
- **Text size:** Minimum 16px (prevents zoom on iOS)
- **Scrollable content:** Modal scrolls if content exceeds viewport

---

## Usability Testing Plan

### Task 1: Email Signup
- **Goal:** Create account via email
- **Success:** Account created, user lands on markets page
- **Time target:** <60 seconds
- **Test:** Can user find signup? Is email input clear? Does validation help or hinder?

### Task 2: Wallet Connect
- **Goal:** Authenticate with MetaMask
- **Success:** Wallet connected, authenticated
- **Time target:** <45 seconds (excluding MetaMask interaction time)
- **Test:** Is wallet option discoverable? Are instructions clear? Do error messages help?

### Task 3: Error Recovery
- **Scenario:** Simulate network error mid-signup
- **Goal:** User successfully retries
- **Success:** User clicks "Try Again" and completes signup
- **Test:** Is error message clear? Is recovery path obvious?

### Metrics to Track
- **Task success rate:** Target 95%+
- **Time on task:** Median <60s for email, <45s for wallet
- **Error rate:** <5% (excluding intentional test errors)
- **Satisfaction:** Post-task rating 4.5/5+

---

**Status:** Ready for Designer
**Handoff:** See wireframes (next file), interaction specs above
**Last Updated:** 2026-02-12
