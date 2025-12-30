Below is a **single “agent-only implementation file”** you can drop into your repo as-is (Markdown). It tells an engineer/agent exactly what to build: **Cloudflare Workers + D1 + Wrangler**, **/midvalley demo page that matches KobyAI site style**, **widget embed**, **ticket intake webhook**, and **post-call transcript ingest via ElevenLabs post-call webhooks (with HMAC verification)**.

---

````md
# Mid Valley Demo — Implementation Spec (Agent-Only)
Owner: KobyAI  
URL: https://kobyai.com/midvalley  
ElevenLabs Widget Agent ID: agent_0501kdrbgz2yecq81zx93sv6tkaw

## Goal
Ship a polished demo page that:
1) Lets Mid Valley run a “Missed Collection” intake call via the ElevenLabs widget.
2) Writes structured intake data (the form fields) to Cloudflare D1 via a Cloudflare Worker endpoint (called by the ElevenLabs “create_missed_collection_ticket” tool).
3) Ingests **post-call** transcript + metadata + analysis from ElevenLabs post-call webhooks into D1 (workspace-level webhook), verified by HMAC signature.
4) Displays a **live log table** on the demo page:
   - structured form fields (name/address/missed items/gating answers)
   - ticket_id
   - transcript + summary
   - call metrics (duration/cost/termination_reason where available)
   - tool call results if present

## Source-of-truth behaviors (ElevenLabs)
- Widget supports runtime attributes including `dynamic-variables='{"key":"value"}'` and UI text customizations.  
- Post-call transcription webhooks deliver payload type `post_call_transcription` with `data.agent_id`, `data.conversation_id`, `data.transcript[]`, `data.metadata`, `data.analysis`, and `data.conversation_initiation_client_data.dynamic_variables`.  
- Webhooks are authenticated by an `ElevenLabs-Signature` header: `t=timestamp,v0=hash`, where hash = HMAC-SHA256(secret, `${timestamp}.${raw_body}`).

(Refs: ElevenLabs Widget attributes + dynamic variables; Post-call webhooks + signature format.)

---

## Architecture Overview

### Frontend (existing marketing site)
- Add a route/page at `/midvalley`.
- Design must match existing KobyAI site style (see current homepage look).
- Embed the ElevenLabs widget on the page.
- Generate a per-visitor `demo_session_id` and pass it to the widget via `dynamic-variables`.
- Poll backend every 2–5s to render “Live Intake Log” for the current session.  
  Optionally support admin view to show all sessions.

### Backend (Cloudflare Worker)
Create a Worker that exposes:
1) `POST /api/midvalley/missed-collection`  
   - Called by ElevenLabs tool `create_missed_collection_ticket` during the call.
   - Auth via `Authorization: Bearer <token>` (simple shared token).
   - Writes `missed_collection_requests` row (structured fields + raw JSON).
   - Returns `{ ticket_id, created_at, normalized_payload }`.

2) `POST /api/midvalley/elevenlabs/postcall`  
   - Called by ElevenLabs post-call webhook (workspace-level).  
   - Verify `ElevenLabs-Signature` HMAC.
   - Filter to only store events where `data.agent_id === agent_0501kdrbgz2yecq81zx93sv6tkaw`.
   - Extract `demo_session_id` from `data.conversation_initiation_client_data.dynamic_variables.demo_session_id` if present.
   - Store transcript, summary, call metadata, tool usage fields (if present), and raw payload.

3) `GET /api/midvalley/session/:demo_session_id`  
   - Returns joined view of “request rows + call rows” for this session.

4) (Optional admin) `GET /api/midvalley/recent?limit=100`  
   - Returns recent sessions across all users (guarded by `X-Admin-Key` or similar).

### Data store (Cloudflare D1)
Use D1 with migrations.

---

## D1 Schema (SQL migration)

Create `migrations/001_init.sql`:

