# Agent 3 — Knowledge + Flow Engine (Security/Compliance/Observability)
- Knowledge + flow contract is live (`types/knowledge.ts`) with seeded D1 tables and demo data in `cloudflare-workers/portal-schema.sql`.
- Portal worker now serves real knowledge/flow APIs (list/create sources, documents, flows, flow tests; flow detail) instead of placeholders.
- Security/compliance guardrails added: per-IP rate limiting, audit log listing, retention policy CRUD; compliance types added to `types/portal.ts`.
- Next: enforce retention/redaction jobs, add structured logs/metrics, and wire portal UI to knowledge/flow/compliance endpoints.
## Agent 2 — Portal UX + Site Packaging
- Finished: Built `knowledge-ingestion-worker.js` + `wrangler-knowledge.toml` to process pending `knowledge_ingestion_jobs`, create versions/chunks/embeddings, set `live_version_id`, and mark jobs succeeded/failed.
- Finished: Upgraded `/portal/knowledge/retrieve` to embeddings-based cosine scoring with LIKE fallback; responses now include ranked citations/scores.
- Updated docs: Added knowledge ingestion worker + retrieval changes to `DOCUMENTATION.md`.
## Agent 4 (Actions/Integrations/Observability/Billing)

- D1 + worker: live queries for integrations, outcomes, billing, audit logs, retention policies; CRUD for integrations; action run lifecycle updates can emit outcomes; /portal/events includes action/outcome activity.
- Portal UI: renders integration connection health, action run history, audit logs, retention policies, and outcome/billing data from worker (no mock fallbacks).
- Status v2.2 — data-backed UI and endpoints aligned; next up: executor/connector health wiring and seeding realistic rows.
- Security pass: added admin RBAC checks to integration/retention mutations and PII redaction for event content; strengthened org safety before write paths.

## Agent 1 — Knowledge Ingestion & Retrieval (current)
- Extended knowledge schema with ingestion jobs, embeddings, version stage/is_live, and document live_version_id; added seeds and indexes in `cloudflare-workers/portal-schema.sql`.
- Added `/portal/knowledge/retrieve` and job exposure in `/portal/knowledge`; mapped version stage/live flags in responses. Updated `types/knowledge.ts` and `DOCUMENTATION.md` accordingly.
- Added flow runtime trigger endpoint `/portal/flows/:id/run` (creates flow_runs, action_runs link) and linked outcome event; action_runs now store flow_run_id. Documented in `DOCUMENTATION.md`.
