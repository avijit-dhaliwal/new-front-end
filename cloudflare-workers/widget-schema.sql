-- =============================================================================
-- Widget Deployment Schema (Agent 4)
-- Adds embeddable widget support with customization and versioning
-- Compatible with existing portal_sites + site_key approach
-- =============================================================================

-- Site deployments: Track widget deployments per site
-- Allows multiple environments (dev, staging, prod) per portal_site
CREATE TABLE IF NOT EXISTS site_deployments (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES portal_sites(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  environment TEXT NOT NULL DEFAULT 'production' CHECK(environment IN ('development', 'staging', 'production')),
  
  -- Deployment-specific key (can inherit from portal_sites.site_key or be unique)
  deploy_key TEXT UNIQUE NOT NULL,
  
  -- Widget profile reference for theme/behavior customization
  widget_profile_id TEXT REFERENCES widget_profiles(id) ON DELETE SET NULL,
  
  -- Domain allowlist (JSON array of allowed origins)
  -- Empty array = allow all (dev mode only, not recommended for production)
  allowed_origins JSON DEFAULT '[]',
  
  -- Rate limits per deployment (override defaults)
  rate_limit_rpm INTEGER DEFAULT 60,
  rate_limit_daily INTEGER DEFAULT 1000,
  
  -- Key rotation support
  previous_key TEXT,
  key_rotated_at TEXT,
  key_expires_at TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'disabled')),
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  deployed_at TEXT,
  
  UNIQUE(site_id, environment)
);

-- Widget profiles: Reusable theme/behavior configurations
-- Each org can have multiple profiles (e.g., "Default", "Holiday Theme", "Minimal")
CREATE TABLE IF NOT EXISTS widget_profiles (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Theme configuration (safe to expose publicly via config endpoint)
  theme JSON DEFAULT '{
    "position": "bottom-right",
    "primaryColor": "#f97316",
    "fontFamily": "system-ui",
    "borderRadius": "16px",
    "headerText": "Chat with us",
    "placeholderText": "Type a message...",
    "sendButtonIcon": "send",
    "showBranding": true,
    "darkMode": "auto"
  }',
  
  -- Behavior configuration
  behavior JSON DEFAULT '{
    "autoOpen": false,
    "autoOpenDelay": 5000,
    "triggerMessages": [],
    "persistSession": true,
    "sessionTimeout": 3600000,
    "showTypingIndicator": true,
    "enableSounds": false,
    "enableAttachments": false,
    "maxMessageLength": 2000
  }',
  
  -- Localization strings
  locale JSON DEFAULT '{
    "greeting": "Hello! How can I help you today?",
    "offlineMessage": "We are currently offline. Please leave a message.",
    "errorMessage": "Something went wrong. Please try again.",
    "sendLabel": "Send",
    "minimizeLabel": "Minimize chat"
  }',
  
  -- Analytics configuration
  analytics JSON DEFAULT '{
    "trackEvents": true,
    "trackConversions": true,
    "customEvents": []
  }',
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Widget versions: Track deployed widget code versions (global, not per-org)
CREATE TABLE IF NOT EXISTS widget_versions (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  
  -- Version metadata
  changelog TEXT,
  release_notes TEXT,
  
  -- CDN/hosting info
  script_url TEXT NOT NULL,
  styles_url TEXT,
  integrity_hash TEXT,
  
  -- Compatibility
  min_profile_version INTEGER DEFAULT 1,
  
  -- Status
  status TEXT DEFAULT 'stable' CHECK(status IN ('canary', 'beta', 'stable', 'deprecated')),
  
  released_at TEXT DEFAULT (datetime('now')),
  deprecated_at TEXT
);

-- Deployment version pinning: Allow orgs to pin specific widget versions
CREATE TABLE IF NOT EXISTS deployment_version_pins (
  id TEXT PRIMARY KEY,
  deployment_id TEXT NOT NULL REFERENCES site_deployments(id) ON DELETE CASCADE,
  widget_version_id TEXT NOT NULL REFERENCES widget_versions(id) ON DELETE CASCADE,
  
  -- Pin type: specific version or follow a channel
  pin_type TEXT DEFAULT 'specific' CHECK(pin_type IN ('specific', 'channel')),
  channel TEXT CHECK(channel IS NULL OR channel IN ('stable', 'beta', 'canary')),
  
  -- Gradual rollout for beta testing
  rollout_percentage INTEGER DEFAULT 100 CHECK(rollout_percentage BETWEEN 0 AND 100),
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  UNIQUE(deployment_id)
);

-- =============================================================================
-- Indexes for Performance
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_site_deployments_site ON site_deployments(site_id);
CREATE INDEX IF NOT EXISTS idx_site_deployments_org ON site_deployments(org_id);
CREATE INDEX IF NOT EXISTS idx_site_deployments_deploy_key ON site_deployments(deploy_key);
CREATE INDEX IF NOT EXISTS idx_site_deployments_env ON site_deployments(environment);
CREATE INDEX IF NOT EXISTS idx_widget_profiles_org ON widget_profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_widget_versions_status ON widget_versions(status);
CREATE INDEX IF NOT EXISTS idx_widget_versions_version ON widget_versions(version);

-- =============================================================================
-- Seed Data: Initial Widget Version
-- =============================================================================

INSERT OR IGNORE INTO widget_versions (id, version, changelog, script_url, status) VALUES
  ('wv_1_0_0', '1.0.0', 'Initial release', 'https://widget.koby.ai/v1/embed.js', 'stable');

-- =============================================================================
-- Self-Serve Support (Deferred - Uncomment when ready)
-- =============================================================================

-- Onboarding progress tracking
-- CREATE TABLE IF NOT EXISTS onboarding_steps (
--   id TEXT PRIMARY KEY,
--   org_id TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
--   step TEXT NOT NULL CHECK(step IN (
--     'account_created',
--     'org_created', 
--     'billing_added',
--     'site_created',
--     'domains_configured',
--     'embed_installed',
--     'first_message_received'
--   )),
--   completed_at TEXT,
--   metadata JSON DEFAULT '{}',
--   UNIQUE(org_id, step)
-- );

-- Add trial support to orgs (run as ALTER TABLE when ready)
-- ALTER TABLE orgs ADD COLUMN trial_ends_at TEXT;
-- ALTER TABLE orgs ADD COLUMN activated_at TEXT;
-- ALTER TABLE orgs ADD COLUMN deactivation_reason TEXT;
