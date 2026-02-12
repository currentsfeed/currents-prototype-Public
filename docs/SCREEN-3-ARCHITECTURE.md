# Architecture: Screen 3 - Sign Up / Wallet Connect

## System Overview

### Technology Stack
- **Auth Provider:** Privy SDK (v0.4+)
- **Frontend:** Next.js 14, React 19, TypeScript
- **Backend:** Next.js API Routes (serverless)
- **Session Storage:** HTTP-only cookies + localStorage backup
- **State Management:** React Context (AuthContext)

### Integration Architecture
```
┌─────────────┐
│   Browser   │
│             │
│  ┌───────┐  │         ┌──────────┐
│  │ Privy │──┼────────>│  Privy   │
│  │  SDK  │  │         │  API     │
│  └───┬───┘  │         └─────┬────┘
│      │      │               │
│      ▼      │               │
│  ┌───────┐  │               │
│  │  Auth │  │               │ (JWT token)
│  │Context│  │               │
│  └───┬───┘  │               ▼
│      │      │         ┌──────────┐
│      ▼      │         │ Backend  │
│ ┌─────────┐ │<────────│   API    │
│ │Protected│ │         │  Routes  │
│ │  Pages  │ │         └──────────┘
│ └─────────┘ │               │
└─────────────┘               ▼
                        ┌──────────┐
                        │ Database │
                        │(Future)  │
                        └──────────┘
```

---

## ADR-001: Auth Provider Selection

**Context:** Need user authentication with both email and wallet support.

**Options:**
1. **Auth0** — Industry standard, expensive
2. **NextAuth.js** — Open source, manual wallet integration
3. **Privy** — Built for Web3, supports both email and wallets
4. **Custom** — Build from scratch

**Decision:** **Privy**

**Rationale:**
- Native wallet support (MetaMask, Coinbase, WalletConnect)
- Email magic links built-in
- Embedded wallet option for future
- Fair pricing (free tier covers MVP)
- Active development, good docs

**Consequences:**
- Vendor lock-in (mitigated: JWT standard, can migrate)
- Must handle Privy SDK updates
- Account recovery managed by Privy (less control, but simpler)

**Trade-offs accepted:**
- ❌ Less control over auth flow
- ✅ Weeks of development time saved
- ✅ Security best practices built-in

---

## ADR-002: Session Management Strategy

**Context:** Need persistent authentication across browser sessions.

**Options:**
1. **JWT in localStorage** — Simple, XSS vulnerable
2. **JWT in httpOnly cookie** — Secure, CSRF protection needed
3. **Session ID + server-side storage** — Most secure, requires database

**Decision:** **JWT in httpOnly cookie** with CSRF token

**Rationale:**
- httpOnly prevents XSS attacks
- Cookie auto-sent on requests (no manual header management)
- No database required for MVP
- Standard pattern, well-understood by team

**Implementation:**
```typescript
// Set cookie on auth success
res.setHeader('Set-Cookie', [
  `privy-token=${jwt}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/`,
  `privy-refresh=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`
]);
```

**Consequences:**
- Must implement CSRF protection (double-submit cookie pattern)
- Logout requires server-side cookie clear
- Mobile web works seamlessly (cookies supported)

---

## ADR-003: Frontend State Management

**Context:** Auth state needs to be accessible across all components.

**Options:**
1. **Redux** — Overkill for auth-only state
2. **Zustand** — Lightweight, but additional dependency
3. **React Context** — Built-in, sufficient for auth state

**Decision:** **React Context** with custom AuthProvider

**Rationale:**
- Built-in to React (no dependencies)
- Auth state is global but simple (user object + loading state)
- Privy provides hooks we can wrap

