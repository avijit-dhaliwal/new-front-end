# Agent 3 — Knowledge + Flow Engine
- Added `types/knowledge.ts` defining canonical entities and API shapes for knowledge sources, documents, versions, chunks, policies/citations, and flow/step/rule/test/run contracts.
- Added knowledge + flow schema seeds and indexes in `cloudflare-workers/portal-schema.sql` plus demo data for CHADIS/Pannu Dental.
- Implemented real knowledge + flow endpoints in `cloudflare-workers/portal-worker.js` (list/create knowledge sources/documents, list/create/detail flows, add flow tests) and replaced workflows placeholder with live flow data.
- Next: align types with Agent 1’s schema freeze and portal-worker responses, then wire portal/worker endpoints and mocks so UI can render knowledge + flow states.
## Agent 2 — Portal UX + Site Packaging
- Added Outcomes navigation + dashboard section with cards/empty-state copy so flows can surface results once actions land.
- Added Integrations section and nav anchor with status badges + sync notes to reflect connector health.
- Extended portal config/types to include the new Outcomes module and integration/outcome types; settings picker now knows about Outcomes.
- Wired portal dashboard to fetch/render Knowledge + Flow data contracts (sources, documents, flow tests/runs) with StatusPill UI for connection health, action-run badges, and flow test results; keeps safe fallbacks until Agent 3 endpoints return data.
## Agent 4 (Actions/Integrations/Observability/Billing)

- Added D1 contract for actions, runs, DLQ, integrations, webhook events, audit logs, outcomes, billing ledger, and retention policies in `cloudflare-workers/portal-schema.sql`.
- Stubbed portal worker endpoints for registering actions, enqueueing runs with idempotency, ingesting webhooks, listing outcomes, and billing usage; responses now emit camelCase payloads aligned to the new types.
- Expanded portal UI to surface outcome events and billing ledger placeholders fed by the new endpoints (with safe mock fallbacks when the worker URL is unset).
- Replaced portal worker stubs with real D1-backed queries for integrations, outcomes, billing, audit logs, and retention policies; added CRUD for integrations, action run lifecycle updates, and enriched /portal/events to include action/outcome activity.

Status: v2 — endpoints now return real D1 data for integrations/outcomes/billing/audit/retention and action run updates can emit outcomes; UI consumes new event types. Next: wire executor/connector health + seed data.

## Agent 1 — Platform Core & Contract (v2)
- Added knowledge + flow tables (sources, documents, versions, chunks, policies, flows, steps, rules, tests, runs) with indexes and demo seeds to `cloudflare-workers/portal-schema.sql`.
- Updated portal_config defaults/seeds to include knowledge/integrations/outcomes modules; documented canonical contract in `DOCUMENTATION.md`.
## Agent 1 — Platform Core & Contract
- Extended `types/portal.ts` with canonical portal modules, branding fields, integrations response, and the event model to mirror the D1 contract.
- Portal worker now returns normalized portal_config, exposes /portal/events, /portal/integrations, /outcomes, and /billing/usage with org scoping.
- Portal dashboard wiring fetches worker overview/engines/insights/events/integrations/outcomes/billing and renders events + integration status; settings page now reads/saves portal_config via worker with Clerk auth fallback to presets.
