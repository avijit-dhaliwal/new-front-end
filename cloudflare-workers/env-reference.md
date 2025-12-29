# Environment Variables Reference

## Cloudflare Pages (Next.js Frontend)

These variables go in **Cloudflare Pages Dashboard → Settings → Environment Variables**

### Must be VARIABLES (not secrets) - exposed to browser:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx (or pk_test_xxxxx for dev)
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /portal
NEXT_PUBLIC_KOBY_INTERNAL_ORG_ID = org_koby_internal
NEXT_PUBLIC_PORTAL_WORKER_URL = https://koby-portal.voidinfrastructuretechnologies.workers.dev
```

### Must be SECRETS (server-only):

```
CLERK_SECRET_KEY = sk_live_xxxxx (or sk_test_xxxxx for dev)
GEMINI_API_KEY = your-gemini-api-key
GOOGLE_SHEETS_URL = your-google-sheets-webhook-url
ELEVENLABS_API_KEY = your-elevenlabs-api-key
```

---

## Portal Worker (wrangler-portal.toml)

These are set in wrangler-portal.toml [vars] section or via `wrangler secret put`:

### Variables (in wrangler-portal.toml):

```toml
[vars]
CLERK_DOMAIN = "clerk.kobyai.com"  # or your Clerk domain
ENVIRONMENT = "production"
LOG_LEVEL = "info"
CLOUDFLARE_ZONE_ID = "b75a1071c5e53b9445afd87e83e43f0e"
```

### Secrets (via CLI):

```bash
wrangler secret put CLERK_SECRET_KEY --name koby-portal
wrangler secret put STRIPE_SECRET_KEY --name koby-portal
wrangler secret put STRIPE_WEBHOOK_SECRET --name koby-portal
wrangler secret put CLOUDFLARE_API_TOKEN --name koby-portal
```

---

## How to Find Your Clerk Domain

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **API Keys**
4. Look for "Frontend API" or "Clerk Frontend API URL"
5. It will look like: `clerk.yourdomain.com` or `xxxxx.clerk.accounts.dev`

---

## Quick Fix Checklist

1. [ ] In Cloudflare Pages, delete all `NEXT_PUBLIC_*` secrets
2. [ ] Re-add them as plain **Variables** (not secrets)
3. [ ] Trigger a new deployment (or push a commit)
4. [ ] Update CLERK_DOMAIN in wrangler-portal.toml
5. [ ] Redeploy portal worker: `wrangler deploy -c wrangler-portal.toml`
