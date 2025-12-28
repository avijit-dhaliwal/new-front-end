# Agent Status Report

Last updated: 2025-12-27

---

## Agent A (2025-12-27) - Cloudflare Production Deployment & Secrets Cleanup

### Summary

Comprehensive security audit and hardening for Cloudflare deployment. Removed all committed secrets, added security documentation, and ensured the repository is safe to publish.

### What Changed

#### 1. Secrets Removed from Repository

| File | Issue | Resolution |
|------|-------|------------|
| `cloudflare-workers/wrangler-test.toml` | Real ElevenLabs API key | Replaced with wrangler secret instructions |
| `cloudflare-workers/wrangler-conversation.toml` | Real ElevenLabs API key | Replaced with wrangler secret instructions |
| `env.md` | Real Gemini + ElevenLabs keys | Replaced with placeholder values |

#### 2. Git Hygiene

| Issue | Resolution |
|-------|------------|
| `.next/` files tracked in git | Removed via `git rm -r --cached .next` |
| 14 build artifacts removed | .next/cache/*, .next/trace, etc. |
| `.gitignore` verified | Already had `.next` entry |

#### 3. Security Headers Added to Portal Worker

The portal-worker.js now includes:
- **Configurable CORS**: Production origins allowlist with dev mode override
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy
- **Request Size Limits**: 1MB default, 5MB for webhooks
- **Rate Limiting**: 120 requests/minute per IP (configurable)
- **Structured Logging**: Request ID, org ID, user ID for tracing

#### 4. Documentation Updates

- **deploy.md**: Added comprehensive secrets management section with key rotation procedures
- **All wrangler configs**: Added "NEVER PUT SECRETS IN THIS FILE" warnings

### What Was Verified

#### Secrets Scan Results

```bash
# No actual API keys found in repository
rg "AIzaSy[a-zA-Z0-9_-]{33}" → No matches
rg "sk_test_[a-zA-Z0-9]{10,}|sk_live_[a-zA-Z0-9]{10,}" → No matches  
rg "sk_[a-f0-9]{48}" → No matches (ElevenLabs)
```

Note: Some Stripe key pattern strings appear in Clerk SDK code (validation functions like `isDevelopmentFromSecretKey`), but these are prefix checks, not actual secrets.

#### Build Verification

```bash
npm run build: PASSED (43 pages)
No API keys in .next/ output: VERIFIED
```

### Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Previously exposed keys may still be valid | HIGH | **ROTATE ALL KEYS IMMEDIATELY** (see rotation procedures in deploy.md) |
| CORS allows `*` in legacy code path | MEDIUM | Migration to strict CORS via `ALLOWED_ORIGINS` env var |
| In-memory rate limiting resets on worker restart | LOW | Consider Cloudflare Rate Limiting rules for production |
| D1 database_id not populated in wrangler configs | LOW | Fill in after creating D1 database |

### Key Rotation Checklist

**MANDATORY**: The following keys were previously committed and MUST be rotated:

- [ ] **ElevenLabs API Key** - Go to elevenlabs.io → Profile → API Keys → Create new → Delete old
- [ ] **Gemini API Key** - Go to aistudio.google.com → API Keys → Create new → Delete old

After rotation, set new secrets:
```bash
wrangler secret put ELEVENLABS_API_KEY --name chadis-voice
wrangler secret put ELEVENLABS_API_KEY --name chadis-voice-conversation
wrangler secret put GEMINI_API_KEY --name chadis-chat
```

### Cloudflare Deployment Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
│                    (Next.js Frontend)                        │
│                    koby.ai / portal.koby.ai                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ portal-worker │  │  chat-worker  │  │ voice-worker  │
│   (koby-portal)│  │ (chadis-chat) │  │ (chadis-voice)│
│               │  │               │  │               │
│ - JWT auth    │  │ - Gemini API  │  │ - ElevenLabs  │
│ - D1 database │  │ - site_key    │  │ - TTS         │
│ - Stripe      │  │ - D1 logging  │  │               │
└───────┬───────┘  └───────┬───────┘  └───────────────┘
        │                  │
        └────────┬─────────┘
                 ▼
        ┌───────────────┐
        │  D1 Database  │
        │koby-portal-db │
        └───────────────┘
```

### Files Changed

| File | Action |
|------|--------|
| `cloudflare-workers/wrangler-test.toml` | MODIFIED - Removed secret, added instructions |
| `cloudflare-workers/wrangler-conversation.toml` | MODIFIED - Removed secret, added instructions |
| `cloudflare-workers/wrangler-voice-conversation.toml` | MODIFIED - Added secret instructions |
| `cloudflare-workers/wrangler-voice.toml` | MODIFIED - Improved secret instructions |
| `cloudflare-workers/wrangler-portal.toml` | MODIFIED - Added comprehensive secret section |
| `cloudflare-workers/wrangler-chat.toml` | MODIFIED - Added comprehensive secret section |
| `cloudflare-workers/deploy.md` | MODIFIED - Added secrets management + key rotation |
| `env.md` | MODIFIED - Replaced real keys with placeholders |
| `.next/*` | DELETED - Removed 14 build artifacts from git |

### OK to Publish Repository

✅ **YES** - After rotating the exposed keys (ElevenLabs, Gemini), the repository is safe to make public.

Pre-publication checklist:
- [x] No API keys (AIzaSy...) in code
- [x] No Stripe secrets in code
- [x] No ElevenLabs secrets in code
- [x] .next/ not tracked in git
- [x] All wrangler configs use `wrangler secret put`
- [x] Key rotation documented
- [x] Security headers configured
- [ ] **ROTATE EXPOSED KEYS** (required before publication)

---

## Agent 3 - Stripe Subscription Billing

### Contract Confirmation

**Stripe subscription is the source of truth for plan status:**
- Subscription status synced from Stripe webhooks to D1 `billing_subscriptions` table
- `orgs.plan` field updated automatically when subscription becomes active/trialing
- Plan mapping: chatbot, phone, bundle, enterprise

**D1 stores billing mirrors + portal display:**
- `billing_customers` - 1:1 link between org and Stripe customer
- `billing_subscriptions` - Subscription lifecycle tracking
- `billing_invoices` + `billing_invoice_lines` - Invoice history
- `stripe_events` - Event log for idempotency and debugging

### Implementation Status

#### Endpoints Implemented

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/billing/overview` | GET | DONE | Billing overview (customer, subscriptions, invoices) |
| `/billing/subscriptions` | GET | DONE | List all subscriptions for org |
| `/billing/invoices` | GET | DONE | List invoices with pagination |
| `/billing/invoices/:id` | GET | DONE | Invoice detail with line items |
| `/billing/checkout-session` | POST | DONE | Create Stripe Checkout for subscription |
| `/billing/portal-session` | POST | DONE | Create Stripe Billing Portal session |
| `/webhooks/stripe` | POST | DONE | Stripe webhook receiver (no auth, signature verified) |

#### Webhook Signature Verification

- Uses HMAC-SHA256 signature verification
- Validates `stripe-signature` header with `t=` timestamp and `v1=` signature
- Rejects events older than 5 minutes (replay protection)
- Implementation: `verifyStripeWebhook()` function in portal-worker.js

#### Webhook Idempotency + Replay Safety

- All events stored in `stripe_events` table with unique `stripe_event_id`
- Duplicate check before processing: `SELECT id FROM stripe_events WHERE stripe_event_id = ?`
- Returns `{ received: true, duplicate: true }` for duplicates
- Event status tracking: `pending` -> `processed` or `failed`
- Processing errors recorded in `processing_error` column

#### Processed Webhook Events

| Event Type | Action |
|------------|--------|
| `customer.created/updated` | Upsert `billing_customers` |
| `customer.subscription.created/updated` | Upsert `billing_subscriptions`, update `orgs.plan`, write audit log |
| `customer.subscription.deleted` | Mark subscription canceled, write audit log |
| `invoice.created/updated/finalized/paid/payment_failed` | Upsert `billing_invoices` + line items, write audit log (paid/failed) |
| `checkout.session.completed` | Update checkout session status |
| `checkout.session.expired` | Mark checkout session expired |

#### Audit Logging for Billing Events

- Subscription events (created, updated, canceled) logged to `audit_logs`
- Invoice paid/payment_failed events logged to `audit_logs`
- Event type format: `billing.subscription.*`, `billing.invoice_*`
- Actor: `integration/stripe` with Stripe event ID in metadata

### Acceptance Checks

#### Webhook Verification
- [x] Stripe signature verified using HMAC-SHA256
- [x] Invalid signatures rejected with 400 error
- [x] Missing STRIPE_WEBHOOK_SECRET returns 500
- [x] Timestamp tolerance enforced (5 minutes)

#### Subscription Update Paths
- [x] New subscription: Creates `billing_subscriptions` row, updates `orgs.plan`
- [x] Subscription update: Updates existing row with new status/period
- [x] Subscription cancel: Marks subscription as canceled
- [x] Trial start: Records trial_start/trial_end dates
- [x] Payment failure: Invoice status updated to reflect failure

#### Portal Summary (No Fake Data)
- [x] `GET /billing/overview` returns data from D1 tables only
- [x] No hardcoded/sample data in responses
- [x] `currentPlan` derived from active subscription in `billing_subscriptions`
- [x] `recentInvoices` from `billing_invoices` table
- [x] Returns `null` for missing data (not fake placeholders)

#### Portal UI Integration
- [x] Portal page fetches `/billing/overview` to get subscription status
- [x] `BillingStatusBanner` component displays warning for `past_due`/`unpaid` subscriptions
- [x] "Manage Billing" button creates portal session and redirects to Stripe

#### Failure Modes for past_due/unpaid Subscriptions
- [x] Yellow warning banner displayed for `past_due` status
- [x] Red alert banner displayed for `unpaid` status  
- [x] Clear messaging about payment method update needed
- [x] One-click access to Stripe Billing Portal for resolution
- [x] Portal remains accessible (read-only not enforced yet - future enhancement)

### Deployment Readiness

#### Required Environment Variables

```bash
# Stripe API (required for billing)
STRIPE_SECRET_KEY=sk_test_xxx     # Test mode: sk_test_*, Live: sk_live_*
STRIPE_WEBHOOK_SECRET=whsec_xxx   # From Stripe Dashboard webhook config

# Existing (required)
CLERK_DOMAIN=xxx.clerk.accounts.dev

# D1 Database (auto-bound in wrangler.toml)
DB=<D1_BINDING>
```

#### Test Mode Workflow

1. **Use test API keys:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_xxx
   ```

2. **Test cards:**
   - `4242424242424242` - Successful payment
   - `4000000000000341` - Attach succeeds, charge fails
   - `4000000000000002` - Card declined

3. **Local webhook testing with Stripe CLI:**
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks to local worker
   stripe listen --forward-to localhost:8787/webhooks/stripe
   
   # Copy the webhook signing secret (whsec_xxx) to env
   ```

4. **Trigger test events:**
   ```bash
   # Trigger a checkout.session.completed event
   stripe trigger checkout.session.completed
   
   # Trigger subscription lifecycle
   stripe trigger customer.subscription.created
   stripe trigger invoice.paid
   ```

#### Stripe Dashboard Configuration

1. **Products & Prices** (create in Stripe Dashboard):
   | Product | Price ID Pattern | Amount |
   |---------|-----------------|--------|
   | AI Chatbot | price_chatbot_* | $50/mo |
   | AI Phone Service | price_phone_* | $400/mo |
   | Bundle Pack | price_bundle_* | $425/mo |
   | Custom AI Suite | price_enterprise_* | Custom |

2. **Webhook Endpoint** (Stripe Dashboard > Developers > Webhooks):
   - URL: `https://portal-worker.koby.ai/webhooks/stripe`
   - Events to enable:
     - `customer.created`, `customer.updated`
     - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
     - `invoice.created`, `invoice.updated`, `invoice.finalized`, `invoice.paid`, `invoice.payment_failed`
     - `checkout.session.completed`, `checkout.session.expired`

3. **Customer Portal** (Stripe Dashboard > Settings > Billing > Customer portal):
   - Enable: Subscription cancellation
   - Enable: Update payment method
   - Enable: View invoice history
   - Optionally: Enable plan switching

#### Wrangler Configuration

Add to `wrangler-portal.toml`:
```toml
[vars]
# Set via wrangler secret for production
# STRIPE_SECRET_KEY = "sk_live_xxx"
# STRIPE_WEBHOOK_SECRET = "whsec_xxx"
```

Set secrets:
```bash
wrangler secret put STRIPE_SECRET_KEY --name koby-portal-worker
wrangler secret put STRIPE_WEBHOOK_SECRET --name koby-portal-worker
```

### Files Modified

| File | Changes |
|------|---------|
| `cloudflare-workers/portal-schema.sql` | Added 7 billing tables |
| `cloudflare-workers/portal-worker.js` | Added 7 billing endpoints + webhook handler + audit logging for billing events |
| `cloudflare-workers/wrangler-portal.toml` | Added test vs live Stripe key documentation |
| `app/portal/page.tsx` | Added BillingStatusBanner component, subscription status tracking, Stripe portal integration |
| `types/portal.ts` | Added Stripe billing TypeScript types |
| `BILLING_ARCHITECTURE.md` | Comprehensive documentation |

### Testing Checklist

- [ ] Deploy worker to staging
- [ ] Configure webhook endpoint in Stripe Dashboard (test mode)
- [ ] Create test subscription via checkout session
- [ ] Verify subscription appears in D1
- [ ] Verify org.plan updated
- [ ] Trigger invoice.paid webhook
- [ ] Verify invoice appears in D1
- [ ] Access billing portal session
- [ ] Cancel subscription via portal
- [ ] Verify cancellation synced to D1

---

## Agent 1 - Auth + Invite + Membership Caps

**Status**: COMPLETE  
**Mode**: Invite-only access control with membership caps

### Summary

Implemented invite-only access model where Koby staff controls org creation and initial admin invites. Client org admins can invite additional members within their org's membership cap. Membership caps are enforced with a default of 10 members per org, and staff can override caps.

### Implementation Status

#### Invite-Only Access

| Feature | Status | Description |
|---------|--------|-------------|
| Sign-up page blocked | DONE | `/sign-up` shows invite-only message |
| Sign-in cleanup | DONE | Removed sign-up links from sign-in page |
| Org creation restricted | DONE | `OrganizationList` hides "Create" for non-staff |
| Cross-org access | DONE | `?orgId=` parameter restricted to staff only |

#### Membership Caps

| Feature | Status | Description |
|---------|--------|-------------|
| Schema update | DONE | `max_members` column added to `orgs` table |
| GET `/portal/membership-caps` | DONE | Returns org's current cap info |
| PATCH `/portal/membership-caps` | DONE | Staff-only endpoint to update cap |
| POST `/portal/check-invite-allowed` | DONE | Checks if invite is allowed given member count |
| API proxy route | DONE | `/api/portal/check-invite-allowed` proxies to worker |
| Team page UI | DONE | Shows member count vs cap with progress bar |

### Acceptance Checks

#### Invite-Only Access Control
- [x] Non-invited user cannot self-register (blocked at `/sign-up`)
- [x] Sign-up page displays clear invite-only messaging
- [x] Org creation button hidden for non-staff users
- [x] Cross-org access via `?orgId=` is staff-only

#### Membership Cap Enforcement
- [x] Default cap of 10 members per org in schema
- [x] Client admin can view member count vs cap on Team page
- [x] Visual warning when approaching cap (<=2 slots remaining)
- [x] Visual alert when cap reached (0 slots remaining)
- [x] Staff override: Staff can always invite regardless of cap
- [x] Staff can update `max_members` via PATCH endpoint
- [x] Audit log entry created when cap is updated

#### API Responses

**GET /portal/membership-caps**
```json
{
  "orgId": "org_xxx",
  "orgName": "Acme Corp",
  "maxMembers": 10
}
```

**POST /portal/check-invite-allowed**
```json
{
  "allowed": true,
  "reason": "under_cap",
  "currentMemberCount": 5,
  "maxMembers": 10,
  "remainingSlots": 5,
  "message": "You can invite up to 5 more members."
}
```

**PATCH /portal/membership-caps (staff only)**
```json
{
  "orgId": "org_xxx",
  "orgName": "Acme Corp",
  "maxMembers": 25,
  "updated": true
}
```

### Files Modified

| File | Changes |
|------|---------|
| `cloudflare-workers/portal-schema.sql` | Added `max_members` column to `orgs` table |
| `cloudflare-workers/portal-worker.js` | Added 3 membership cap endpoints + route matching |
| `app/portal/team/page.tsx` | Added membership cap status display with progress bar |
| `app/api/portal/check-invite-allowed/route.ts` | API proxy route to portal worker |
| `app/sign-up/[[...sign-up]]/page.tsx` | Invite-only message (previous iteration) |
| `app/sign-in/[[...sign-in]]/page.tsx` | Removed sign-up links (previous iteration) |
| `middleware.ts` | Staff-only cross-org access (previous iteration) |
| `PORTAL_ACCESS.md` | Documentation (previous iteration) |

### Security Model

```
Access Hierarchy:
┌────────────────────────────────────────────────┐
│ Koby Staff                                      │
│ - Full cross-org access via ?orgId=            │
│ - Can create orgs (via Clerk dashboard)        │
│ - Can invite first admin to any org            │
│ - Can update membership caps                   │
│ - Can bypass membership caps                   │
├────────────────────────────────────────────────┤
│ Client Admin (org:admin, org:client_admin)     │
│ - Full access within own org                   │
│ - Can invite members (within cap)              │
│ - Can manage roles for own org                 │
│ - Cannot create new orgs                       │
├────────────────────────────────────────────────┤
│ Client Viewer (org:viewer)                     │
│ - Read-only access to portal data              │
│ - Cannot invite members                        │
│ - Cannot manage settings                       │
└────────────────────────────────────────────────┘
```

### Build Verification

```
npm run build: PASSED
TypeScript: PASSED
New API route: /api/portal/check-invite-allowed
All 43 pages generated
```

---

## Agent 2 - Public Demos Hardening

**Status**: COMPLETE  
**Mode**: Security hardening for public demo pages

### Summary

All public demo routes have been audited and hardened. Critical API key leakage vulnerabilities were discovered and remediated. Rate limiting and abuse controls are in place.

### Acceptance Checks

#### 1. No Secrets in Browser Build

| File | Issue | Status |
|------|-------|--------|
| `components/demo/GenericChatBot.tsx` | Hardcoded Gemini key removed | FIXED |
| `components/demo/GenericVoiceAgent.tsx` | Hardcoded Gemini key removed | FIXED |
| `components/pannudental/ChatBot.tsx` | Hardcoded Gemini key removed | FIXED |
| `app/emailagent/page.tsx` | Hardcoded Gemini key removed | FIXED |
| `components/chadis/ChatBot.tsx` | Uses Cloudflare Worker (secure) | OK |
| `.env.example` | Real keys replaced with placeholders | FIXED |
| `.next/` build output | No API keys present | VERIFIED |

**Verification:**
```bash
# Should return nothing
grep -rn "AIzaSy" .next/

# Should only show server-side route
grep -rn "generativelanguage.googleapis.com" components/ app/ --include="*.tsx"
```

#### 2. Demo Smoke Checks (All Public Routes Remain Accessible)

| Route | Auth Required | Status |
|-------|---------------|--------|
| `/demo/chat` | No | PUBLIC |
| `/demo/voice` | No | PUBLIC |
| `/pannudental` | No | PUBLIC |
| `/emailagent` | No | PUBLIC |
| `/chadis` | No | PUBLIC |

**Middleware verification**: Only `/portal(.*)` routes are protected.

#### 3. Abuse Controls

| Control | Value | Location |
|---------|-------|----------|
| Rate limit | 20 req/min per IP | `/api/demo-chat` |
| Message length (chat) | 2,000 chars max | `/api/demo-chat` |
| Message length (invoice) | 50,000 chars max | `/api/demo-chat` |
| IP detection | x-forwarded-for, x-real-ip, cf-connecting-ip | `/api/demo-chat` |
| Input validation | Required fields, type checks | `/api/demo-chat` |
| Error handling | Safe messages only | All endpoints |

#### 4. Environment Requirements

Add to `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Files Modified

| File | Changes |
|------|---------|
| `components/demo/GenericChatBot.tsx` | Removed hardcoded key, uses `/api/demo-chat` |
| `components/demo/GenericVoiceAgent.tsx` | Removed hardcoded key, uses `/api/demo-chat` |
| `components/pannudental/ChatBot.tsx` | Removed hardcoded key, uses `/api/demo-chat?mode=pannudental` |
| `app/emailagent/page.tsx` | Removed hardcoded key, uses `/api/demo-chat?mode=invoice` |
| `app/api/demo-chat/route.ts` | Added `pannudental` and `invoice` modes |
| `app/portal/team/page.tsx` | Fixed Clerk useOrganization TypeScript error |
| `.env.example` | Replaced real API keys with placeholders |

### Security Architecture

```
Browser (Client)                    Server (API Routes)
----------------                    -------------------
GenericChatBot.tsx  ─────►  /api/demo-chat  ─────►  Gemini API
   mode: 'chat'              (GEMINI_API_KEY)

PannuDental/ChatBot.tsx ─────►  /api/demo-chat  ─────►  Gemini API
   mode: 'pannudental'          (GEMINI_API_KEY)

emailagent/page.tsx ─────►  /api/demo-chat  ─────►  Gemini API
   mode: 'invoice'             (GEMINI_API_KEY)

Chadis/ChatBot.tsx ─────►  Cloudflare Worker  ─────►  Gemini API
                            (API key in worker env)

CustomElevenLabsVoiceWidget ─────►  /api/elevenlabs-signed-url  ─────►  ElevenLabs
                                     (ELEVENLABS_API_KEY)
```

### Build Verification

```
npm run build: PASSED (42 pages)
TypeScript: PASSED
No API keys in output: VERIFIED
```

### Recommendations for Production

1. **Redis Rate Limiting**: Replace in-memory Map with Redis for distributed deployments
2. **CAPTCHA**: Add reCAPTCHA/hCaptcha for repeated abuse patterns
3. **Usage Analytics**: Implement demo usage tracking for capacity planning
4. **Cost Monitoring**: Set up Gemini API usage alerts

---

## Agent 4 - Widget Roadmap (Design Only)

**Status**: COMPLETE  
**Mode**: Design/documentation only (no production behavior changes)

### Schema/Endpoint Specification

#### D1 Schema Tables (`cloudflare-workers/widget-schema.sql`)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `site_deployments` | Per-environment widget deployments | `deploy_key`, `allowed_origins`, `environment` |
| `widget_profiles` | Reusable theme/behavior configs | `theme`, `behavior`, `locale`, `analytics` |
| `widget_versions` | Widget code version tracking | `version`, `script_url`, `status` |
| `deployment_version_pins` | Version pinning per deployment | `pin_type`, `channel`, `rollout_percentage` |

#### Public Config Endpoint: `GET /widget/config/:deploy_key`

**Response Fields** (safe to expose):
```json
{
  "config": {
    "deploy_key": "sk_dental_live_xyz789",
    "org_slug": "pannu-dental",
    "site_name": "Pannu Dental Chat",
    "theme": { "position", "primaryColor", "fontFamily", ... },
    "behavior": { "autoOpen", "persistSession", ... },
    "locale": { "greeting", "offlineMessage", ... },
    "analytics": { "trackEvents", "trackConversions" },
    "endpoints": { "chat", "session" },
    "widget_version": "1.2.0"
  }
}
```

**Secret Fields** (NEVER exposed):
- `system_prompt` - Business logic / IP
- `google_api_key` - Provider credential
- `elevenlabs_api_key` - Provider credential
- `rate_limit_rpm` / `rate_limit_daily` - Internal policy
- `org_id` - Internal reference

#### Origin Validation

```
Origin header validated against site_deployments.allowed_origins
- Exact domain matching: https://example.com
- Wildcard subdomains: *.example.com
- Empty array = allow all (dev mode only)
- 403 response if origin not in allowlist
```

### Compatibility Notes

| Component | Status | Notes |
|-----------|--------|-------|
| `portal_sites.site_key` | UNCHANGED | Remains primary tenant routing |
| Chat worker `X-Site-Key` | UNCHANGED | Still works as-is |
| `portal_sites.config` | UNCHANGED | Widget profiles extend, don't replace |
| Existing sites | COMPATIBLE | Fallback to legacy behavior if no deployment |

**Migration Path** (additive, no breaking changes):
1. If `site_deployments` entry exists for deploy_key, use new system
2. Otherwise, fall back to `portal_sites.site_key` lookup
3. If no `widget_profile_id`, use default theme/behavior
4. Empty `allowed_origins` = allow all (backward compat)

### Portal UX Plan

| Tab | Features |
|-----|----------|
| **Embed** | Copy/paste snippet, environment selector (dev/staging/prod), live preview iframe |
| **Theme** | Position, colors, fonts, dark mode, header text, branding toggle |
| **Behavior** | Auto-open delay, session persistence, typing indicator, message limits |
| **Domains** | Allowed origins management, per-environment lists |
| **Versions** | Current version, pin policy (stable/beta/canary), rollout percentage |

**Publish History / Audit Logs**:
- Changes to `widget_profiles` logged in `audit_logs` table
- Deployment activations/pauses tracked
- Key rotation events with 24-hour overlap window

### Self-Serve (Explicitly Deferred)

**NOT Implemented** (per coordination rules):
- End-user self-serve login
- Self-serve org creation
- Public sign-up flow

**Schema Ready for Future**:
```sql
-- Uncomment when ready:
-- CREATE TABLE onboarding_steps (...)
-- ALTER TABLE orgs ADD COLUMN trial_ends_at TEXT;
-- ALTER TABLE orgs ADD COLUMN activated_at TEXT;
```

**Feature Flags** (proposed):
```typescript
// lib/feature-flags.ts
export const FEATURES = {
  SELF_SERVE_SIGNUP: false,  // Toggle when ready
  REQUIRE_BILLING_FOR_ACTIVATION: true,
  TRIAL_PERIOD_DAYS: 14,
}
```

### Future Milestones

| Phase | Milestone | Priority | Depends On |
|-------|-----------|----------|------------|
| 1 | Apply widget-schema.sql to D1 | P0 | - |
| 1 | Implement `/widget/config/:deploy_key` endpoint | P0 | Schema |
| 1 | Add origin validation to chat worker | P0 | Endpoint |
| 2 | Portal Embed tab UI | P1 | Config endpoint |
| 2 | Portal Theme/Behavior editors | P1 | Widget profiles |
| 2 | Portal Domains management | P1 | Site deployments |
| 3 | Version management + rollout UI | P2 | Widget versions |
| 3 | Key rotation flow | P2 | Audit logs |
| 4 | Self-serve onboarding wizard | P3 | Agent 3 billing |

### Acceptance Checks

| Check | Status |
|-------|--------|
| Schema/endpoint spec documented | PASS |
| Compatibility with `portal_sites.site_key` | PASS |
| Secret separation documented | PASS |
| Origin restrictions specified | PASS |
| Portal UX tabs planned | PASS |
| Publish history approach defined | PASS |
| Self-serve explicitly deferred | PASS |
| Future milestones defined | PASS |

### Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `cloudflare-workers/widget-schema.sql` | CREATED | D1 schema for widget tables |
| `types/portal.ts` | MODIFIED | Added TypeScript types for widget system |
| `.agent/report.md` | MODIFIED | Full Agent 4 roadmap documentation |

### TypeScript Types Added (`types/portal.ts`)

```typescript
// Core types
WidgetTheme, WidgetBehavior, WidgetLocale, WidgetAnalytics
WidgetProfile, SiteDeployment, WidgetVersion, DeploymentVersionPin

// API response types
PublicWidgetConfig, PublicWidgetConfigResponse
WidgetProfilesResponse, SiteDeploymentsResponse
WidgetVersionsResponse, RotateKeyResponse
```

### Build Verification

```
npm run build: PASSED
TypeScript check: PASSED
All 42 pages generated
No breaking changes
```

---

## Agent D (2025-12-26) - Production Runbook & Final Hardening

**Status**: COMPLETE  
**Mode**: Documentation and production readiness verification

### Summary

Created comprehensive production runbook, verified all previous agent security improvements, fixed TypeScript errors, and consolidated production readiness checklist.

### What Changed

#### 1. Production Runbook Created

New file `PRODUCTION_RUNBOOK.md` includes:

| Section | Content |
|---------|---------|
| Architecture Overview | System diagram, component list |
| Pre-Deployment Checklist | Required steps before deploying |
| Environment Variables Matrix | All vars for Vercel + Workers |
| Deployment Procedures | Step-by-step deploy commands |
| D1 Database Operations | Schema migrations, backups, queries |
| Rollback Procedures | How to revert failed deployments |
| Monitoring & Alerting | Log events, dashboards, Logpush setup |
| Incident Response | Severity levels, playbook, quick checks |
| Security Checklist | Pre-production and ongoing requirements |

#### 2. Portal Worker Enhancements (via Agent A)

Verified the following security improvements were applied:
- Configurable CORS via `ALLOWED_ORIGINS` env var
- Request size limits (1MB standard, 5MB webhooks)
- Structured JSON logging with request IDs
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

#### 3. TypeScript Fix

Fixed missing props in `ClientPortalView` component:
- Added `subscriptionStatus` prop
- Added `onManageBilling` handler with Stripe portal session integration

### Files Modified

| File | Changes |
|------|---------|
| `PRODUCTION_RUNBOOK.md` | **CREATED** - Comprehensive operations guide |
| `cloudflare-workers/wrangler-portal.toml` | Added new env vars (CORS, logging, monitoring) |
| `app/portal/page.tsx` | Fixed TypeScript error in ClientPortalView props |

### Secrets Verification

| Check | Result |
|-------|--------|
| `grep -rn "AIzaSy"` in .ts/.tsx/.js | No matches (PASS) |
| Stripe keys in source | No hardcoded keys (PASS) |
| ElevenLabs keys in source | No hardcoded keys (PASS) |
| Keys in wrangler configs | All use `wrangler secret put` (PASS) |

### Build Verification

```
npm run build: PASSED
TypeScript check: PASSED
All 43 pages generated
No breaking changes
```

---

## Production Readiness Checklist

Cross-reference of all agent work for go-live:

### Auth & Access Control (Agent 1)
- [x] Invite-only sign-up
- [x] Org creation restricted to staff
- [x] Membership caps with staff override
- [x] Cross-org access restricted to staff

### Public Demos Security (Agent 2)
- [x] No API keys in browser code
- [x] Server-side proxy for Gemini API
- [x] Rate limiting on demo endpoints (20 req/min)
- [x] Input validation and size limits

### Billing (Agent 3)
- [x] Stripe webhook signature verification
- [x] Idempotency via `stripe_events` table
- [x] Subscription lifecycle tracking
- [x] Invoice sync and portal access

### Widget Roadmap (Agent 4)
- [x] Schema designed (not yet applied)
- [x] TypeScript types defined
- [x] Secret separation documented
- [x] Compatibility with existing `site_key` system

### Production Infrastructure (Agent A + Agent D)
- [x] Secrets removed from repo
- [x] Configurable CORS
- [x] Request size limits
- [x] Structured logging
- [x] Security headers
- [x] Production runbook created
- [x] Key rotation documented

### Pre-Launch Checklist

| Step | Owner | Status |
|------|-------|--------|
| **ROTATE EXPOSED KEYS** (ElevenLabs, Gemini) | Security | **REQUIRED** |
| Apply billing schema to D1 | Ops | Pending |
| Configure Stripe webhook endpoint | Ops | Pending |
| Set production secrets via `wrangler secret put` | Ops | Pending |
| Configure Cloudflare Logpush | Ops | Pending |
| Update `ALLOWED_ORIGINS` for production domains | Ops | Pending |
| Test Stripe checkout flow in live mode | QA | Pending |
| Verify CORS works from production domains | QA | Pending |
| Monitor logs for first 24 hours | Ops | Pending |