**Implementation:**
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (method: 'email' | 'wallet') => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthProvider = ({ children }: Props) => {
  const { user, authenticated, login, logout } = usePrivy();
  
  return (
    <AuthContext.Provider value={{
      user,
      isLoading: !authenticated && !user,
      isAuthenticated: authenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Consequences:**
- Simple, easy to understand
- No over-engineering
- Can migrate to Zustand later if state grows complex

---

## Data Models

### User Object (from Privy)
```typescript
interface User {
  id: string;                    // Privy user ID (did:privy:xxx)
  createdAt: Date;
  linkedAccounts: LinkedAccount[];
  
  // Wallet accounts
  wallet?: {
    address: string;             // 0x...
    chainType: 'ethereum';
    walletClient: 'metamask' | 'coinbase' | 'walletconnect';
  };
  
  // Email account
  email?: {
    address: string;             // user@example.com
  };
}
```

### Session Storage (Cookie)
```typescript
interface SessionCookie {
  userId: string;                // Privy user ID
  iat: number;                   // Issued at (Unix timestamp)
  exp: number;                   // Expires at (Unix + 7 days)
}
```

---

## API Contracts

### POST /api/auth/login
**Purpose:** Validate Privy token and set session cookie

**Request:**
```typescript
{
  privyToken: string;            // JWT from Privy SDK
}
```

**Response 200:**
```typescript
{
  success: true;
  user: {
    id: string;
    email?: string;
    wallet?: string;
    createdAt: string;           // ISO 8601
  }
}
// + Set-Cookie headers (httpOnly)
```

**Response 400:**
```typescript
{
  success: false;
  error: 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'MISSING_TOKEN';
  message: string;
}
```

**Response 500:**
```typescript
{
  success: false;
  error: 'SERVER_ERROR';
  message: string;
}
```

### GET /api/auth/session
**Purpose:** Verify current session is valid

**Request:** (none, cookie-based)

**Response 200:**
```typescript
{
  authenticated: true;
  user: {
    id: string;
    email?: string;
    wallet?: string;
  }
}
```

**Response 401:**
```typescript
{
  authenticated: false;
  error: 'NOT_AUTHENTICATED' | 'SESSION_EXPIRED';
}
```

### POST /api/auth/logout
**Purpose:** Clear session cookie

**Request:** (none)

**Response 200:**
```typescript
{
  success: true;
}
// + Set-Cookie with Max-Age=0 (clears cookie)
```

---

## Security Architecture

### Threat Model
1. **XSS attacks** → httpOnly cookies prevent token theft
2. **CSRF attacks** → SameSite=Lax + CSRF tokens
3. **Token replay** → Short expiration (7 days), refresh tokens
4. **Man-in-the-middle** → HTTPS only (Secure flag on cookies)
5. **Brute force** → Rate limiting on login endpoints

### Rate Limiting
```typescript
// Using Next.js middleware
const RATE_LIMITS = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 10                      // 10 attempts per window
  }
};
```

### CSRF Protection
```typescript
// Double-submit cookie pattern
// 1. Generate CSRF token on login
const csrfToken = crypto.randomBytes(32).toString('hex');

// 2. Set as cookie + return to client
res.setHeader('Set-Cookie', [
  ...,
  `csrf-token=${csrfToken}; SameSite=Strict; Secure; Path=/`
]);

// 3. Client sends token in header for state-changing requests
headers: {
  'X-CSRF-Token': csrfToken
}

// 4. Server validates header matches cookie
if (req.headers['x-csrf-token'] !== req.cookies['csrf-token']) {
  return res.status(403).json({ error: 'CSRF_TOKEN_MISMATCH' });
}
```

---

## Error Handling Strategy

### Error Categories
1. **User errors** (invalid input) → 400, show friendly message
2. **Auth errors** (invalid token) → 401, redirect to login
3. **Server errors** (Privy API down) → 500, show retry

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: ErrorCode;              // Machine-readable
  message: string;               // User-facing
  details?: any;                 // Debug info (dev only)
}

type ErrorCode =
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'WALLET_REJECTED'
  | 'NETWORK_ERROR'
  | 'PROVIDER_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR';
```

### Retry Logic
```typescript
// Exponential backoff for network errors
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
};
```

---

## Performance Requirements

### Target Metrics
- **Auth modal open:** <100ms
- **Privy SDK init:** <500ms
- **Email login:** <2s end-to-end
- **Wallet connection:** <3s (excluding user interaction time)
- **Session check:** <50ms

### Optimization Strategies
1. **Lazy load Privy SDK** — Don't load until auth modal opens
2. **Prefetch on hover** — Load SDK when user hovers "Sign Up"
3. **Session check caching** — Cache authenticated state, revalidate every 5 minutes
4. **Connection pooling** — Reuse connections to Privy API

---

## Monitoring & Observability

### Key Metrics to Track
1. **Auth completion rate** = successful auths / initiated auths
2. **Auth method breakdown** = email % vs. wallet %
3. **Error rate by type** = network errors, wallet rejections, etc.
4. **Time to first auth** = modal open → authenticated
5. **Session duration** = median time between login and logout

### Logging Strategy
```typescript
// Log all auth events
logger.info('auth.initiated', {
  method: 'email' | 'wallet',
  timestamp: Date.now()
});

logger.info('auth.success', {
  userId: string,
  method: string,
  duration: number  // ms
});

logger.error('auth.failed', {
  error: ErrorCode,
  method: string,
  message: string
});
```

### Alerts
- **High error rate:** >5% failures in 15-minute window
- **Privy API down:** Multiple consecutive 500s
- **Slow auth:** P95 >5s for email, >10s for wallet

---

## Scalability Considerations

### Current Target: 1,000 concurrent users
- Privy handles auth at scale (their responsibility)
- Next.js serverless functions scale automatically
- No database bottleneck (stateless JWT)

### Future (10K+ users)
- **Session storage:** Move to Redis for faster lookups
- **Rate limiting:** Distributed rate limiter (Redis-based)
- **Monitoring:** Move from logs to Datadog/Sentry

---

## Testing Strategy

### Unit Tests
- AuthContext state management
- JWT encoding/decoding
- Error handling functions

### Integration Tests
- Full email signup flow (mock Privy SDK)
- Full wallet connect flow (mock wallet)
- Session validation
- Logout clears cookies

### E2E Tests (Playwright)
- Email signup → Create account → Redirect to markets
- Wallet connect → Approve in MetaMask → Redirect
- Sign in (returning user) → Authenticate → Redirect
- Error recovery → Network error → Retry success

---

## Deployment Checklist

- [ ] Privy API keys set in Vercel environment variables
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] CORS configured (allow same-origin only)
- [ ] Rate limiting enabled
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics tracking (PostHog / Mixpanel)
- [ ] CSRF tokens working in production

---

**Status:** Ready for Engineers
**Dependencies:** Privy account, API keys
**Last Updated:** 2026-02-12
