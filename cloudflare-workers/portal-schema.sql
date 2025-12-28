-- Portal Database Schema for Koby AI
-- D1 SQLite Database

-- Organizations (managed in D1, not Clerk)
CREATE TABLE IF NOT EXISTS orgs (
  id TEXT PRIMARY KEY,
  clerk_org_id TEXT UNIQUE,  -- Optional: for backwards compatibility
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'at_risk', 'churned')),
  plan TEXT DEFAULT 'chatbot' CHECK(plan IN ('chatbot', 'phone', 'bundle', 'enterprise')),
  max_members INTEGER DEFAULT 10,  -- Membership cap per org, Koby staff can override
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Users (linked to Clerk user IDs)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  is_koby_staff INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- User memberships (links users to orgs with roles)
CREATE TABLE IF NOT EXISTS user_memberships (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(clerk_user_id, org_id)
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_memberships_clerk_user ON user_memberships(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_org ON user_memberships(org_id);

-- Portal sites (each org can have multiple chatbot/voice deployments)
CREATE TABLE IF NOT EXISTS portal_sites (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  site_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'chatbot' CHECK(type IN ('chatbot', 'voice', 'automation')),
  domain TEXT,
  google_api_key TEXT,
  elevenlabs_api_key TEXT,
  system_prompt TEXT,
  config JSON DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'paused')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Chat sessions (one per conversation)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES portal_sites(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  visitor_id TEXT,
  started_at TEXT DEFAULT (datetime('now')),
  ended_at TEXT,
  message_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'abandoned')),
  metadata JSON DEFAULT '{}'
);