```sql
-- Requests created by the agent tool call (structured form)
CREATE TABLE IF NOT EXISTS missed_collection_requests (
  id TEXT PRIMARY KEY,                       -- ticket_id UUID
  demo_session_id TEXT,
  conversation_id TEXT,                      -- if we have it (optional)
  created_at TEXT NOT NULL,

  contact_first_name TEXT NOT NULL,
  contact_last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  account_name TEXT,
  account_number TEXT,

  service_street_1 TEXT NOT NULL,
  service_street_2 TEXT,
  service_city TEXT NOT NULL,
  service_state TEXT NOT NULL,
  service_zip TEXT NOT NULL,

  service_day TEXT NOT NULL,

  non_collection_tag_present INTEGER NOT NULL,
  container_out_by_6am INTEGER NOT NULL,
  lids_closed INTEGER NOT NULL,

  cart_trash INTEGER NOT NULL,
  cart_recycle INTEGER NOT NULL,
  cart_organics INTEGER NOT NULL,
  bin_trash INTEGER NOT NULL,
  bin_recycle INTEGER NOT NULL,
  bin_organics INTEGER NOT NULL,

  job_order_confirmation_preference TEXT NOT NULL,
  additional_comments TEXT,

  raw_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_missed_collection_demo_session
  ON missed_collection_requests(demo_session_id);

-- Post-call webhook payloads (transcripts + metadata + analysis)
CREATE TABLE IF NOT EXISTS elevenlabs_calls (
  conversation_id TEXT PRIMARY KEY,          -- stable key from webhook
  agent_id TEXT NOT NULL,
  demo_session_id TEXT,
  created_at TEXT NOT NULL,                  -- when stored

  status TEXT,
  user_id TEXT,

  call_start_time_unix INTEGER,
  call_duration_secs INTEGER,
  cost INTEGER,
  termination_reason TEXT,

  call_successful TEXT,                      -- from analysis.call_successful
  transcript_summary TEXT,                   -- from analysis.transcript_summary

  transcript_json TEXT NOT NULL,             -- full transcript array
  metadata_json TEXT,                        -- full metadata object
  analysis_json TEXT,                        -- full analysis object
  initiation_client_data_json TEXT,          -- conversation_initiation_client_data

  raw_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calls_demo_session
  ON elevenlabs_calls(demo_session_id);
````

Notes:

* Store JSON as TEXT for speed; parse on read.
* Keep both structured columns (for UI table) + raw_json (for future-proofing).

---

## Wrangler + Worker Setup

### 1) Create D1 DB

```bash
wrangler d1 create koby_midvalley_demo
```

### 2) Apply migration

```bash
wrangler d1 execute koby_midvalley_demo --file=./migrations/001_init.sql
```

### 3) Worker project

If this repo already has a Worker, extend it. Otherwise:

```bash
wrangler init midvalley-demo-worker --type=typescript
```

### 4) wrangler.toml

Add (example; adapt to your repo):

```toml
name = "koby-midvalley-demo"
main = "src/worker.ts"
compatibility_date = "2025-12-30"

[[d1_databases]]
binding = "DB"
database_name = "koby_midvalley_demo"
database_id = "<PASTE_FROM_WRANGLER_OUTPUT>"

[vars]
MIDVALLEY_AGENT_ID = "agent_0501kdrbgz2yecq81zx93sv6tkaw"
```

### 5) Secrets

Set secrets (do NOT commit):

```bash
# Used by the ElevenLabs tool call to your /missed-collection endpoint
wrangler secret put TOOL_AUTH_BEARER

# Used to validate ElevenLabs post-call webhook signatures
wrangler secret put ELEVENLABS_WEBHOOK_SECRET

