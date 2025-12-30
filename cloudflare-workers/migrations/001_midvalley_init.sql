-- Mid Valley Demo - Initial Schema
-- Creates tables for missed collection requests and ElevenLabs call data

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

CREATE INDEX IF NOT EXISTS idx_missed_collection_created
  ON missed_collection_requests(created_at);

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

CREATE INDEX IF NOT EXISTS idx_calls_created
  ON elevenlabs_calls(created_at);
