# Koby AI Production Runbook

This runbook covers deployment, monitoring, and operations for the Koby AI platform running on Cloudflare (Workers + D1 + Pages).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Variables Matrix](#environment-variables-matrix)
4. [Deployment Procedures](#deployment-procedures)
5. [D1 Database Operations](#d1-database-operations)
6. [Rollback Procedures](#rollback-procedures)
7. [Monitoring & Alerting](#monitoring--alerting)
8. [Incident Response](#incident-response)
9. [Security Checklist](#security-checklist)

---

## Architecture Overview

```
                    ┌─────────────────────────────────────────┐
                    │          Cloudflare Edge                │
                    └─────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
    ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
    │ Vercel/Pages  │       │ Portal Worker │       │  Chat Worker  │
    │  (Next.js)    │       │  (API + Auth) │       │ (AI + Logging)│
    │ koby.ai       │       │ /portal/*     │       │ /chat         │
    └───────────────┘       └───────────────┘       └───────────────┘
            │                         │                         │
            │                         ▼                         │
            │               ┌───────────────┐                   │
            └──────────────▶│  D1 Database  │◀──────────────────┘
                            │koby-portal-db │
                            └───────────────┘
                                      │
                            ┌─────────┴─────────┐
                            │                   │
                            ▼                   ▼
                    ┌───────────────┐   ┌───────────────┐
                    │ Clerk Auth    │   │ Stripe Billing│
                    │ (JWT verify)  │   │ (Webhooks)    │
                    └───────────────┘   └───────────────┘
```

### Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| Frontend | Main website + Portal UI | Next.js on Vercel |
| Portal Worker | API endpoints, JWT auth | Cloudflare Worker |
| Chat Worker | AI chat API, site_key auth | Cloudflare Worker |
| Voice Worker | Voice synthesis | Cloudflare Worker |
| D1 Database | Persistent storage | Cloudflare D1 (SQLite) |

---

## Pre-Deployment Checklist

### Before Any Deployment

- [ ] All tests pass locally (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No secrets in codebase (grep for API keys)
- [ ] Schema migrations reviewed (if any)
- [ ] Rollback plan documented

### Before Production Deployment

- [ ] Changes tested in staging environment
- [ ] Database backup created
- [ ] Stakeholders notified
- [ ] Monitoring dashboards open
- [ ] On-call engineer available

---

## Environment Variables Matrix

### Vercel/Next.js (Frontend)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk frontend key |
| `CLERK_SECRET_KEY` | Yes | Clerk backend key |
| `NEXT_PUBLIC_PORTAL_WORKER_URL` | Yes | Portal worker endpoint |
| `GEMINI_API_KEY` | Yes | For demo chat proxy |
| `ELEVENLABS_API_KEY` | Yes | For voice demos |

### Portal Worker (Cloudflare)

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `CLERK_DOMAIN` | vars | Yes | Clerk domain for JWT verification |
| `ENVIRONMENT` | vars | No | `production` or `development` |
| `LOG_LEVEL` | vars | No | `debug`, `info`, `warn`, `error` |
| `ALLOWED_ORIGINS` | vars | No | Comma-separated CORS origins |
| `CORS_ALLOW_ALL` | vars | No | `true` for dev only |
| `PORTAL_RATE_LIMIT_MAX` | vars | No | Requests per minute per IP (default: 120) |
| `CLERK_SECRET_KEY` | secret | No | For backend operations |
| `STRIPE_SECRET_KEY` | secret | Yes | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | secret | Yes | Stripe webhook signing secret |

### Setting Secrets

```bash
# Portal Worker
wrangler secret put STRIPE_SECRET_KEY --name koby-portal
wrangler secret put STRIPE_WEBHOOK_SECRET --name koby-portal
wrangler secret put CLERK_SECRET_KEY --name koby-portal

# Chat Worker
wrangler secret put GEMINI_API_KEY --name chadis-chat
```

---

## Deployment Procedures

### Deploy Portal Worker

```bash
cd cloudflare-workers

# 1. Deploy to staging first (if configured)
# wrangler deploy --config wrangler-portal-staging.toml

# 2. Deploy to production
wrangler deploy --config wrangler-portal.toml

# 3. Verify deployment
curl https://koby-portal.<account>.workers.dev/health
```

### Deploy Chat Worker

```bash
cd cloudflare-workers
wrangler deploy --config wrangler-chat.toml
```

### Deploy Frontend (Next.js)

```bash
# Vercel handles this automatically on git push to main
# For manual deployment:
vercel --prod
```

### Deploy All Workers

```bash
cd cloudflare-workers

# Deploy all in order
wrangler deploy --config wrangler-portal.toml && \
wrangler deploy --config wrangler-chat.toml && \
wrangler deploy --config wrangler-voice.toml

echo "All workers deployed successfully"
```

---

## D1 Database Operations

### Create Database (First Time)

```bash
cd cloudflare-workers

# Create the database
wrangler d1 create koby-portal-db

# Note the database_id and update wrangler-portal.toml
```

### Apply Schema Migrations

```bash
cd cloudflare-workers

# Apply schema (additive migrations only)
wrangler d1 execute koby-portal-db --file=./portal-schema.sql

# For specific migrations
wrangler d1 execute koby-portal-db --file=./migrations/001_add_billing.sql
```

### Query Database

```bash
# List all orgs
wrangler d1 execute koby-portal-db --command "SELECT * FROM orgs"

# View recent sessions
wrangler d1 execute koby-portal-db --command "SELECT * FROM chat_sessions ORDER BY started_at DESC LIMIT 10"

# Check billing customers
wrangler d1 execute koby-portal-db --command "SELECT * FROM billing_customers"
```

### Backup Database

```bash
# Export full database
wrangler d1 export koby-portal-db --output=backup_$(date +%Y%m%d_%H%M%S).sql

# Store backup securely (not in git)
```

### Database Migration Best Practices

1. **Always additive**: Add columns/tables, never drop in production
2. **Default values**: New columns must have defaults or be nullable
3. **Test migrations**: Run on staging first
4. **Backup before**: Always backup before migrations
5. **Rollback plan**: Document how to undo each migration

---

## Rollback Procedures

### Rollback Worker Deployment

```bash
# 1. List recent deployments
wrangler deployments list --name koby-portal

# 2. Rollback to previous version
wrangler rollback --name koby-portal

# 3. Verify rollback
curl https://koby-portal.<account>.workers.dev/health
```

### Rollback Database Changes

For **additive changes** (new tables/columns):
- Usually safe to leave in place, old code will ignore them

For **destructive changes** (column modifications):
```bash
# Restore from backup
wrangler d1 execute koby-portal-db --file=backup_YYYYMMDD_HHMMSS.sql
```

### Emergency Procedures

1. **Worker Down**: Rollback to last known good deployment
2. **Database Corrupted**: Restore from backup
3. **Auth Issues**: Check Clerk dashboard status
4. **Billing Issues**: Check Stripe dashboard, pause webhooks if needed

---

## Monitoring & Alerting

### Cloudflare Dashboard

1. **Workers Metrics**
   - Dashboard > Workers & Pages > Select Worker
   - View: Requests, Errors, CPU Time, Duration

2. **D1 Metrics**
   - Dashboard > D1 > koby-portal-db
   - View: Queries, Rows read/written, Storage

### Structured Logs

Portal worker emits structured JSON logs for Cloudflare Logpush:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "requestId": "req_abc123",
  "message": "request_start",
  "method": "GET",
  "path": "/portal/overview",
  "userId": "user_xyz",
  "orgId": "org_123"
}
```

### Key Events to Monitor

| Event | Level | Action Required |
|-------|-------|-----------------|
| `auth_failed` | warn | Multiple = possible attack |
| `rate_limit_exceeded` | warn | May need cap adjustment |
| `internal_error` | error | Investigate immediately |
| `stripe_webhook_failed` | error | Check Stripe dashboard |
| `request_too_large` | warn | Review client behavior |

### Setting Up Logpush

1. Cloudflare Dashboard > Workers & Pages > Select Worker
2. Settings > Logpush
3. Configure destination (R2, S3, Datadog, etc.)
4. Filter for error/warn levels in production

### Real-time Logs

```bash
# Tail worker logs in real-time
wrangler tail --config wrangler-portal.toml

# Filter for errors only
wrangler tail --config wrangler-portal.toml --search "error"
```

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Complete outage, billing broken | Immediate |
| P2 | Partial outage, degraded service | 1 hour |
| P3 | Minor issues, workarounds exist | 4 hours |
| P4 | Cosmetic, no user impact | Next sprint |

### Incident Playbook

1. **Acknowledge**: Confirm issue, notify team
2. **Assess**: Determine scope and severity
3. **Communicate**: Update stakeholders
4. **Mitigate**: Implement fix or rollback
5. **Resolve**: Verify fix, close incident
6. **Post-mortem**: Document and learn

### Quick Checks

```bash
# 1. Check worker health
curl https://koby-portal.<account>.workers.dev/health

# 2. Check D1 connectivity
wrangler d1 execute koby-portal-db --command "SELECT 1"

# 3. View recent errors
wrangler tail --config wrangler-portal.toml --search "error" --format pretty

# 4. Check Stripe webhook status
# Go to: https://dashboard.stripe.com/webhooks
```

---

## Security Checklist

### Pre-Production

- [ ] No API keys in codebase
- [ ] CORS restricted to production domains
- [ ] Rate limiting enabled
- [ ] Request size limits in place
- [ ] Stripe webhook signature verification enabled
- [ ] JWT verification for all portal routes
- [ ] Staff-only endpoints properly restricted

### Ongoing

- [ ] Rotate secrets quarterly
- [ ] Review audit logs weekly
- [ ] Monitor for unusual patterns
- [ ] Keep dependencies updated
- [ ] Review Cloudflare security settings

### Secret Rotation

```bash
# 1. Generate new secret in provider (Stripe, Clerk)
# 2. Update worker secret
wrangler secret put STRIPE_SECRET_KEY --name koby-portal
# 3. Verify functionality
# 4. Revoke old secret in provider
```

---

## Quick Reference

### Common Commands

```bash
# Deploy portal worker
wrangler deploy --config wrangler-portal.toml

# View logs
wrangler tail --config wrangler-portal.toml

# Query database
wrangler d1 execute koby-portal-db --command "SELECT * FROM orgs"

# Set secret
wrangler secret put SECRET_NAME --name koby-portal

# Rollback
wrangler rollback --name koby-portal

# Export database
wrangler d1 export koby-portal-db --output=backup.sql
```

### Important URLs

| Service | URL |
|---------|-----|
| Cloudflare Dashboard | https://dash.cloudflare.com |
| Clerk Dashboard | https://dashboard.clerk.com |
| Stripe Dashboard | https://dashboard.stripe.com |
| Vercel Dashboard | https://vercel.com/dashboard |

### Emergency Contacts

| Role | Responsibility |
|------|----------------|
| Platform Lead | Overall system health |
| Backend Lead | Workers & D1 issues |
| Frontend Lead | Next.js & Vercel issues |
| Security Lead | Auth & billing issues |

---

*Last updated: 2025-12-26*
*Version: 1.0*