-- Chat messages (individual messages within sessions)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  site_id TEXT NOT NULL REFERENCES portal_sites(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  latency_ms INTEGER,
  tokens_used INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Daily metrics (aggregated stats per org/site)
CREATE TABLE IF NOT EXISTS metrics_daily (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES portal_sites(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  avg_latency_ms REAL DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  leads_captured INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(org_id, site_id, date)
);

-- Portal config (per-org customization)
CREATE TABLE IF NOT EXISTS portal_config (
  id TEXT PRIMARY KEY,
  org_id TEXT UNIQUE NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  branding JSON DEFAULT '{"logo_url": null, "primary_color": "#f97316"}',
  enabled_modules JSON DEFAULT '["overview", "engines", "workflows", "knowledge", "integrations", "insights", "team", "outcomes"]',
  custom_cards JSON DEFAULT '[]',
  settings JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance (core tables)
CREATE INDEX IF NOT EXISTS idx_portal_sites_org ON portal_sites(org_id);
CREATE INDEX IF NOT EXISTS idx_portal_sites_site_key ON portal_sites(site_key);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_site ON chat_sessions(site_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_org ON chat_sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started ON chat_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_org ON chat_messages(org_id);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_org_date ON metrics_daily(org_id, date);

-- =============================================================================
-- Knowledge Tables (must exist before seeds)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('file', 'url', 'notion', 'google_drive', 's3', 'webhook')),
  status TEXT DEFAULT 'connected' CHECK(status IN ('connected', 'syncing', 'error', 'paused')),
  sync_cursor TEXT,
  last_synced_at TEXT,
  config JSON DEFAULT '{}',
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  path TEXT,
  external_id TEXT,
  status TEXT DEFAULT 'processing' CHECK(status IN ('processing', 'ready', 'failed', 'archived')),
  live_version_id TEXT REFERENCES knowledge_versions(id),
  checksum TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS knowledge_versions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  stage TEXT DEFAULT 'draft' CHECK(stage IN ('draft', 'live', 'archived')),
  is_live INTEGER DEFAULT 0,
  checksum TEXT,
  chunk_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  change_note TEXT
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES knowledge_versions(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  token_count INTEGER DEFAULT 0,
  embedding JSON,
  page_label TEXT,
  metadata JSON DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  version_id TEXT NOT NULL REFERENCES knowledge_versions(id) ON DELETE CASCADE,
  chunk_id TEXT NOT NULL REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  vector JSON NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS knowledge_ingestion_jobs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  source_id TEXT REFERENCES knowledge_sources(id) ON DELETE SET NULL,
  document_id TEXT REFERENCES knowledge_documents(id) ON DELETE SET NULL,
  version_id TEXT REFERENCES knowledge_versions(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK(type IN ('ingest_source', 'ingest_document', 'rechunk', 'embed', 'sync')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'succeeded', 'failed')),
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS knowledge_policies (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rules JSON DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================================================
-- Flow Engine Tables (must exist before seeds)
-- =============================================================================

CREATE TABLE IF NOT EXISTS flows (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'paused', 'archived')),
  trigger JSON DEFAULT '{"type":"api","config":{}}',
  entry_step_id TEXT,
  last_published_at TEXT,
  version INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS flow_steps (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN ('collector', 'router', 'llm', 'action', 'handoff', 'end')),
  name TEXT NOT NULL,
  config JSON DEFAULT '{}',
  next_step_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS flow_rules (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  step_id TEXT REFERENCES flow_steps(id) ON DELETE CASCADE,
  condition TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('goto', 'end', 'handoff', 'invoke_action')),
  target_step_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS flow_tests (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  input JSON DEFAULT '{}',
  expected_outcome TEXT,
  last_run_at TEXT,
  last_result TEXT CHECK(last_result IS NULL OR last_result IN ('passed', 'failed', 'blocked'))
);

CREATE TABLE IF NOT EXISTS flow_runs (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  started_at TEXT DEFAULT (datetime('now')),
  duration_ms INTEGER,
  outcome TEXT CHECK(outcome IN ('success', 'failed', 'handoff', 'cancelled')),
  triggered_policy_ids JSON DEFAULT '[]',
  metadata JSON DEFAULT '{}'
);

-- Indexes for knowledge + flow tables
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_org ON knowledge_sources(org_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_org_source ON knowledge_documents(org_id, source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_versions_doc ON knowledge_versions(document_id, version_number);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_version ON knowledge_chunks(version_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_policies_org ON knowledge_policies(org_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_version ON knowledge_embeddings(version_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_ingestion_jobs_org_status ON knowledge_ingestion_jobs(org_id, status);
CREATE INDEX IF NOT EXISTS idx_flows_org_status ON flows(org_id, status);
CREATE INDEX IF NOT EXISTS idx_flow_steps_flow ON flow_steps(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_rules_flow ON flow_rules(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_tests_flow ON flow_tests(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_runs_flow ON flow_runs(flow_id, started_at);

-- =============================================================================
-- Seed Data: Core Orgs and Sites
-- =============================================================================

INSERT OR IGNORE INTO orgs (id, name, slug, status, plan) VALUES
  ('org_chadis', 'CHADIS Healthcare', 'chadis', 'active', 'chatbot'),
  ('org_dental', 'Pannu Dental', 'pannu-dental', 'active', 'bundle');

INSERT OR IGNORE INTO portal_sites (id, org_id, site_key, name, type, domain) VALUES
  ('site_chadis_chat', 'org_chadis', 'sk_chadis_live_abc123', 'CHADIS Main Chatbot', 'chatbot', 'chadis.com'),
  ('site_dental_chat', 'org_dental', 'sk_dental_live_xyz789', 'Pannu Dental Chat', 'chatbot', 'pannudental.com'),
  ('site_dental_voice', 'org_dental', 'sk_dental_voice_def456', 'Pannu Dental Voice', 'voice', 'pannudental.com');

INSERT OR IGNORE INTO portal_config (id, org_id, branding, enabled_modules) VALUES
  ('config_chadis', 'org_chadis', '{"logo_url": null, "primary_color": "#3b82f6"}', '["overview", "engines", "knowledge", "insights", "team"]'),
  ('config_dental', 'org_dental', '{"logo_url": null, "primary_color": "#22c55e"}', '["overview", "engines", "workflows", "knowledge", "integrations", "insights", "team", "outcomes"]');

-- =============================================================================
-- Seed Data: Knowledge Sources, Documents, Versions, Chunks, Policies
-- =============================================================================

INSERT OR IGNORE INTO knowledge_sources (id, org_id, name, type, status, sync_cursor, last_synced_at, config) VALUES
  ('ks_chadis_handbook', 'org_chadis', 'CHADIS Playbook', 'file', 'connected', NULL, datetime('now','-1 day'), '{"path":"/handbook.pdf"}'),
  ('ks_chadis_protocols', 'org_chadis', 'Clinical Protocols', 'file', 'connected', NULL, datetime('now', '-1 day'), '{"path": "s3://chadis/protocols"}'),
  ('ks_dental_faq', 'org_dental', 'Pannu Dental FAQ', 'url', 'connected', NULL, datetime('now','-2 hours'), '{"url":"https://pannudental.com/faq"}'),
  ('ks_dental_scripts', 'org_dental', 'Front Desk Scripts', 'file', 'connected', NULL, datetime('now', '-2 days'), '{"path": "s3://pannu/scripts"}');

INSERT OR IGNORE INTO knowledge_documents (id, org_id, source_id, title, path, external_id, status, checksum, mime_type, size_bytes) VALUES
  ('kd_chadis_1', 'org_chadis', 'ks_chadis_handbook', 'CHADIS Staff Guide', '/handbook.pdf', 'ext_doc_1', 'ready', 'chk_123', 'application/pdf', 524288),
  ('kd_chadis_discharge', 'org_chadis', 'ks_chadis_protocols', 'Discharge Guidance v2', NULL, NULL, 'ready', 'chk_discharge_v2', 'application/pdf', 102400),
  ('kd_dental_1', 'org_dental', 'ks_dental_faq', 'Dental FAQ', '/faq.html', 'ext_doc_2', 'ready', 'chk_456', 'text/html', 10240),
  ('kd_dental_billing', 'org_dental', 'ks_dental_scripts', 'Billing Escalations', NULL, NULL, 'ready', 'chk_billing_v1', 'text/markdown', 8192);

INSERT OR IGNORE INTO knowledge_versions (id, document_id, org_id, version_number, checksum, chunk_count, token_count, created_at, created_by, change_note) VALUES
  ('kv_chadis_1', 'kd_chadis_1', 'org_chadis', 1, 'chk_123', 2, 800, datetime('now','-1 day'), 'system', 'Initial ingest'),
  ('kv_chadis_v2', 'kd_chadis_discharge', 'org_chadis', 2, 'chk_discharge_v2', 3, 1200, datetime('now', '-1 day'), 'clinician_1', 'Updated discharge language'),
  ('kv_dental_1', 'kd_dental_1', 'org_dental', 1, 'chk_456', 2, 600, datetime('now','-2 hours'), 'system', 'Initial ingest'),
  ('kv_dental_v1', 'kd_dental_billing', 'org_dental', 1, 'chk_billing_v1', 2, 800, datetime('now', '-2 days'), 'ops_manager', 'Initial upload');

INSERT OR IGNORE INTO knowledge_chunks (id, version_id, org_id, content, token_count, page_label, metadata) VALUES
  ('kc_chadis_1a', 'kv_chadis_1', 'org_chadis', 'Welcome to CHADIS support. This guide explains intake flows.', 120, 'p1', '{"section":"intro"}'),
  ('kc_chadis_1b', 'kv_chadis_1', 'org_chadis', 'For escalations, handoff to clinical coordinator.', 80, 'p2', '{"section":"escalation"}'),
  ('kc_chadis_v2_1', 'kv_chadis_v2', 'org_chadis', 'When uncertain about dosage, route to on-call clinician and mark as pending.', 120, 'p1', '{"policy": "escalation"}'),
  ('kc_chadis_v2_2', 'kv_chadis_v2', 'org_chadis', 'Discharge requires follow-up call within 24 hours for pediatric cases.', 150, 'p2', '{"policy": "follow_up"}'),
  ('kc_chadis_v2_3', 'kv_chadis_v2', 'org_chadis', 'Mask PHI in summaries; redact names, dates of birth, and addresses.', 90, 'p3', '{"policy": "redaction"}'),
  ('kc_dental_1a', 'kv_dental_1', 'org_dental', 'Our dentists are available 9am-6pm. Call scheduling for urgent needs.', 90, 'p1', '{"section":"hours"}'),
  ('kc_dental_1b', 'kv_dental_1', 'org_dental', 'Insurance accepted: Delta, MetLife. Collect policy number.', 110, 'p1', '{"section":"insurance"}'),
  ('kc_dental_v1_1', 'kv_dental_v1', 'org_dental', 'If balance > $500, offer payment plan before escalating.', 110, 'p1', '{"policy": "payment_plan"}'),
  ('kc_dental_v1_2', 'kv_dental_v1', 'org_dental', 'Route insurance disputes to billing specialist and capture claim number.', 140, 'p2', '{"policy": "handoff"}');

INSERT OR IGNORE INTO knowledge_ingestion_jobs (id, org_id, source_id, document_id, version_id, type, status, error_message, created_at, updated_at) VALUES
  ('kj_chadis_seed', 'org_chadis', 'ks_chadis_handbook', 'kd_chadis_1', 'kv_chadis_1', 'ingest_document', 'succeeded', NULL, datetime('now','-1 day'), datetime('now','-1 day')),
  ('kj_dental_seed', 'org_dental', 'ks_dental_faq', 'kd_dental_1', 'kv_dental_1', 'ingest_document', 'succeeded', NULL, datetime('now','-2 hours'), datetime('now','-2 hours'));

UPDATE knowledge_versions SET is_live = 1, stage = 'live' WHERE id IN ('kv_chadis_1', 'kv_chadis_v2', 'kv_dental_1', 'kv_dental_v1');
UPDATE knowledge_documents SET live_version_id = 'kv_chadis_v2' WHERE id = 'kd_chadis_discharge';
UPDATE knowledge_documents SET live_version_id = 'kv_dental_1' WHERE id = 'kd_dental_1';
UPDATE knowledge_documents SET live_version_id = 'kv_dental_v1' WHERE id = 'kd_dental_billing';
UPDATE knowledge_documents SET live_version_id = 'kv_chadis_1' WHERE id = 'kd_chadis_1';

INSERT OR IGNORE INTO knowledge_policies (id, org_id, name, description, rules) VALUES
  ('kp_chadis_guardrails', 'org_chadis', 'PHI Guardrails', 'Mask PHI and handoff sensitive intents', '[{"id":"rule_phi","type":"redact","match":"phi","applies_to":"responses","enforcement":"mask"},{"id":"rule_handoff","type":"handoff","match":"keyword","pattern":"emergency","applies_to":"responses","enforcement":"handoff"}]'),
  ('kp_chadis_redact', 'org_chadis', 'Clinical Guardrails', 'Redact PHI and handoff uncertain cases', '[{"id":"rule_phi","type":"redact","match":"pii","applies_to":"responses","enforcement":"mask"},{"id":"rule_handoff","type":"handoff","match":"keyword","pattern":"uncertain","applies_to":"responses","enforcement":"handoff","action":"route_to_clinician"}]'),
  ('kp_dental_billing', 'org_dental', 'Billing Escalation', 'Escalate payment disputes', '[{"id":"rule_billing","type":"handoff","match":"keyword","pattern":"dispute","applies_to":"responses","enforcement":"handoff","action":"route_to_billing"}]');

-- =============================================================================
-- Seed Data: Flows, Steps, Rules, Tests, Runs
-- =============================================================================

INSERT OR IGNORE INTO flows (id, org_id, name, description, status, trigger, entry_step_id, last_published_at, version) VALUES
  ('flow_chadis_intake', 'org_chadis', 'CHADIS Intake', 'Collect symptoms then route to clinician when uncertain', 'active', '{"type":"chat","config":{"channel":"chat"}}', 'fs_chadis_collect', datetime('now','-1 hour'), 3),
  ('flow_dental_booking', 'org_dental', 'Dental Booking', 'Capture appointment intent and schedule', 'active', '{"type":"chat","config":{"channel":"chat"}}', 'fs_dental_collect', datetime('now','-2 hours'), 2),
  ('flow_dental_payments', 'org_dental', 'Payment Recovery', 'Automate payment reminders and handoffs', 'active', '{"type":"chat","config":{"channel":"chat"}}', 'fs_dental_pay_collect', datetime('now', '-2 days'), 1);

INSERT OR IGNORE INTO flow_steps (id, flow_id, kind, name, config, next_step_id) VALUES
  ('fs_chadis_collect', 'flow_chadis_intake', 'collector', 'Collect Symptoms', '{"fields":["name","symptom","severity","medications"]}', 'fs_chadis_route'),
  ('fs_chadis_route', 'flow_chadis_intake', 'router', 'Route by Certainty', '{"threshold":0.7}', 'fs_chadis_handoff'),
  ('fs_chadis_handoff', 'flow_chadis_intake', 'handoff', 'Escalate to Clinician', '{"channel":"pagerduty"}', 'fs_chadis_end'),
  ('fs_chadis_end', 'flow_chadis_intake', 'end', 'Close Intake', '{}', NULL),
  ('fs_dental_collect', 'flow_dental_booking', 'collector', 'Collect booking details', '{"fields":["name","time","insurance"]}', 'fs_dental_action'),
  ('fs_dental_action', 'flow_dental_booking', 'action', 'Book appointment', '{"actionKey":"book_appointment"}', 'fs_dental_end'),
  ('fs_dental_end', 'flow_dental_booking', 'end', 'End conversation', '{}', NULL),
  ('fs_dental_pay_collect', 'flow_dental_payments', 'collector', 'Collect Balance Details', '{"fields":["balance","patient_name"]}', 'fs_dental_pay_action'),
  ('fs_dental_pay_action', 'flow_dental_payments', 'action', 'Send Payment Link', '{"actionKey":"send_payment_link"}', 'fs_dental_pay_end'),
  ('fs_dental_pay_end', 'flow_dental_payments', 'end', 'Close Conversation', '{}', NULL);

INSERT OR IGNORE INTO flow_rules (id, flow_id, step_id, condition, action, target_step_id) VALUES
  ('fr_chadis_high', 'flow_chadis_intake', 'fs_chadis_route', 'severity == "high"', 'handoff', 'fs_chadis_handoff'),
  ('fr_chadis_uncertain', 'flow_chadis_intake', 'fs_chadis_route', 'certainty < 0.7', 'handoff', 'fs_chadis_handoff'),
  ('fr_chadis_confident', 'flow_chadis_intake', 'fs_chadis_route', 'certainty >= 0.7', 'goto', 'fs_chadis_end'),
  ('fr_dental_insurance', 'flow_dental_booking', 'fs_dental_action', 'insurance IS NULL', 'invoke_action', 'fs_dental_end'),
  ('fr_dental_high_balance', 'flow_dental_payments', 'fs_dental_pay_action', 'balance > 500', 'invoke_action', 'fs_dental_pay_end');

INSERT OR IGNORE INTO flow_tests (id, flow_id, name, input, expected_outcome, last_result, last_run_at) VALUES
  ('ft_chadis_smoke', 'flow_chadis_intake', 'Smoke test', '{"symptom":"fever","severity":"high"}', 'handoff', 'passed', datetime('now', '-12 hours')),
  ('ft_chadis_low_conf', 'flow_chadis_intake', 'Low certainty should handoff', '{"symptoms":"fever","certainty":0.5}', 'handoff', 'passed', datetime('now', '-12 hours')),
  ('ft_dental_booking', 'flow_dental_booking', 'Booking path', '{"name":"Alex","time":"10am"}', 'success', 'passed', datetime('now', '-6 hours')),
  ('ft_dental_high_balance', 'flow_dental_payments', 'High balance triggers action', '{"balance":900}', 'invoke_action', 'passed', datetime('now', '-6 hours'));

INSERT OR IGNORE INTO flow_runs (id, flow_id, org_id, started_at, duration_ms, outcome, triggered_policy_ids, metadata) VALUES
  ('frun_chadis_1', 'flow_chadis_intake', 'org_chadis', datetime('now','-30 minutes'), 1200, 'handoff', '["rule_handoff"]', '{"input":{"symptoms":"fever"}}'),
  ('frun_chadis_2', 'flow_chadis_intake', 'org_chadis', datetime('now', '-2 hours'), 5200, 'handoff', '["rule_handoff"]', '{"input":{"symptoms":"headache"}}'),
  ('frun_dental_1', 'flow_dental_booking', 'org_dental', datetime('now','-15 minutes'), 900, 'success', '[]', '{"input":{"name":"Alex"}}'),
  ('frun_dental_2', 'flow_dental_payments', 'org_dental', datetime('now', '-1 day'), 1800, 'success', '[]', '{"input":{"balance":900}}');

-- =============================================================================
-- Agent 4: Actions, Integrations, Observability, Billing, Compliance
-- =============================================================================

-- Registered action definitions (per org, versioned handlers)
CREATE TABLE IF NOT EXISTS action_definitions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT 'v1',
  handler_url TEXT,
  timeout_ms INTEGER DEFAULT 30000,
  retry_policy TEXT DEFAULT 'fixed' CHECK(retry_policy IN ('none', 'fixed', 'exponential')),
  max_retries INTEGER DEFAULT 3,
  metadata JSON DEFAULT '{}',
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(org_id, key)
);

-- Action executions with idempotency + retry metadata
CREATE TABLE IF NOT EXISTS action_runs (
  id TEXT PRIMARY KEY,
  action_id TEXT NOT NULL REFERENCES action_definitions(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'succeeded', 'failed', 'canceled')),
  attempt INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  retry_policy TEXT DEFAULT 'fixed' CHECK(retry_policy IN ('none', 'fixed', 'exponential')),
  trigger_source TEXT,
  idempotency_key TEXT,
  flow_id TEXT,
  flow_run_id TEXT REFERENCES flow_runs(id) ON DELETE SET NULL,
  input JSON DEFAULT '{}',
  output JSON,
  error TEXT,
  started_at TEXT,
  completed_at TEXT,
  last_error_at TEXT,
  next_retry_at TEXT,
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(org_id, idempotency_key)
);

-- Dead letter queue for poison action runs
CREATE TABLE IF NOT EXISTS action_run_dlq (
  id TEXT PRIMARY KEY,
  action_run_id TEXT UNIQUE NOT NULL REFERENCES action_runs(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  reason TEXT,
  payload JSON,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Integration connections (OAuth/API keys) per org and connector
CREATE TABLE IF NOT EXISTS integration_connections (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  connector TEXT NOT NULL,
  status TEXT DEFAULT 'connected' CHECK(status IN ('connected', 'disconnected', 'error', 'pending')),
  credentials JSON DEFAULT '{}',
  last_refreshed_at TEXT,
  expires_at TEXT,
  health_status TEXT DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'warning', 'error')),
  health_detail TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(org_id, connector)
);

-- Incoming webhooks from integrations (normalized + verified)
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES orgs(id) ON DELETE CASCADE,
  connector TEXT NOT NULL,
  event_type TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processed', 'failed', 'rejected')),
  payload JSON,
  headers JSON,
  signature_valid INTEGER DEFAULT 0,
  received_at TEXT DEFAULT (datetime('now')),
  processed_at TEXT,
  action_run_id TEXT REFERENCES action_runs(id) ON DELETE SET NULL,
  error TEXT
);

-- Append-only audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES orgs(id) ON DELETE CASCADE,
  actor_type TEXT CHECK(actor_type IN ('user', 'system', 'integration')),
  actor_id TEXT,
  event_type TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Outcome events for ROI/observability
CREATE TABLE IF NOT EXISTS outcome_events (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  action_run_id TEXT REFERENCES action_runs(id) ON DELETE SET NULL,
  outcome_type TEXT NOT NULL,
  label TEXT,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  recorded_at TEXT DEFAULT (datetime('now')),
  metadata JSON DEFAULT '{}'
);

-- Billing/usage ledger (per org + action type)
CREATE TABLE IF NOT EXISTS billing_records (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  usage_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit_price_cents INTEGER DEFAULT 0,
  amount_cents INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'invoiced', 'paid', 'written_off')),
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  external_invoice_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Data retention per org + data type
CREATE TABLE IF NOT EXISTS retention_policies (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  ttl_days INTEGER NOT NULL,
  apply_anonymization INTEGER DEFAULT 0,
  enforced_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(org_id, data_type)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_action_definitions_org ON action_definitions(org_id);
CREATE INDEX IF NOT EXISTS idx_action_runs_org_status ON action_runs(org_id, status);
CREATE INDEX IF NOT EXISTS idx_action_runs_action ON action_runs(action_id);
CREATE INDEX IF NOT EXISTS idx_action_runs_next_retry ON action_runs(next_retry_at) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_integration_connections_org ON integration_connections(org_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_org_status ON webhook_events(org_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_outcome_events_org ON outcome_events(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_org_period ON billing_records(org_id, period_start, period_end);

-- =============================================================================
-- Seed Data: Action Definitions
-- =============================================================================

INSERT OR IGNORE INTO action_definitions (id, org_id, key, name, description, version, handler_url, timeout_ms, retry_policy, max_retries, metadata, created_by) VALUES
  ('act_chadis_handoff', 'org_chadis', 'handoff_to_clinician', 'Handoff to Clinician', 'Routes conversation to on-call clinician via PagerDuty', 'v1', 'https://api.koby.ai/actions/pagerduty', 30000, 'exponential', 3, '{"channel":"pagerduty"}', 'system'),
  ('act_chadis_send_summary', 'org_chadis', 'send_summary_email', 'Send Summary Email', 'Sends summary of intake to clinical coordinator', 'v1', 'https://api.koby.ai/actions/email', 15000, 'fixed', 2, '{"template":"intake_summary"}', 'system'),
  ('act_dental_book', 'org_dental', 'book_appointment', 'Book Appointment', 'Creates appointment in scheduling system', 'v1', 'https://api.koby.ai/actions/schedule', 20000, 'fixed', 3, '{"provider":"dentrix"}', 'system'),
  ('act_dental_payment', 'org_dental', 'send_payment_link', 'Send Payment Link', 'Sends payment link via SMS', 'v1', 'https://api.koby.ai/actions/sms', 10000, 'fixed', 2, '{"type":"payment"}', 'system'),
  ('act_dental_reminder', 'org_dental', 'send_reminder', 'Send Appointment Reminder', 'Sends appointment reminder via SMS/email', 'v1', 'https://api.koby.ai/actions/reminder', 10000, 'none', 0, '{"channels":["sms","email"]}', 'system');

-- =============================================================================
-- Seed Data: Action Runs
-- =============================================================================

INSERT OR IGNORE INTO action_runs (id, action_id, org_id, status, attempt, max_retries, retry_policy, trigger_source, idempotency_key, flow_id, input, output, started_at, completed_at, metadata) VALUES
  ('arun_chadis_1', 'act_chadis_handoff', 'org_chadis', 'succeeded', 1, 3, 'exponential', 'flow', 'idem_chadis_1', 'flow_chadis_intake', '{"patient_id":"P123","severity":"high"}', '{"ticket_id":"PD-456","assigned_to":"Dr. Smith"}', datetime('now', '-2 hours'), datetime('now', '-2 hours', '+30 seconds'), '{"session_id":"sess_abc"}'),
  ('arun_chadis_2', 'act_chadis_send_summary', 'org_chadis', 'succeeded', 1, 2, 'fixed', 'flow', 'idem_chadis_2', 'flow_chadis_intake', '{"patient_id":"P124","summary":"Fever, headache"}', '{"email_id":"em_789"}', datetime('now', '-1 hour'), datetime('now', '-1 hour', '+5 seconds'), '{}'),
  ('arun_dental_1', 'act_dental_book', 'org_dental', 'succeeded', 1, 3, 'fixed', 'flow', 'idem_dental_1', 'flow_dental_booking', '{"patient":"Alex","time":"10:00 AM"}', '{"appointment_id":"APT-001","confirmed":true}', datetime('now', '-30 minutes'), datetime('now', '-30 minutes', '+2 seconds'), '{}'),
  ('arun_dental_2', 'act_dental_payment', 'org_dental', 'succeeded', 1, 2, 'fixed', 'flow', 'idem_dental_2', 'flow_dental_payments', '{"patient":"Jane","amount":450}', '{"sms_id":"SMS-002","delivered":true}', datetime('now', '-4 hours'), datetime('now', '-4 hours', '+1 second'), '{}'),
  ('arun_dental_3', 'act_dental_reminder', 'org_dental', 'failed', 2, 0, 'none', 'schedule', 'idem_dental_3', NULL, '{"patient":"Bob","appointment_id":"APT-002"}', NULL, datetime('now', '-6 hours'), NULL, '{"error":"SMS gateway timeout"}');

-- =============================================================================
-- Seed Data: Integration Connections
-- =============================================================================

INSERT OR IGNORE INTO integration_connections (id, org_id, connector, status, credentials, last_refreshed_at, expires_at, health_status, health_detail) VALUES
  ('int_chadis_pagerduty', 'org_chadis', 'pagerduty', 'connected', '{"api_key":"***masked***"}', datetime('now', '-1 hour'), datetime('now', '+30 days'), 'healthy', NULL),
  ('int_chadis_email', 'org_chadis', 'sendgrid', 'connected', '{"api_key":"***masked***"}', datetime('now', '-2 hours'), NULL, 'healthy', NULL),
  ('int_dental_dentrix', 'org_dental', 'dentrix', 'connected', '{"client_id":"***masked***","client_secret":"***masked***"}', datetime('now', '-30 minutes'), datetime('now', '+7 days'), 'healthy', 'Last sync successful'),
  ('int_dental_twilio', 'org_dental', 'twilio', 'connected', '{"account_sid":"***masked***","auth_token":"***masked***"}', datetime('now', '-1 hour'), NULL, 'healthy', NULL),
  ('int_dental_stripe', 'org_dental', 'stripe', 'connected', '{"secret_key":"***masked***"}', datetime('now', '-3 hours'), NULL, 'warning', 'Webhook signature verification failing intermittently'),
  ('int_dental_gcal', 'org_dental', 'google_calendar', 'error', '{"access_token":"***expired***"}', datetime('now', '-2 days'), datetime('now', '-1 day'), 'error', 'OAuth token expired, needs re-authentication');

-- =============================================================================
-- Seed Data: Outcome Events
-- =============================================================================

INSERT OR IGNORE INTO outcome_events (id, org_id, action_run_id, outcome_type, label, amount_cents, currency, recorded_at, metadata) VALUES
  ('out_chadis_1', 'org_chadis', 'arun_chadis_1', 'handoff_completed', 'Clinician handoff for high-severity case', 0, 'USD', datetime('now', '-2 hours'), '{"severity":"high","response_time_ms":1200}'),
  ('out_chadis_2', 'org_chadis', 'arun_chadis_2', 'email_sent', 'Intake summary delivered', 0, 'USD', datetime('now', '-1 hour'), '{"recipient":"coordinator@chadis.com"}'),
  ('out_dental_1', 'org_dental', 'arun_dental_1', 'appointment_booked', 'New patient appointment scheduled', 15000, 'USD', datetime('now', '-30 minutes'), '{"appointment_type":"cleaning","estimated_value":150}'),
  ('out_dental_2', 'org_dental', 'arun_dental_2', 'payment_collected', 'Outstanding balance collected', 45000, 'USD', datetime('now', '-4 hours'), '{"method":"card","patient":"Jane"}'),
  ('out_dental_3', 'org_dental', NULL, 'lead_captured', 'New patient inquiry via chat', 0, 'USD', datetime('now', '-1 day'), '{"source":"website","interest":"implants"}'),
  ('out_dental_4', 'org_dental', NULL, 'review_requested', 'Post-appointment review request sent', 0, 'USD', datetime('now', '-3 days'), '{"platform":"google","patient":"Bob"}');

-- =============================================================================
-- Seed Data: Billing Records
-- =============================================================================

INSERT OR IGNORE INTO billing_records (id, org_id, usage_type, quantity, unit_price_cents, amount_cents, status, period_start, period_end, external_invoice_id) VALUES
  ('bill_chadis_dec_actions', 'org_chadis', 'action_runs', 45, 10, 450, 'pending', datetime('now', 'start of month'), datetime('now'), NULL),
  ('bill_chadis_dec_messages', 'org_chadis', 'chat_messages', 1200, 1, 1200, 'pending', datetime('now', 'start of month'), datetime('now'), NULL),
  ('bill_chadis_nov_actions', 'org_chadis', 'action_runs', 38, 10, 380, 'paid', datetime('now', 'start of month', '-1 month'), datetime('now', 'start of month', '-1 second'), 'inv_chadis_nov_001'),
  ('bill_dental_dec_actions', 'org_dental', 'action_runs', 120, 10, 1200, 'pending', datetime('now', 'start of month'), datetime('now'), NULL),
  ('bill_dental_dec_messages', 'org_dental', 'chat_messages', 3500, 1, 3500, 'pending', datetime('now', 'start of month'), datetime('now'), NULL),
  ('bill_dental_dec_voice', 'org_dental', 'voice_minutes', 85, 15, 1275, 'pending', datetime('now', 'start of month'), datetime('now'), NULL),
  ('bill_dental_nov_total', 'org_dental', 'action_runs', 98, 10, 980, 'paid', datetime('now', 'start of month', '-1 month'), datetime('now', 'start of month', '-1 second'), 'inv_dental_nov_001');

-- =============================================================================
-- Seed Data: Audit Logs
-- =============================================================================

INSERT OR IGNORE INTO audit_logs (id, org_id, actor_type, actor_id, event_type, target_type, target_id, metadata) VALUES
  ('aud_1', 'org_chadis', 'user', 'user_admin_chadis', 'flow.published', 'flow', 'flow_chadis_intake', '{"version":3}'),
  ('aud_2', 'org_chadis', 'system', 'system', 'action_run.completed', 'action_run', 'arun_chadis_1', '{"status":"succeeded"}'),
  ('aud_3', 'org_chadis', 'integration', 'int_chadis_pagerduty', 'integration.refreshed', 'integration', 'int_chadis_pagerduty', '{"health":"healthy"}'),
  ('aud_4', 'org_dental', 'user', 'user_admin_dental', 'knowledge.document.uploaded', 'document', 'kd_dental_billing', '{"title":"Billing Escalations"}'),
  ('aud_5', 'org_dental', 'user', 'user_admin_dental', 'flow.created', 'flow', 'flow_dental_payments', '{"name":"Payment Recovery"}'),
  ('aud_6', 'org_dental', 'system', 'system', 'action_run.failed', 'action_run', 'arun_dental_3', '{"error":"SMS gateway timeout","attempts":2}'),
  ('aud_7', 'org_dental', 'system', 'system', 'integration.health_check', 'integration', 'int_dental_gcal', '{"status":"error","detail":"OAuth token expired"}');

-- =============================================================================
-- Stripe Billing Tables (Agent 3: Subscription Architecture)
-- =============================================================================

-- Stripe Customer per org (1:1 relationship)
-- Links Clerk org to Stripe customer for billing
CREATE TABLE IF NOT EXISTS billing_customers (
  id TEXT PRIMARY KEY,
  org_id TEXT UNIQUE NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  currency TEXT DEFAULT 'usd',
  balance_cents INTEGER DEFAULT 0,
  delinquent INTEGER DEFAULT 0,
  default_payment_method_id TEXT,
  invoice_settings JSON DEFAULT '{}',
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Stripe Subscription per org (supports multiple subscriptions per org)
-- Tracks subscription lifecycle and billing periods
CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  billing_customer_id TEXT NOT NULL REFERENCES billing_customers(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN (
    'incomplete', 'incomplete_expired', 'trialing', 'active', 
    'past_due', 'canceled', 'unpaid', 'paused'
  )),
  plan_nickname TEXT,
  quantity INTEGER DEFAULT 1,
  cancel_at_period_end INTEGER DEFAULT 0,
  current_period_start TEXT,
  current_period_end TEXT,
  canceled_at TEXT,
  ended_at TEXT,
  trial_start TEXT,
  trial_end TEXT,
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Stripe Invoices (synced from webhook events)
-- Full invoice data for display and reconciliation
CREATE TABLE IF NOT EXISTS billing_invoices (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  billing_customer_id TEXT NOT NULL REFERENCES billing_customers(id) ON DELETE CASCADE,
  billing_subscription_id TEXT REFERENCES billing_subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  stripe_invoice_number TEXT,
  status TEXT NOT NULL CHECK(status IN (
    'draft', 'open', 'paid', 'uncollectible', 'void'
  )),
  currency TEXT DEFAULT 'usd',
  subtotal_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  total_cents INTEGER DEFAULT 0,
  amount_due_cents INTEGER DEFAULT 0,
  amount_paid_cents INTEGER DEFAULT 0,
  amount_remaining_cents INTEGER DEFAULT 0,
  hosted_invoice_url TEXT,
  invoice_pdf TEXT,
  period_start TEXT,
  period_end TEXT,
  due_date TEXT,
  paid_at TEXT,
  finalized_at TEXT,
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Invoice line items (individual charges on an invoice)
CREATE TABLE IF NOT EXISTS billing_invoice_lines (
  id TEXT PRIMARY KEY,
  billing_invoice_id TEXT NOT NULL REFERENCES billing_invoices(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  stripe_line_item_id TEXT UNIQUE NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_amount_cents INTEGER DEFAULT 0,
  amount_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  price_id TEXT,
  product_id TEXT,
  period_start TEXT,
  period_end TEXT,
  proration INTEGER DEFAULT 0,
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Stripe webhook events (idempotent processing + audit trail)
-- Stores raw Stripe events for replay and debugging
CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  api_version TEXT,
  livemode INTEGER DEFAULT 0,
  org_id TEXT REFERENCES orgs(id) ON DELETE SET NULL,
  object_type TEXT,
  object_id TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processed', 'failed', 'skipped')),
  processing_error TEXT,
  payload JSON NOT NULL,
  received_at TEXT DEFAULT (datetime('now')),
  processed_at TEXT
);

-- Checkout sessions (tracks pending purchases before subscription creation)
CREATE TABLE IF NOT EXISTS billing_checkout_sessions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'open' CHECK(status IN ('open', 'complete', 'expired')),
  mode TEXT DEFAULT 'subscription' CHECK(mode IN ('payment', 'setup', 'subscription')),
  success_url TEXT,
  cancel_url TEXT,
  expires_at TEXT,
  completed_at TEXT,
  metadata JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Billing portal sessions (tracks Stripe Billing Portal access)
CREATE TABLE IF NOT EXISTS billing_portal_sessions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  billing_customer_id TEXT NOT NULL REFERENCES billing_customers(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_session_url TEXT NOT NULL,
  return_url TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for billing tables
CREATE INDEX IF NOT EXISTS idx_billing_customers_org ON billing_customers(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_customers_stripe ON billing_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_org ON billing_subscriptions(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_stripe ON billing_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status ON billing_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_org ON billing_invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_stripe ON billing_invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_status ON billing_invoices(status);
CREATE INDEX IF NOT EXISTS idx_billing_invoice_lines_invoice ON billing_invoice_lines(billing_invoice_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_stripe_id ON stripe_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON stripe_events(status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_org ON stripe_events(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_checkout_sessions_org ON billing_checkout_sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_checkout_sessions_stripe ON billing_checkout_sessions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_billing_portal_sessions_org ON billing_portal_sessions(org_id);

-- =============================================================================
-- Seed Data: Retention Policies
-- =============================================================================

INSERT OR IGNORE INTO retention_policies (id, org_id, data_type, ttl_days, apply_anonymization, enforced_at) VALUES
  ('ret_chadis_sessions', 'org_chadis', 'chat_sessions', 90, 1, datetime('now', '-7 days')),
  ('ret_chadis_messages', 'org_chadis', 'chat_messages', 90, 1, datetime('now', '-7 days')),
  ('ret_chadis_audit', 'org_chadis', 'audit_logs', 365, 0, NULL),
  ('ret_dental_sessions', 'org_dental', 'chat_sessions', 180, 0, datetime('now', '-14 days')),
  ('ret_dental_messages', 'org_dental', 'chat_messages', 180, 0, datetime('now', '-14 days')),
  ('ret_dental_outcomes', 'org_dental', 'outcome_events', 730, 0, NULL),
  ('ret_dental_audit', 'org_dental', 'audit_logs', 365, 0, NULL);