# Optional: allow admin to view all sessions
wrangler secret put MIDVALLEY_ADMIN_KEY
```

Expected values:

* TOOL_AUTH_BEARER: the token part only OR full `Bearer ...` depending on your compare logic (choose one and be consistent).
* ELEVENLABS_WEBHOOK_SECRET: the shared secret generated when you create the ElevenLabs webhook (HMAC).
* MIDVALLEY_ADMIN_KEY: random string.

### 6) Deploy

```bash
wrangler deploy
```

### 7) Route mapping (Cloudflare dashboard)

Map your worker to:

* `/api/midvalley/*`

So the marketing site continues to serve `/midvalley`, and it calls same-origin APIs under `/api/midvalley/...` (no CORS needed).

---

## Worker Implementation Details (src/worker.ts)

### Endpoints

#### POST /api/midvalley/missed-collection

* Verify Authorization header:

  * Expect `Authorization: Bearer <token>` EXACT match, OR parse bearer.
* Parse JSON body (the form fields).
* Validate:

  * required fields present
  * email sanity
  * zip is 5 digits
  * service_day in Mon–Fri
  * at least one of the missed-item booleans is true
* Normalize:

  * phone -> digits (store canonical)
  * zip -> 5 digits
* Insert row into `missed_collection_requests`.
* Return `{ ticket_id, created_at, normalized_payload }`.

Also store `demo_session_id` if provided in payload.

#### POST /api/midvalley/elevenlabs/postcall

* Read raw body bytes (important: signature is over raw bytes).
* Verify HMAC signature:

  * Header: `ElevenLabs-Signature` (case-insensitive)
  * Format: `t=timestamp,v0=hash`
  * Compute `expected = "v0=" + hmac_sha256_hex(secret, `${timestamp}.${raw_body_string}`)`
  * Reject if:

    * missing header
    * timestamp older than 30 minutes (tolerance)
    * hash mismatch
* Parse JSON payload.
* Only handle `type === "post_call_transcription"`.
* Filter to `data.agent_id === MIDVALLEY_AGENT_ID`. (Workspace webhook may deliver other agents.)
* Extract:

  * conversation_id
  * transcript array
  * metadata (duration/cost/termination_reason etc)
  * analysis (call_successful, transcript_summary, evaluation criteria, data_collection_results)
  * conversation_initiation_client_data.dynamic_variables.demo_session_id
* Upsert into `elevenlabs_calls` keyed by conversation_id.
* Return 200 quickly.

#### GET /api/midvalley/session/:demo_session_id

Return JSON:

```json
{
  "demo_session_id": "...",
  "requests": [ ... ],
  "calls": [ ... ],
  "joined": [ ... ] // optional pre-joined rows for the UI
}
```

Implementation suggestion:

* Query `missed_collection_requests` where demo_session_id = ?
* Query `elevenlabs_calls` where demo_session_id = ?
* Join in Worker (fast enough at demo scale).

#### Optional: GET /api/midvalley/recent?limit=100

* Require `X-Admin-Key: <MIDVALLEY_ADMIN_KEY>`
* Return recent calls/requests across all demo_session_id.

---

## Frontend Page (/midvalley) — Design + UX Spec

### Visual style requirements

Match existing KobyAI homepage:

* Warm off-white / beige background
* Subtle grid texture
* Orange accent buttons
* Bold black headline typography
* Rounded “card” containers with thin borders + soft shadow
* Right-side “System Snapshot”-style card sections

### Layout

Two-column responsive layout:

Left column:

* Title: “Mid Valley Disposal — Missed Collection Demo”
* 1–2 sentence explanation (what it does)
* The widget embedded in a card:

  * Keep it visually aligned with existing UI cards.

Right column:

* “Live Intake Log” card (table)
* Above table: small “Session: <short-id>” + “Refresh” button
* Table columns (minimum):

  * Time
  * Name
  * Address (short)
  * Missed items (badges)
  * Service day
  * Tag left / Out by 6am / Lids closed
  * Confirmation (email/text)
  * Ticket ID
  * Transcript (button opens modal)
  * Call metrics (duration, cost) if available
  * Status (submitted / call complete / etc)

Modal / Drawer:

* Full transcript (speaker-separated)
* Transcript summary
* Raw JSON accordion (for “look how clean the data is”)

### Privacy / demo-safe default

Default view should show ONLY the current visitor’s session:

* The table queries `GET /api/midvalley/session/:demo_session_id`.
* Add an “Admin view” hidden behind `?admin=1` and `X-Admin-Key` or prompt.

### Widget embed (must use this base)

Embed exactly this (provided), but add IDs/attrs:

```html
<elevenlabs-convai
  id="midvalley-widget"
  agent-id="agent_0501kdrbgz2yecq81zx93sv6tkaw"
  action-text="Report a missed pickup"
  start-call-text="Call the missed pickup line"
  end-call-text="End call"
></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

### Add `demo_session_id` via dynamic variables

On page load:

* `demo_session_id = crypto.randomUUID()`
* store it in `sessionStorage`
* set widget attribute `dynamic-variables` to include it:

```js
const demoSessionId = sessionStorage.getItem("demo_session_id") ?? crypto.randomUUID();
sessionStorage.setItem("demo_session_id", demoSessionId);

const el = document.getElementById("midvalley-widget");
el.setAttribute("dynamic-variables", JSON.stringify({
  demo_session_id: demoSessionId,
  demo_source: "kobyai.com/midvalley"
}));
```

This ensures:

* The tool call payload can include demo_session_id.
* The post-call webhook payload includes the same demo_session_id under `conversation_initiation_client_data.dynamic_variables`.

### Polling the log table

* Poll every 2–5 seconds:

  * `GET /api/midvalley/session/${demo_session_id}`
* Render:

  * If a request exists but no call yet → “Waiting for post-call transcript…”
  * When post-call arrives → show transcript + metrics.

---

## ElevenLabs Console Configuration Checklist (Non-code)

1. Agent is Public + Allowlist includes:

   * `kobyai.com`
   * `www.kobyai.com` (if used)
   * `localhost` for dev

2. Tool `create_missed_collection_ticket` points to:

   * `https://kobyai.com/api/midvalley/missed-collection`
   * Header `Authorization` is set to secret containing `Bearer <token>`

3. Post-call webhook:

   * Create a webhook (workspace settings) for `post_call_transcription`
   * URL: `https://kobyai.com/api/midvalley/elevenlabs/postcall`
   * Enable HMAC; store the shared secret in `ELEVENLABS_WEBHOOK_SECRET`
   * Ensure your handler returns 200 quickly or webhook can be auto-disabled after failures.

---

## Demo “Wow” Items to Show Mid Valley (What to display)

### A) Operationally relevant

* Exactly which container stream was missed (Cart/Bin + Trash/Recycling/Organics)
* Address + contact
* “Non-collection tag?” + “Out by 6am?” + “Lids closed?”
* Confirmation preference (email/text)
* Ticket ID returned immediately after tool call

### B) Proof it’s enterprise-grade

From post-call payload (when available):

* Call duration seconds
* Cost (if provided)
* Termination reason
* Transcript summary (auto)
* Full transcript turns (agent/user) including tool_calls/tool_results if present

### C) “Audit trail”

* Show raw JSON payload (collapsed)
* Show timestamps: ticket_created_at vs webhook_event_timestamp
* Show conversation_id (internal) to prove traceability

---

## Acceptance Criteria

* Visiting [https://kobyai.com/midvalley](https://kobyai.com/midvalley) shows a page visually consistent with KobyAI site.
* Widget loads and can complete an intake conversation.
* Tool call results in a new row in D1 with all required structured fields.
* Post-call webhook arrives and is stored; transcript + summary appear in the UI.
* HMAC verification is enforced for post-call webhook (reject unsigned/invalid).
* Default view shows only the current session; optional admin view exists.

---

## Implementation Notes / Edge Cases

* Post-call webhooks are workspace-level: you MUST filter by agent_id.
* Don’t assume payload shape is frozen; store raw_json and parse defensively (handle additional fields).
* Tool call may happen before post-call arrives; UI should handle “ticket created, transcript pending”.
* If a call ends without a tool call, UI should still show transcript (status: “No ticket created”).

```

---

If you want, I can also produce a **second file** that’s just the **Worker code skeleton** (`src/worker.ts`) + **Next.js page skeleton** (`/app/midvalley/page.tsx`) in one paste, but the doc above is the “do everything required” blueprint your implementer can follow immediately.
::contentReference[oaicite:0]{index=0}
```


webhook secret = wsec_9f906531d54d94af0383f2abe82b4961a0da02e89f7678b32c65906df224ce7a