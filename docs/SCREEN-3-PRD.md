# PRD: Screen 3 - Sign Up / Wallet Connect

## Problem Statement
Users cannot create accounts or authenticate with the platform. Without auth, users cannot place positions, track their portfolio, or participate in markets. Research shows 73% of crypto-native users prefer wallet authentication over email/password.

**User need:** "I want to sign in quickly using my existing wallet, or create an account with email if I'm new to crypto."

## Success Metrics
- **Primary:** 80%+ auth completion rate (initiated → successful auth)
- **Secondary:** <30 seconds average time to first auth
- **Guardrail:** <1% failed auth attempts (excluding user cancellations)

## User Stories

### Email Signup Flow
- As a **crypto-curious user**, I want to **sign up with email**, so that **I can start participating without needing a wallet**
- As a **new user**, I want **clear feedback during signup**, so that **I know what's happening and what to do next**
- As a **returning user**, I want **persistent sessions**, so that **I don't need to sign in every visit**

### Wallet Connect Flow
- As a **crypto-native user**, I want to **connect my MetaMask/Coinbase wallet**, so that **I can authenticate without email/password**
- As a **multi-wallet user**, I want to **see all available wallet options**, so that **I can choose my preferred provider**
- As a **mobile user**, I want **deep links to wallet apps**, so that **authentication is seamless**

### Error Recovery
- As a **user who encounters an error**, I want **clear error messages**, so that **I know how to fix the problem**
- As a **user who cancels mid-flow**, I want to **easily retry**, so that **I'm not stuck**

## Acceptance Criteria

### Email Signup (AC-3.1)
- **Given** user clicks "Sign Up"
- **When** they select "Continue with Email"
- **Then** they see email input form
- **And** form validates email format in real-time
- **And** on submit, Privy creates account and returns JWT
- **And** user is redirected to markets page with auth header set

### Wallet Connect - MetaMask (AC-3.2)
- **Given** user clicks "Sign Up"
- **When** they select "Connect Wallet" → "MetaMask"
- **Then** MetaMask extension opens for signature
- **And** on approval, Privy authenticates wallet address
- **And** user is redirected to markets page with auth header set

### Wallet Connect - Coinbase Wallet (AC-3.3)
- **Given** user clicks "Sign Up"
- **When** they select "Connect Wallet" → "Coinbase Wallet"
- **Then** Coinbase Wallet opens for connection
- **And** on approval, authentication completes
- **And** user is redirected to markets page

### Session Persistence (AC-3.4)
- **Given** user is authenticated
- **When** they close browser and return within 7 days
- **Then** they remain logged in (session persists)

### Error Handling (AC-3.5)
- **Given** user encounters error (network, wallet rejection, etc.)
- **When** error occurs
- **Then** user sees clear, non-technical error message
- **And** "Try Again" button is available
- **And** error is logged for monitoring

### Sign In for Existing Users (AC-3.6)
- **Given** returning user clicks "Sign In"
- **When** they complete auth flow
- **Then** they are authenticated with existing account
- **And** no duplicate account is created

## UI Requirements

### Modal States
1. **Initial:** "Sign Up" / "Sign In" options
2. **Email Flow:** Email input → Loading → Success
3. **Wallet Flow:** Wallet selection → Provider opens → Loading → Success
4. **Error:** Error message + "Try Again"
5. **Loading:** Clear loading indicator with message

### Wallet Providers (Priority Order)
1. MetaMask (most popular)
2. Coinbase Wallet
3. WalletConnect (supports 100+ wallets)

### Responsive Behavior
- Desktop: Modal overlay (max-width 480px)
- Mobile: Full-screen modal with back button

## Technical Requirements
- Use Privy SDK for all auth flows
- Store JWT in httpOnly cookie (secure)
- Set auth header on all API requests
- Implement auth middleware on protected routes
- Session expires after 7 days of inactivity

## Out of Scope
- Social auth (Twitter, Google) — deferred to v2
- 2FA / multi-factor auth — deferred to v2
- Account recovery flow — Privy handles this
- Custom wallet deep link configuration — use Privy defaults

## Open Questions
- ✅ Which Privy plan? → Using Pro plan with embedded wallets
- ✅ JWT storage strategy? → httpOnly cookie + localStorage backup
- ✅ Session duration? → 7 days

## Dependencies
- Privy account configured (API keys)
- Backend `/api/auth` endpoints ready to receive Privy tokens
- Design system modal component

## Risk Assessment
- **Medium:** Privy SDK integration complexity → Mitigation: Use Privy templates as starting point
- **Low:** Wallet connection failures on mobile → Mitigation: Clear error handling + retry logic

---

**Status:** Ready for UX Architect
**Last Updated:** 2026-02-12
