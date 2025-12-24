# Koby AI Cloudflare Workers Deployment

## Overview

This directory contains Cloudflare Workers for the Koby AI platform:

- **portal-worker.js** - Portal API for client dashboards with Clerk JWT auth
- **chadis-chat-worker.js** - Chat API with site_key auth and D1 logging
- **chadis-voice-worker.js** - Voice synthesis API

## Prerequisites

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare (KobyAI account):
```bash
wrangler login
```

---

## Portal Worker Setup (New)

### 1. Create D1 Database

```bash
cd cloudflare-workers
wrangler d1 create koby-portal-db
```

Copy the `database_id` from the output and update:
- `wrangler-portal.toml` → `database_id`
- `wrangler-chat.toml` → `database_id` (if using shared logging)

### 2. Apply Database Schema

```bash
wrangler d1 execute koby-portal-db --file=./portal-schema.sql
```

This creates all tables and seeds two sample customers (CHADIS and Pannu Dental).

### 3. Set Secrets

```bash
# Clerk domain for JWT verification
wrangler secret put CLERK_DOMAIN --name koby-portal
# Enter: your-clerk-domain.clerk.accounts.dev

# Optional: Clerk secret key
wrangler secret put CLERK_SECRET_KEY --name koby-portal
```

### 4. Deploy Portal Worker

```bash
wrangler deploy --config wrangler-portal.toml
```

### 5. Portal API Endpoints

All endpoints require `Authorization: Bearer <clerk_jwt>` header.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/portal/overview` | Dashboard stats | Org member |
| GET | `/portal/engines` | AI sites/bots list | Org member |
| GET | `/portal/workflows` | Automation workflows | Org member |
| GET | `/portal/insights` | Analytics data | Org member |
| GET | `/portal/team` | Team info | Org member |
| GET | `/portal/clients` | All clients list | Koby staff only |
| GET | `/portal/config` | Org config | Org member |
| PATCH | `/portal/config` | Update config | Org admin or staff |

Staff users can add `?orgId=xxx` to access any org's data.

---

## Chat Worker Setup

### 1. Update D1 Binding (Optional)

If you want site_key authentication and session logging, update the `database_id` in `wrangler-chat.toml`.

### 2. Set Secrets

```bash
wrangler secret put GEMINI_API_KEY --name chadis-chat
```

### 3. Deploy

```bash
wrangler deploy --config wrangler-chat.toml
```

### 4. Chat API Usage

**Without site_key** (legacy mode):
```bash
curl -X POST https://chadis-chat.kobyai.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message": "What is CHADIS?"}'
```

**With site_key** (authenticated + logged):
```bash
curl -X POST https://chadis-chat.kobyai.workers.dev \
  -H "Content-Type: application/json" \
  -H "X-Site-Key: sk_chadis_live_abc123" \
  -d '{"message": "What is CHADIS?", "visitor_id": "user123"}'
```

Response includes `session_id` for conversation continuity:
```json
{
  "response": "CHADIS is...",
  "session_id": "uuid-here",
  "latency_ms": 1234
}
```

---

## Voice Worker Setup

### 1. Set Secrets

```bash
wrangler secret put ELEVENLABS_API_KEY --name chadis-voice
```

### 2. Deploy

```bash
wrangler deploy --config wrangler-voice.toml
```

### 3. Test

```bash
curl -X POST https://chadis-voice.kobyai.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test."}'
```

---

## Database Management

### View Data

```bash
# List all orgs
wrangler d1 execute koby-portal-db --command "SELECT * FROM orgs"

# View recent sessions
wrangler d1 execute koby-portal-db --command "SELECT * FROM chat_sessions ORDER BY started_at DESC LIMIT 10"

# View daily metrics
wrangler d1 execute koby-portal-db --command "SELECT * FROM metrics_daily ORDER BY date DESC LIMIT 10"
```

### Add a New Client

```bash
wrangler d1 execute koby-portal-db --command "INSERT INTO orgs (id, name, slug, plan) VALUES ('org_newclient', 'New Client', 'new-client', 'chatbot')"

wrangler d1 execute koby-portal-db --command "INSERT INTO portal_sites (id, org_id, site_key, name, type) VALUES ('site_newclient', 'org_newclient', 'sk_newclient_live_xxx', 'Main Chatbot', 'chatbot')"
```

### Create Site Key

Site keys follow the format: `sk_{client}_{env}_{random}`
- env: `live`, `test`, `dev`
- random: alphanumeric string

---

## Monitoring

Access logs and analytics at:
- [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
- Navigate to Workers & Pages → Your Workers
- View real-time metrics and logs

### D1 Dashboard

View database metrics and run queries:
- Dashboard → D1 → koby-portal-db

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Portal (Next)  │────▶│  portal-worker  │
│  /portal/*      │     │  JWT + D1       │
└─────────────────┘     └────────┬────────┘
                                 │
┌─────────────────┐     ┌────────▼────────┐
│  Chat Widget    │────▶│   chat-worker   │
│  site_key auth  │     │  Gemini + D1    │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   D1 Database   │
                        │ koby-portal-db  │
                        └─────────────────┘
```

---

## Troubleshooting

### JWT Verification Fails
- Ensure CLERK_DOMAIN secret is set correctly
- Check token hasn't expired
- Verify org membership in Clerk dashboard

### Site Key Not Found
- Check site_key exists in portal_sites table
- Verify site status is 'active'
- Ensure org is not 'churned' or 'inactive'

### D1 Connection Errors
- Verify database_id is correct in wrangler.toml
- Check D1 binding name matches code (should be `DB`)
- Run `wrangler d1 info koby-portal-db` to verify

### High Latency
- Check Gemini API response times
- Consider caching common responses
- Review D1 query efficiency
