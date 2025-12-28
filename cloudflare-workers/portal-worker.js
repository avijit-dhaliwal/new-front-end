/**
 * Koby Portal API - Cloudflare Worker
 * Handles portal data endpoints with Clerk JWT verification
 * Scopes data by org unless user is Koby staff
 */

// =============================================================================
// Configuration & Constants
// =============================================================================

// Request size limits (in bytes)
const MAX_REQUEST_SIZE = 1024 * 1024 // 1MB default
const MAX_WEBHOOK_SIZE = 5 * 1024 * 1024 // 5MB for webhooks

// Default allowed origins (can be overridden via env)
const DEFAULT_ALLOWED_ORIGINS = [
  'https://koby.ai',
  'https://www.koby.ai',
  'https://portal.koby.ai',
  'https://app.koby.ai',
]

// =============================================================================
// Structured Logging
// =============================================================================

/**
 * Create a structured log entry with consistent format
 * Logs are emitted via console.log for Cloudflare Logpush integration
 */
function createLogger(requestId, env) {
  const logLevel = env?.LOG_LEVEL || 'info'
  const levels = { debug: 0, info: 1, warn: 2, error: 3 }
  const currentLevel = levels[logLevel] || 1

  const emit = (level, message, data = {}) => {
    if (levels[level] < currentLevel) return

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      requestId,
      message,
      ...data,
    }
    console.log(JSON.stringify(entry))
  }

  return {
    debug: (msg, data) => emit('debug', msg, data),
    info: (msg, data) => emit('info', msg, data),
    warn: (msg, data) => emit('warn', msg, data),
    error: (msg, data) => emit('error', msg, data),
  }
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId() {
  return `req_${crypto.randomUUID().split('-')[0]}`
}

// =============================================================================
// CORS Configuration
// =============================================================================

/**
 * Build CORS headers based on request origin and allowed origins config
 */
function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || ''
  
  // Get allowed origins from env or use defaults
  const allowedOriginsStr = env?.ALLOWED_ORIGINS || ''
  const allowedOrigins = allowedOriginsStr
    ? allowedOriginsStr.split(',').map(o => o.trim())
    : DEFAULT_ALLOWED_ORIGINS

  // In development or if CORS_ALLOW_ALL is set, allow any origin
  if (env?.CORS_ALLOW_ALL === 'true' || env?.ENVIRONMENT === 'development') {
    return {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Max-Age': '86400',
    }
  }

  // Check if origin is in allowed list
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed.startsWith('*.')) {
      // Wildcard subdomain matching
      const domain = allowed.slice(2)
      return origin.endsWith(domain) || origin === `https://${domain}`
    }
    return origin === allowed
  })

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

// Legacy corsHeaders for backward compatibility (used in jsonResponse)
let corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// =============================================================================
// Request Validation
// =============================================================================

/**
 * Check if request body exceeds size limit
 */
async function checkRequestSize(request, maxSize = MAX_REQUEST_SIZE) {
  const contentLength = request.headers.get('Content-Length')
  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    return { valid: false, error: 'Request body too large' }
  }
  return { valid: true }
}

// Generate UUID
function generateId() {
  return crypto.randomUUID()
}

// Simple per-IP rate limiter (sliding window)
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 120
const rateLimitBuckets = new Map()

function getClientIp(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown'
}

function isRateLimited(request, env) {
  if (env?.SKIP_PORTAL_RATE_LIMIT === 'true') return false

  const ip = getClientIp(request)
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS

  const bucket = rateLimitBuckets.get(ip) || []
  const recent = bucket.filter(ts => ts > windowStart)
  if (recent.length >= (env?.PORTAL_RATE_LIMIT_MAX ? parseInt(env.PORTAL_RATE_LIMIT_MAX, 10) : RATE_LIMIT_MAX)) {
    rateLimitBuckets.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimitBuckets.set(ip, recent)
  return false
}

// Verify Clerk JWT and extract claims
async function verifyClerkJWT(token, env) {
  try {
    // Fetch Clerk JWKS
    const jwksUrl = `https://${env.CLERK_DOMAIN}/.well-known/jwks.json`
    const jwksResponse = await fetch(jwksUrl)
    const jwks = await jwksResponse.json()

    // Decode JWT header to get kid
    const [headerB64] = token.split('.')
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')))
    const kid = header.kid

    // Find matching key
    const key = jwks.keys.find(k => k.kid === kid)
    if (!key) {
      throw new Error('No matching key found')
    }

    // Import the public key
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      key,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Decode and verify JWT
    const [, payloadB64, signatureB64] = token.split('.')
    const signatureData = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)

    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signatureData,
      data
    )

    if (!valid) {
      throw new Error('Invalid signature')
    }

    // Decode payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired')
    }

    return payload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

// Extract auth context from request using D1 user/membership tables
async function getAuthContext(request, env) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const claims = await verifyClerkJWT(token, env)
  if (!claims) {
    return null
  }

  const db = env.DB
  const clerkUserId = claims.sub
  const url = new URL(request.url)

  // Look up user in D1
  let user = await db.prepare('SELECT * FROM users WHERE clerk_user_id = ?').bind(clerkUserId).first()

  // Auto-create user if not exists (first login)
  if (!user) {
    const userId = generateId()
    const email = claims.email || claims.primary_email_address || null
    const name = claims.name || [claims.first_name, claims.last_name].filter(Boolean).join(' ') || null
    const avatarUrl = claims.image_url || claims.profile_image_url || null

    await db.prepare(`
      INSERT INTO users (id, clerk_user_id, email, name, avatar_url, is_koby_staff, last_login_at)
      VALUES (?, ?, ?, ?, ?, 0, datetime('now'))
    `).bind(userId, clerkUserId, email, name, avatarUrl).run()

    user = { id: userId, clerk_user_id: clerkUserId, email, name, avatar_url: avatarUrl, is_koby_staff: 0 }
  } else {
    // Update last login
    await db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").bind(user.id).run()
  }

  const isKobyStaff = !!user.is_koby_staff

  // Get user's org memberships from D1
  const memberships = await db.prepare(`
    SELECT um.*, o.name as org_name, o.slug as org_slug, o.status as org_status, o.plan as org_plan
    FROM user_memberships um
    JOIN orgs o ON um.org_id = o.id
    WHERE um.clerk_user_id = ?
    ORDER BY um.created_at ASC
  `).bind(clerkUserId).all()

  const userMemberships = memberships.results || []

  // Determine active org:
  // 1. From query param (if staff or user is member of that org)
  // 2. From user's first membership
  // 3. null (no org)
  let orgId = null
  let orgRole = null

  const requestedOrgId = url.searchParams.get('orgId')

  if (requestedOrgId) {
    // Check if user has access to this org (is member or is staff)
    const membership = userMemberships.find(m => m.org_id === requestedOrgId)
    if (membership || isKobyStaff) {
      orgId = requestedOrgId
      orgRole = membership?.role || (isKobyStaff ? 'admin' : null)
    }
  } else if (userMemberships.length > 0) {
    // Default to first org membership
    orgId = userMemberships[0].org_id
    orgRole = userMemberships[0].role
  }

  return {
    userId: user.id,
    clerkUserId,
    email: user.email,
    name: user.name,
    orgId,
    isKobyStaff,
    orgRole,
    memberships: userMemberships,
  }
}

function isOrgAdmin(auth) {
  const adminRoles = ['org:admin', 'org:client_admin']
  return auth.isKobyStaff || (auth.orgRole && adminRoles.includes(auth.orgRole))
}

// Route handlers
const routes = {
  // GET /portal/overview - Dashboard overview stats
  async getOverview(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    // Get org info
    const org = orgId
      ? await db.prepare('SELECT * FROM orgs WHERE id = ?').bind(orgId).first()
      : null

    // Get sites for org
    const sitesQuery = orgId
      ? db.prepare('SELECT * FROM portal_sites WHERE org_id = ? AND status = ?').bind(orgId, 'active')
      : db.prepare('SELECT * FROM portal_sites WHERE status = ?').bind('active')
    const sites = await sitesQuery.all()

    // Get today's date
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Get metrics
    const metricsQuery = orgId
      ? db.prepare(`
          SELECT 
            SUM(total_sessions) as sessions,
            SUM(total_messages) as messages,
            AVG(avg_latency_ms) as avg_latency,
            SUM(leads_captured) as leads,
            SUM(appointments_booked) as appointments
          FROM metrics_daily 
          WHERE org_id = ? AND date >= ?
        `).bind(orgId, thirtyDaysAgo)
      : db.prepare(`
          SELECT 
            SUM(total_sessions) as sessions,
            SUM(total_messages) as messages,
            AVG(avg_latency_ms) as avg_latency,
            SUM(leads_captured) as leads,
            SUM(appointments_booked) as appointments
          FROM metrics_daily 
          WHERE date >= ?
        `).bind(thirtyDaysAgo)

    const metrics = await metricsQuery.first()

    // Get active sessions count
    const activeSessionsQuery = orgId
      ? db.prepare('SELECT COUNT(*) as count FROM chat_sessions WHERE org_id = ? AND status = ?').bind(orgId, 'active')
      : db.prepare('SELECT COUNT(*) as count FROM chat_sessions WHERE status = ?').bind('active')
    const activeSessions = await activeSessionsQuery.first()

    return jsonResponse({
      org: org || null,
      sites: sites.results || [],
      stats: {
        totalSessions: metrics?.sessions || 0,
        totalMessages: metrics?.messages || 0,
        avgLatency: Math.round(metrics?.avg_latency || 0),
        leadsCapture: metrics?.leads || 0,
        appointmentsBooked: metrics?.appointments || 0,
        activeSessions: activeSessions?.count || 0,
      },
      period: { start: thirtyDaysAgo, end: today },
    })
  },

  // GET /portal/engines - AI engines/sites for org
  async getEngines(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    const query = orgId
      ? db.prepare(`
          SELECT 
            ps.*,
            (SELECT COUNT(*) FROM chat_sessions WHERE site_id = ps.id AND status = 'active') as active_sessions,
            (SELECT COUNT(*) FROM chat_sessions WHERE site_id = ps.id AND date(started_at) = date('now')) as today_sessions
          FROM portal_sites ps
          WHERE ps.org_id = ?
          ORDER BY ps.created_at DESC
        `).bind(orgId)
      : db.prepare(`
          SELECT 
            ps.*,
            o.name as org_name,
            (SELECT COUNT(*) FROM chat_sessions WHERE site_id = ps.id AND status = 'active') as active_sessions,
            (SELECT COUNT(*) FROM chat_sessions WHERE site_id = ps.id AND date(started_at) = date('now')) as today_sessions
          FROM portal_sites ps
          JOIN orgs o ON ps.org_id = o.id
          ORDER BY ps.created_at DESC
        `)

    const sites = await query.all()

    return jsonResponse({
      engines: sites.results.map(site => ({
        id: site.id,
        name: site.name,
        type: site.type,
        domain: site.domain,
        status: site.status,
        activeSessions: site.active_sessions,
        todaySessions: site.today_sessions,
        orgName: site.org_name || null,
        createdAt: site.created_at,
      })),
    })
  },

  // GET /portal/workflows - Automation workflows
  async getWorkflows(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    const flows = orgId
      ? await db.prepare('SELECT * FROM flows WHERE org_id = ? ORDER BY updated_at DESC').bind(orgId).all()
      : await db.prepare(`
          SELECT f.*, o.name as org_name 
          FROM flows f 
          LEFT JOIN orgs o ON f.org_id = o.id 
          ORDER BY f.updated_at DESC
        `).all()

    const flowIds = (flows.results || []).map(f => f.id)
    let runs = { results: [] }
    if (flowIds.length > 0) {
      const placeholders = flowIds.map(() => '?').join(',')
      runs = await db.prepare(`
        SELECT fr.* 
        FROM flow_runs fr 
        WHERE fr.flow_id IN (${placeholders})
        ORDER BY datetime(fr.started_at) DESC
      `).bind(...flowIds).all()
    }

    const lastRunByFlow = {}
    for (const run of runs.results || []) {
      if (!lastRunByFlow[run.flow_id]) {
        lastRunByFlow[run.flow_id] = run
      }
    }

    const workflows = (flows.results || []).map(flow => ({
      id: flow.id,
      name: flow.name,
      lastRun: lastRunByFlow[flow.id]?.started_at || 'N/A',
      outcome: lastRunByFlow[flow.id]?.outcome || 'Not run',
    }))

    return jsonResponse({
      workflows,
      message: workflows.length === 0 ? 'No flows found' : undefined,
    })
  },

  // GET /portal/insights - Analytics and insights
  async getInsights(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Get daily metrics for chart
    const metricsQuery = orgId
      ? db.prepare(`
          SELECT date, total_sessions, total_messages, avg_latency_ms, leads_captured
          FROM metrics_daily 
          WHERE org_id = ? AND date >= ?
          ORDER BY date ASC
        `).bind(orgId, thirtyDaysAgo)
      : db.prepare(`
          SELECT date, SUM(total_sessions) as total_sessions, SUM(total_messages) as total_messages, 
                 AVG(avg_latency_ms) as avg_latency_ms, SUM(leads_captured) as leads_captured
          FROM metrics_daily 
          WHERE date >= ?
          GROUP BY date
          ORDER BY date ASC
        `).bind(thirtyDaysAgo)

    const dailyMetrics = await metricsQuery.all()

    // Get top performing hours (mock for now)
    const peakHours = [
      { hour: 9, sessions: 45 },
      { hour: 10, sessions: 62 },
      { hour: 14, sessions: 58 },
      { hour: 15, sessions: 51 },
    ]

    return jsonResponse({
      dailyMetrics: dailyMetrics.results || [],
      peakHours,
      insights: [
        { type: 'tip', message: 'Response times are 15% faster than last week' },
        { type: 'alert', message: 'Consider adding FAQ responses for common questions' },
      ],
    })
  },

  // GET /portal/team - Team members (from Clerk org)
  async getTeam(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    // Team data comes from Clerk - return placeholder
    return jsonResponse({
      team: [],
      message: 'Team data is managed through Clerk Organizations',
      manageUrl: '/portal/team',
    })
  },

  // GET /portal/knowledge - Knowledge sources/documents/policies
  async getKnowledge(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const orgFilter = orgId ? 'WHERE org_id = ?' : ''
    const sources = orgId
      ? await db.prepare(`SELECT * FROM knowledge_sources ${orgFilter} ORDER BY datetime(updated_at) DESC`).bind(orgId).all()
      : await db.prepare('SELECT * FROM knowledge_sources ORDER BY datetime(updated_at) DESC').all()
    const documents = orgId
      ? await db.prepare(`SELECT * FROM knowledge_documents ${orgFilter} ORDER BY datetime(updated_at) DESC`).bind(orgId).all()
      : await db.prepare('SELECT * FROM knowledge_documents ORDER BY datetime(updated_at) DESC').all()
    const policies = orgId
      ? await db.prepare(`SELECT * FROM knowledge_policies ${orgFilter} ORDER BY datetime(updated_at) DESC`).bind(orgId).all()
      : await db.prepare('SELECT * FROM knowledge_policies ORDER BY datetime(updated_at) DESC').all()
    const jobs = orgId
      ? await db.prepare(`SELECT * FROM knowledge_ingestion_jobs ${orgFilter} ORDER BY datetime(updated_at) DESC LIMIT 25`).bind(orgId).all()
      : await db.prepare('SELECT * FROM knowledge_ingestion_jobs ORDER BY datetime(updated_at) DESC LIMIT 25').all()

    return jsonResponse({
      sources: (sources.results || []).map(mapKnowledgeSource),
      documents: (documents.results || []).map(mapKnowledgeDocument),
      policies: (policies.results || []).map(mapKnowledgePolicy),
      jobs: (jobs.results || []).map(mapKnowledgeJob),
      message: (sources.results || []).length === 0 ? 'No knowledge sources configured' : undefined,
    })
  },

  // POST /portal/knowledge/sources - create a knowledge source
  async createKnowledgeSource(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const body = await request.json()
    const { name, type, config = {}, status = 'connected' } = body

    if (!name || !type) {
      return jsonResponse({ error: 'Name and type are required' }, 400)
    }

    const id = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO knowledge_sources (id, org_id, name, type, status, config, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, orgId, name, type, status, JSON.stringify(config || {}), now, now).run()

    const created = await db.prepare('SELECT * FROM knowledge_sources WHERE id = ?').bind(id).first()
    return jsonResponse({ source: mapKnowledgeSource(created) }, 201)
  },

  // POST /portal/knowledge/documents - create a document under a source
  async createKnowledgeDocument(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const body = await request.json()
    const { sourceId, title, path, externalId, checksum, mimeType, sizeBytes } = body

    if (!sourceId || !title) {
      return jsonResponse({ error: 'Source and title are required' }, 400)
    }

    const source = await db.prepare('SELECT * FROM knowledge_sources WHERE id = ?').bind(sourceId).first()
    if (!source) {
      return jsonResponse({ error: 'Source not found' }, 404)
    }
    if (orgId && source.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const docId = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO knowledge_documents (id, org_id, source_id, title, path, external_id, status, checksum, mime_type, size_bytes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'processing', ?, ?, ?, ?, ?)
    `).bind(docId, source.org_id, sourceId, title, path || null, externalId || null, checksum || null, mimeType || null, sizeBytes || null, now, now).run()

    const created = await db.prepare('SELECT * FROM knowledge_documents WHERE id = ?').bind(docId).first()
    return jsonResponse({ document: mapKnowledgeDocument(created) }, 201)
  },

  // GET /portal/flows - list flows + tests + insights
  async getFlows(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const flows = orgId
      ? await db.prepare('SELECT * FROM flows WHERE org_id = ? ORDER BY datetime(updated_at) DESC').bind(orgId).all()
      : await db.prepare('SELECT * FROM flows ORDER BY datetime(updated_at) DESC').all()

    const flowIds = (flows.results || []).map(f => f.id)
    const tests = flowIds.length > 0
      ? await db.prepare(`SELECT * FROM flow_tests WHERE flow_id IN (${flowIds.map(() => '?').join(',')})`).bind(...flowIds).all()
      : { results: [] }
    const runs = flowIds.length > 0
      ? await db.prepare(`
          SELECT * FROM flow_runs 
          WHERE flow_id IN (${flowIds.map(() => '?').join(',')}) 
          ORDER BY datetime(started_at) DESC
        `).bind(...flowIds).all()
      : { results: [] }

    const insights = (runs.results || []).map(mapFlowRunInsight)
    return jsonResponse({
      flows: (flows.results || []).map(mapFlowRow),
      tests: (tests.results || []).map(mapFlowTest),
      insights,
    })
  },

  // POST /portal/flows - create a new flow with starter step
  async createFlow(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const body = await request.json()
    const { name, description, trigger = { type: 'api', config: {} }, status = 'draft' } = body

    if (!name) {
      return jsonResponse({ error: 'Name is required' }, 400)
    }

    const flowId = generateId()
    const entryStepId = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO flows (id, org_id, name, description, status, trigger, entry_step_id, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).bind(
      flowId,
      orgId,
      name,
      description || null,
      status,
      JSON.stringify(trigger),
      entryStepId,
      now,
      now
    ).run()

    await db.prepare(`
      INSERT INTO flow_steps (id, flow_id, kind, name, config, next_step_id, created_at, updated_at)
      VALUES (?, ?, 'collector', 'Start', '{}', NULL, ?, ?)
    `).bind(entryStepId, flowId, now, now).run()

    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    const steps = await db.prepare('SELECT * FROM flow_steps WHERE flow_id = ?').bind(flowId).all()

    return jsonResponse({ flow: mapFlowRow(flow), steps: (steps.results || []).map(mapFlowStep) }, 201)
  },

  // GET /portal/flows/:id - detail view with steps + rules + tests
  async getFlowDetail(request, env, auth, flowId) {
    const { orgId, isKobyStaff } = auth

    const db = env.DB
    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    if (!flow) {
      return jsonResponse({ error: 'Flow not found' }, 404)
    }
    if (orgId && flow.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const steps = await db.prepare('SELECT * FROM flow_steps WHERE flow_id = ? ORDER BY datetime(created_at) ASC').bind(flowId).all()
    const rules = await db.prepare('SELECT * FROM flow_rules WHERE flow_id = ?').bind(flowId).all()
    const tests = await db.prepare('SELECT * FROM flow_tests WHERE flow_id = ?').bind(flowId).all()
    const policies = await db.prepare('SELECT * FROM knowledge_policies WHERE org_id = ?').bind(flow.org_id).all()

    const preview = {
      flow: mapFlowRow(flow),
      steps: (steps.results || []).map(mapFlowStep),
      rules: (rules.results || []).map(mapFlowRule),
      policies: (policies.results || []).map(mapKnowledgePolicy),
    }

    return jsonResponse({
      flow: mapFlowRow(flow),
      steps: (steps.results || []).map(mapFlowStep),
      rules: (rules.results || []).map(mapFlowRule),
      tests: (tests.results || []).map(mapFlowTest),
      preview,
    })
  },

  // POST /portal/flows/:id/tests - add test case
  async createFlowTest(request, env, auth, flowId) {
    const { orgId, isKobyStaff } = auth
    const db = env.DB

    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    if (!flow) {
      return jsonResponse({ error: 'Flow not found' }, 404)
    }
    if (orgId && flow.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const body = await request.json()
    const { name, input = {}, expectedOutcome } = body
    if (!name || !expectedOutcome) {
      return jsonResponse({ error: 'Name and expectedOutcome are required' }, 400)
    }

    const id = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO flow_tests (id, flow_id, name, input, expected_outcome, last_run_at, last_result)
      VALUES (?, ?, ?, ?, ?, NULL, NULL)
    `).bind(id, flowId, name, JSON.stringify(input || {}), expectedOutcome).run()

    const test = await db.prepare('SELECT * FROM flow_tests WHERE id = ?').bind(id).first()
    return jsonResponse({ test: mapFlowTest(test) }, 201)
  },

  // GET /portal/audit-logs - list recent audit logs
  async getAuditLogs(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const limitParam = parseInt(new URL(request.url).searchParams.get('limit') || '100', 10)
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 500) : 100

    const query = orgId
      ? db.prepare('SELECT * FROM audit_logs WHERE org_id = ? ORDER BY datetime(created_at) DESC LIMIT ?').bind(orgId, limit)
      : db.prepare('SELECT * FROM audit_logs ORDER BY datetime(created_at) DESC LIMIT ?').bind(limit)

    const rows = await query.all()
    return jsonResponse({ logs: (rows.results || []).map(mapAuditLog) })
  },

  // GET /portal/retention - list retention policies
  async getRetentionPolicies(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM retention_policies WHERE org_id = ?').bind(orgId)
      : db.prepare('SELECT * FROM retention_policies')

    const rows = await query.all()
    return jsonResponse({ policies: (rows.results || []).map(mapRetentionPolicy) })
  },

  // POST /portal/retention - upsert retention policy (admin/staff)
  async upsertRetentionPolicy(request, env, auth) {
    const { orgId, isKobyStaff, orgRole } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const adminRoles = ['org:admin', 'org:client_admin']
    if (!isKobyStaff && !adminRoles.includes(orgRole)) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const body = await request.json()
    const { dataType, ttlDays, applyAnonymization = false } = body

    if (!dataType || typeof ttlDays !== 'number' || ttlDays < 0) {
      return jsonResponse({ error: 'dataType and ttlDays (number) are required' }, 400)
    }

    const db = env.DB
    const existing = await db.prepare('SELECT id FROM retention_policies WHERE org_id = ? AND data_type = ?').bind(orgId, dataType).first()
    const now = new Date().toISOString()

    if (existing) {
      await db.prepare(`
        UPDATE retention_policies 
        SET ttl_days = ?, apply_anonymization = ?, updated_at = ?
        WHERE org_id = ? AND data_type = ?
      `).bind(ttlDays, applyAnonymization ? 1 : 0, now, orgId, dataType).run()
    } else {
      await db.prepare(`
        INSERT INTO retention_policies (id, org_id, data_type, ttl_days, apply_anonymization, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(generateId(), orgId, dataType, ttlDays, applyAnonymization ? 1 : 0, now, now).run()
    }

    const policy = await db.prepare('SELECT * FROM retention_policies WHERE org_id = ? AND data_type = ?').bind(orgId, dataType).first()
    return jsonResponse({ policy: mapRetentionPolicy(policy) })
  },

  // GET /portal/clients - Koby staff only: list all clients
  async getClients(request, env, auth) {
    const { isKobyStaff } = auth

    if (!isKobyStaff) {
      return jsonResponse({ error: 'Staff access required' }, 403)
    }

    const db = env.DB

    const clients = await db.prepare(`
      SELECT 
        o.*,
        (SELECT COUNT(*) FROM portal_sites WHERE org_id = o.id) as site_count,
        (SELECT COUNT(*) FROM chat_sessions WHERE org_id = o.id AND date(started_at) = date('now')) as today_sessions,
        (SELECT MAX(started_at) FROM chat_sessions WHERE org_id = o.id) as last_activity
      FROM orgs o
      ORDER BY o.status, o.name
    `).all()

    return jsonResponse({
      clients: clients.results.map(client => ({
        id: client.id,
        name: client.name,
        slug: client.slug,
        status: client.status,
        plan: client.plan,
        siteCount: client.site_count,
        todaySessions: client.today_sessions,
        lastActivity: client.last_activity,
        createdAt: client.created_at,
      })),
    })
  },

  // GET /portal/config - Get org config
  async getConfig(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    const configRow = orgId
      ? await db.prepare('SELECT * FROM portal_config WHERE org_id = ?').bind(orgId).first()
      : null

    if (!configRow && orgId) {
      // Return default config
      return jsonResponse({
        config: {
          orgId,
          branding: { logo_url: null, primary_color: '#f97316', company_name: null },
          enabled_modules: ['overview', 'engines', 'workflows', 'insights', 'team'],
          custom_cards: [],
          settings: {},
          updated_at: new Date().toISOString(),
        },
      })
    }

    return jsonResponse({
      config: mapConfigRow(configRow),
    })
  },

  // PATCH /portal/config - Update org config
  async updateConfig(request, env, auth) {
    const { orgId, isKobyStaff, orgRole } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    // Only staff or client_admin can update config
    const adminRoles = ['org:admin', 'org:client_admin']
    if (!isKobyStaff && !adminRoles.includes(orgRole)) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const db = env.DB
    const body = await request.json()

    const { branding, enabled_modules, custom_cards, settings } = body

    // Check if config exists
    const existing = await db.prepare('SELECT id FROM portal_config WHERE org_id = ?').bind(orgId).first()

    if (existing) {
      // Update existing
      await db.prepare(`
        UPDATE portal_config 
        SET branding = ?, enabled_modules = ?, custom_cards = ?, settings = ?, updated_at = datetime('now')
        WHERE org_id = ?
      `).bind(
        JSON.stringify(branding || {}),
        JSON.stringify(enabled_modules || []),
        JSON.stringify(custom_cards || []),
        JSON.stringify(settings || {}),
        orgId
      ).run()
    } else {
      // Insert new
      await db.prepare(`
        INSERT INTO portal_config (id, org_id, branding, enabled_modules, custom_cards, settings)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        generateId(),
        orgId,
        JSON.stringify(branding || {}),
        JSON.stringify(enabled_modules || []),
        JSON.stringify(custom_cards || []),
        JSON.stringify(settings || {})
      ).run()
    }

    const updatedConfig = await db.prepare('SELECT * FROM portal_config WHERE org_id = ?').bind(orgId).first()

    return jsonResponse({ config: mapConfigRow(updatedConfig) })
  },

  // GET /portal/integrations - Connection health for connected systems
  // Returns IntegrationStatus shape for UI consumption (name, category, status, lastSynced, health, note)
  async getIntegrations(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM integration_connections WHERE org_id = ? ORDER BY updated_at DESC').bind(orgId)
      : db.prepare('SELECT * FROM integration_connections ORDER BY updated_at DESC')

    const rows = await query.all()
    return jsonResponse({
      integrations: (rows.results || []).map(mapIntegrationStatus),
    })
  },

  // GET /outcomes - Outcome events for ROI tracking
  async getOutcomes(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM outcome_events WHERE org_id = ? ORDER BY recorded_at DESC LIMIT 50').bind(orgId)
      : db.prepare('SELECT * FROM outcome_events ORDER BY recorded_at DESC LIMIT 50')

    const rows = await query.all()
    const outcomes = (rows.results || []).map(row => ({
      id: row.id,
      orgId: row.org_id,
      actionRunId: row.action_run_id,
      outcomeType: row.outcome_type,
      label: row.label,
      amountCents: row.amount_cents,
      currency: row.currency,
      recordedAt: row.recorded_at,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    }))

    return jsonResponse({
      outcomes,
      totals: {
        count: outcomes.length,
        amountCents: outcomes.reduce((acc, o) => acc + (o.amountCents || 0), 0),
      },
    })
  },

  // GET /billing/usage - Billing snapshots per org
  async getBillingUsage(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM billing_records WHERE org_id = ? ORDER BY period_start DESC LIMIT 90').bind(orgId)
      : db.prepare('SELECT * FROM billing_records ORDER BY period_start DESC LIMIT 90')

    const rows = await query.all()
    const records = (rows.results || []).map(row => ({
      id: row.id,
      orgId: row.org_id,
      usageType: row.usage_type,
      quantity: row.quantity,
      unitPriceCents: row.unit_price_cents,
      amountCents: row.amount_cents,
      status: row.status,
      periodStart: row.period_start,
      periodEnd: row.period_end,
      externalInvoiceId: row.external_invoice_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))

    const totals = records.reduce((acc, record) => {
      acc.amountCents += record.amountCents || 0
      return acc
    }, { amountCents: 0 })

    return jsonResponse({
      records,
      totals: {
        amountCents: totals.amountCents,
        periodStart: records[0]?.periodStart || null,
        periodEnd: records[0]?.periodEnd || null,
      },
    })
  },

  // GET /portal/events - Recent portal events derived from sessions/messages/actions/outcomes
  async getEvents(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const url = new URL(request.url)
    const siteId = url.searchParams.get('siteId')
    const limitParam = parseInt(url.searchParams.get('limit') || '50', 10)
    const limit = Number.isFinite(limitParam) ? Math.min(limitParam, 200) : 50

    const messageParams = []
    const sessionParams = []

    let messageQuery = `
      SELECT id, org_id, site_id, session_id, role, content, created_at
      FROM chat_messages
    `
    let sessionQuery = `
      SELECT id, org_id, site_id, started_at, ended_at, metadata
      FROM chat_sessions
    `

    const messageWhere = []
    const sessionWhere = []

    if (orgId) {
      messageWhere.push('org_id = ?')
      sessionWhere.push('org_id = ?')
      messageParams.push(orgId)
      sessionParams.push(orgId)
    }

    if (siteId) {
      messageWhere.push('site_id = ?')
      sessionWhere.push('site_id = ?')
      messageParams.push(siteId)
      sessionParams.push(siteId)
    }

    if (messageWhere.length > 0) {
      messageQuery += ` WHERE ${messageWhere.join(' AND ')}`
    }
    if (sessionWhere.length > 0) {
      sessionQuery += ` WHERE ${sessionWhere.join(' AND ')}`
    }

    messageQuery += ' ORDER BY datetime(created_at) DESC LIMIT ?'
    sessionQuery += ' ORDER BY datetime(started_at) DESC LIMIT ?'

    messageParams.push(limit)
    sessionParams.push(limit)

    const messages = await db.prepare(messageQuery).bind(...messageParams).all()
    const sessions = await db.prepare(sessionQuery).bind(...sessionParams).all()

    const events = []

    for (const session of sessions.results || []) {
      events.push({
        id: `${session.id}_start`,
        org_id: session.org_id,
        site_id: session.site_id,
        session_id: session.id,
        type: 'session_started',
        content: null,
        created_at: session.started_at,
        metadata: session.metadata ? JSON.parse(session.metadata) : undefined,
      })

      if (session.ended_at) {
        events.push({
          id: `${session.id}_end`,
          org_id: session.org_id,
          site_id: session.site_id,
          session_id: session.id,
          type: 'session_ended',
          content: null,
          created_at: session.ended_at,
          metadata: session.metadata ? JSON.parse(session.metadata) : undefined,
        })
      }
    }

    for (const message of messages.results || []) {
      events.push({
        id: message.id,
        org_id: message.org_id,
        site_id: message.site_id,
        session_id: message.session_id,
        type: message.role === 'user' ? 'user_message' : 'assistant_message',
        content: redactPII(message.content),
        created_at: message.created_at,
      })
    }

    // Add action run events
    const actionQuery = orgId
      ? db.prepare('SELECT id, org_id, action_id, status, created_at, completed_at FROM action_runs WHERE org_id = ? ORDER BY created_at DESC LIMIT ?').bind(orgId, limit)
      : db.prepare('SELECT id, org_id, action_id, status, created_at, completed_at FROM action_runs ORDER BY created_at DESC LIMIT ?').bind(limit)
    const actionRuns = await actionQuery.all()
    for (const run of actionRuns.results || []) {
      events.push({
        id: `${run.id}_action`,
        org_id: run.org_id,
        site_id: '',
        session_id: '',
        type: 'action_run',
        content: `Action ${run.action_id} ${run.status}`,
        created_at: run.completed_at || run.created_at,
      })
    }

    // Add outcome events
    const outcomeQuery = orgId
      ? db.prepare('SELECT id, org_id, outcome_type, label, recorded_at FROM outcome_events WHERE org_id = ? ORDER BY recorded_at DESC LIMIT ?').bind(orgId, limit)
      : db.prepare('SELECT id, org_id, outcome_type, label, recorded_at FROM outcome_events ORDER BY recorded_at DESC LIMIT ?').bind(limit)
    const outcomeRows = await outcomeQuery.all()
    for (const outcome of outcomeRows.results || []) {
      events.push({
        id: `${outcome.id}_outcome`,
        org_id: outcome.org_id,
        site_id: '',
        session_id: '',
        type: 'outcome_recorded',
        content: redactPII(outcome.label || outcome.outcome_type),
        created_at: outcome.recorded_at,
      })
    }

    const sortedEvents = events
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)

    return jsonResponse({ events: sortedEvents })
  },

  // POST /integrations - create or update integration connection
  async upsertIntegration(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    if (!isOrgAdmin(auth)) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const body = await request.json()
    const {
      connector,
      status = 'connected',
      credentials = {},
      expiresAt = null,
      healthStatus = 'healthy',
      healthDetail = null,
    } = body

    if (!connector) {
      return jsonResponse({ error: 'Missing connector' }, 400)
    }

    const db = env.DB
    const now = new Date().toISOString()
    const existing = await db.prepare('SELECT id FROM integration_connections WHERE org_id = ? AND connector = ?').bind(orgId, connector).first()

    let id = existing?.id

    if (existing) {
      await db.prepare(`
        UPDATE integration_connections
        SET status = ?, credentials = ?, expires_at = ?, health_status = ?, health_detail = ?, last_refreshed_at = ?, updated_at = datetime('now')
        WHERE org_id = ? AND connector = ?
      `).bind(
        status,
        JSON.stringify(credentials || {}),
        expiresAt,
        healthStatus,
        healthDetail,
        now,
        orgId,
        connector
      ).run()
    } else {
      id = generateId()
      await db.prepare(`
        INSERT INTO integration_connections (id, org_id, connector, status, credentials, expires_at, health_status, health_detail, last_refreshed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        orgId,
        connector,
        status,
        JSON.stringify(credentials || {}),
        expiresAt,
        healthStatus,
        healthDetail,
        now
      ).run()
    }

    return jsonResponse({
      integration: {
        id,
        orgId,
        connector,
        status,
        credentials,
        expiresAt,
        healthStatus,
        healthDetail,
        lastRefreshedAt: now,
        updatedAt: now,
        createdAt: now,
      },
    }, existing ? 200 : 201)
  },

  // DELETE /integrations/:id - remove integration connection
  async deleteIntegration(request, env, auth, integrationId) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    if (!isOrgAdmin(auth)) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const db = env.DB
    const result = await db.prepare('DELETE FROM integration_connections WHERE id = ? AND (org_id = ? OR ? = 1)').bind(integrationId, orgId, isKobyStaff ? 1 : 0).run()

    if (result.success === false) {
      return jsonResponse({ error: 'Delete failed' }, 400)
    }

    return jsonResponse({ success: true })
  },

  // GET /actions/runs - list recent action runs
  async listActionRuns(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM action_runs WHERE org_id = ? ORDER BY created_at DESC LIMIT 50').bind(orgId)
      : db.prepare('SELECT * FROM action_runs ORDER BY created_at DESC LIMIT 50')

    const rows = await query.all()
    return jsonResponse({
      runs: (rows.results || []).map(row => ({
        id: row.id,
        actionId: row.action_id,
        orgId: row.org_id,
        status: row.status,
        attempt: row.attempt,
        maxRetries: row.max_retries,
        retryPolicy: row.retry_policy,
        triggerSource: row.trigger_source,
        idempotencyKey: row.idempotency_key,
        flowId: row.flow_id,
        flowRunId: row.flow_run_id,
        input: row.input ? JSON.parse(row.input) : {},
        output: row.output ? JSON.parse(row.output) : null,
        error: row.error,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        nextRetryAt: row.next_retry_at,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        createdAt: row.created_at,
      })),
    })
  },

  // GET /actions/queue - claim ready action runs (pending or due for retry)
  async claimActionRuns(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const url = new URL(request.url)
    const limitParam = parseInt(url.searchParams.get('limit') || '10', 10)
    const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 25)) : 10

    const db = env.DB
    const nowIso = new Date().toISOString()

    const rows = await (orgId
      ? db.prepare(`
          SELECT * FROM action_runs
          WHERE (status = 'pending' OR (status = 'failed' AND (next_retry_at IS NULL OR next_retry_at <= ?)))
            AND attempt < max_retries
            AND org_id = ?
          ORDER BY COALESCE(next_retry_at, created_at) ASC
          LIMIT ?
        `).bind(nowIso, orgId, limit).all()
      : db.prepare(`
          SELECT * FROM action_runs
          WHERE (status = 'pending' OR (status = 'failed' AND (next_retry_at IS NULL OR next_retry_at <= ?)))
            AND attempt < max_retries
          ORDER BY COALESCE(next_retry_at, created_at) ASC
          LIMIT ?
        `).bind(nowIso, limit).all())

    const claimed = []

    for (const row of rows.results || []) {
      const update = await db.prepare(`
        UPDATE action_runs
        SET status = 'running',
            attempt = attempt + 1,
            started_at = COALESCE(started_at, ?),
            next_retry_at = NULL
        WHERE id = ? AND status IN ('pending', 'failed')
      `).bind(nowIso, row.id).run()

      if (update.success === false) continue

      // Fetch the latest row after update
      const updated = await db.prepare('SELECT * FROM action_runs WHERE id = ?').bind(row.id).first()
      claimed.push({
        id: updated.id,
        actionId: updated.action_id,
        orgId: updated.org_id,
        status: updated.status,
        attempt: updated.attempt,
        maxRetries: updated.max_retries,
        retryPolicy: updated.retry_policy,
        triggerSource: updated.trigger_source,
        idempotencyKey: updated.idempotency_key,
        flowId: updated.flow_id,
        input: updated.input ? JSON.parse(updated.input) : {},
        output: updated.output ? JSON.parse(updated.output) : null,
        error: updated.error,
        startedAt: updated.started_at,
        completedAt: updated.completed_at,
        nextRetryAt: updated.next_retry_at,
        metadata: updated.metadata ? JSON.parse(updated.metadata) : {},
        createdAt: updated.created_at,
      })
    }

    return jsonResponse({ runs: claimed })
  },

  // PATCH /actions/:id/run/:runId - update action run status/output
  async updateActionRun(request, env, auth, actionId, runId) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const body = await request.json()
    const {
      status,
      output,
      error,
      attempt,
      nextRetryAt,
      startedAt,
      completedAt,
      metadata,
      outcome,
    } = body

    if (!status) {
      return jsonResponse({ error: 'Missing status' }, 400)
    }

    const db = env.DB
    const run = await db.prepare('SELECT * FROM action_runs WHERE id = ? AND action_id = ?').bind(runId, actionId).first()

    if (!run) {
      return jsonResponse({ error: 'Run not found' }, 404)
    }

    if (orgId && run.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    await db.prepare(`
      UPDATE action_runs
      SET status = ?, output = COALESCE(?, output), error = COALESCE(?, error),
          attempt = COALESCE(?, attempt), next_retry_at = COALESCE(?, next_retry_at),
          started_at = COALESCE(?, started_at), completed_at = COALESCE(?, completed_at),
          metadata = COALESCE(?, metadata), last_error_at = CASE WHEN ? IS NOT NULL THEN datetime('now') ELSE last_error_at END
      WHERE id = ? AND action_id = ?
    `).bind(
      status,
      output ? JSON.stringify(output) : null,
      error || null,
      attempt || null,
      nextRetryAt || null,
      startedAt || null,
      completedAt || null,
      metadata ? JSON.stringify(metadata) : null,
      error || null,
      runId,
      actionId
    ).run()

    // Write audit log
    await db.prepare(`
      INSERT INTO audit_logs (id, org_id, actor_type, actor_id, event_type, target_type, target_id, metadata)
      VALUES (?, ?, 'system', ?, 'action_run.updated', 'action_run', ?, ?)
    `).bind(
      generateId(),
      run.org_id,
      auth.userId || 'system',
      runId,
      JSON.stringify({ status, error: error || null })
    ).run()

    if (status === 'succeeded' && outcome) {
      const outcomeId = generateId()
      await db.prepare(`
        INSERT INTO outcome_events (id, org_id, action_run_id, outcome_type, label, amount_cents, currency, recorded_at, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        outcomeId,
        run.org_id,
        runId,
        outcome.type || 'action_completed',
        outcome.label || null,
        outcome.amountCents || 0,
        outcome.currency || 'USD',
        new Date().toISOString(),
        JSON.stringify(outcome.metadata || {})
      ).run()
    }

    const updated = await db.prepare('SELECT * FROM action_runs WHERE id = ?').bind(runId).first()

    return jsonResponse({
      run: {
        id: updated.id,
        actionId: updated.action_id,
        orgId: updated.org_id,
        status: updated.status,
        attempt: updated.attempt,
        maxRetries: updated.max_retries,
        retryPolicy: updated.retry_policy,
        triggerSource: updated.trigger_source,
        idempotencyKey: updated.idempotency_key,
        flowId: updated.flow_id,
        input: updated.input ? JSON.parse(updated.input) : {},
        output: updated.output ? JSON.parse(updated.output) : null,
        error: updated.error,
        startedAt: updated.started_at,
        completedAt: updated.completed_at,
        nextRetryAt: updated.next_retry_at,
        metadata: updated.metadata ? JSON.parse(updated.metadata) : {},
        createdAt: updated.created_at,
      },
    })
  },

  // GET /audit/logs - list audit logs
  async getAuditLogs(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM audit_logs WHERE org_id = ? ORDER BY created_at DESC LIMIT 200').bind(orgId)
      : db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200')

    const rows = await query.all()
    return jsonResponse({
      logs: (rows.results || []).map(row => ({
        id: row.id,
        orgId: row.org_id,
        actorType: row.actor_type,
        actorId: row.actor_id,
        eventType: row.event_type,
        targetType: row.target_type,
        targetId: row.target_id,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        createdAt: row.created_at,
      })),
    })
  },

  // GET /retention/policies - list retention policies
  async getRetentionPolicies(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM retention_policies WHERE org_id = ? ORDER BY data_type ASC').bind(orgId)
      : db.prepare('SELECT * FROM retention_policies ORDER BY data_type ASC')

    const rows = await query.all()
    return jsonResponse({
      policies: (rows.results || []).map(row => ({
        id: row.id,
        orgId: row.org_id,
        dataType: row.data_type,
        ttlDays: row.ttl_days,
        applyAnonymization: row.apply_anonymization === 1,
        enforcedAt: row.enforced_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    })
  },

  // PUT /retention/policies - upsert retention policies
  async upsertRetentionPolicy(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    if (!isOrgAdmin(auth)) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const body = await request.json()
    const { dataType, ttlDays, applyAnonymization = false, enforcedAt = null } = body

    if (!dataType || !ttlDays) {
      return jsonResponse({ error: 'Missing dataType or ttlDays' }, 400)
    }

    const db = env.DB
    const existing = await db.prepare('SELECT id FROM retention_policies WHERE org_id = ? AND data_type = ?').bind(orgId, dataType).first()
    const now = new Date().toISOString()
    let id = existing?.id || generateId()

    if (existing) {
      await db.prepare(`
        UPDATE retention_policies
        SET ttl_days = ?, apply_anonymization = ?, enforced_at = ?, updated_at = datetime('now')
        WHERE org_id = ? AND data_type = ?
      `).bind(ttlDays, applyAnonymization ? 1 : 0, enforcedAt, orgId, dataType).run()
    } else {
      await db.prepare(`
        INSERT INTO retention_policies (id, org_id, data_type, ttl_days, apply_anonymization, enforced_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, orgId, dataType, ttlDays, applyAnonymization ? 1 : 0, enforcedAt, now, now).run()
    }

    return jsonResponse({
      policy: {
        id,
        orgId,
        dataType,
        ttlDays,
        applyAnonymization,
        enforcedAt,
        updatedAt: now,
      },
    }, existing ? 200 : 201)
  },

  // GET /actions - list action definitions
  async getActions(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM action_definitions WHERE org_id = ? ORDER BY created_at DESC').bind(orgId)
      : db.prepare('SELECT * FROM action_definitions ORDER BY created_at DESC')

    const rows = await query.all()
    return jsonResponse({
      actions: (rows.results || []).map(row => ({
        id: row.id,
        orgId: row.org_id,
        key: row.key,
        name: row.name,
        description: row.description,
        version: row.version,
        handlerUrl: row.handler_url,
        timeoutMs: row.timeout_ms,
        retryPolicy: row.retry_policy,
        maxRetries: row.max_retries,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    })
  },

  // GET /portal/knowledge/policies - list knowledge policies
  async getKnowledgePolicies(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const query = orgId
      ? db.prepare('SELECT * FROM knowledge_policies WHERE org_id = ? ORDER BY name ASC').bind(orgId)
      : db.prepare('SELECT * FROM knowledge_policies ORDER BY name ASC')

    const rows = await query.all()
    return jsonResponse({
      policies: (rows.results || []).map(mapKnowledgePolicy),
    })
  },

  // POST /portal/knowledge/policies - create knowledge policy
  async createKnowledgePolicy(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const body = await request.json()
    const { name, description, rules = [] } = body

    if (!name) {
      return jsonResponse({ error: 'Name is required' }, 400)
    }

    const db = env.DB
    const id = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO knowledge_policies (id, org_id, name, description, rules, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, orgId, name, description || null, JSON.stringify(rules), now, now).run()

    const policy = await db.prepare('SELECT * FROM knowledge_policies WHERE id = ?').bind(id).first()
    return jsonResponse({ policy: mapKnowledgePolicy(policy) }, 201)
  },

  // GET /portal/knowledge/versions - list versions for a document
  async getKnowledgeVersions(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const url = new URL(request.url)
    const documentId = url.searchParams.get('documentId')

    if (!documentId) {
      return jsonResponse({ error: 'documentId is required' }, 400)
    }

    const db = env.DB

    // Verify document belongs to org
    const doc = await db.prepare('SELECT * FROM knowledge_documents WHERE id = ?').bind(documentId).first()
    if (!doc) {
      return jsonResponse({ error: 'Document not found' }, 404)
    }
    if (orgId && doc.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const versions = await db.prepare(
      'SELECT * FROM knowledge_versions WHERE document_id = ? ORDER BY version_number DESC'
    ).bind(documentId).all()

    return jsonResponse({
      versions: (versions.results || []).map(row => ({
        id: row.id,
        documentId: row.document_id,
        orgId: row.org_id,
        versionNumber: row.version_number,
        stage: row.stage || 'draft',
        is_live: row.is_live === 1,
        checksum: row.checksum,
        chunkCount: row.chunk_count,
        tokenCount: row.token_count,
        createdAt: row.created_at,
        createdBy: row.created_by,
        changeNote: row.change_note,
      })),
    })
  },

  // GET /portal/knowledge/chunks - list chunks for a version
  async getKnowledgeChunks(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const url = new URL(request.url)
    const versionId = url.searchParams.get('versionId')

    if (!versionId) {
      return jsonResponse({ error: 'versionId is required' }, 400)
    }

    const db = env.DB

    // Verify version belongs to org
    const version = await db.prepare('SELECT * FROM knowledge_versions WHERE id = ?').bind(versionId).first()
    if (!version) {
      return jsonResponse({ error: 'Version not found' }, 404)
    }
    if (orgId && version.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const chunks = await db.prepare(
      'SELECT * FROM knowledge_chunks WHERE version_id = ? ORDER BY page_label ASC'
    ).bind(versionId).all()

    return jsonResponse({
      chunks: (chunks.results || []).map(row => ({
        id: row.id,
        versionId: row.version_id,
        orgId: row.org_id,
        content: row.content,
        tokenCount: row.token_count,
        pageLabel: row.page_label,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
      })),
    })
  },

  // POST /portal/flows/:id/run - trigger flow runtime
  async runFlow(request, env, auth, flowId) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    if (!flow) {
      return jsonResponse({ error: 'Flow not found' }, 404)
    }
    if (orgId && flow.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const body = await request.json().catch(() => ({}))
    const now = new Date()
    const runId = generateId()

    await db.prepare(`
      INSERT INTO flow_runs (id, flow_id, org_id, started_at, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(runId, flowId, flow.org_id, now.toISOString(), JSON.stringify(body || {})).run()

    let actionRunId = null
    let outcomeEventId = null

    const steps = await db.prepare('SELECT * FROM flow_steps WHERE flow_id = ?').bind(flowId).all()
    const actionStep = (steps.results || []).find(step => step.kind === 'action')
    if (actionStep) {
      const stepConfig = actionStep.config ? JSON.parse(actionStep.config) : {}
      const actionKey = stepConfig.actionKey || stepConfig.key
      if (actionKey) {
        const actionDef = await db.prepare('SELECT * FROM action_definitions WHERE org_id = ? AND key = ?').bind(flow.org_id, actionKey).first()
        if (actionDef) {
          const actionRun = generateId()
          await db.prepare(`
            INSERT INTO action_runs (id, action_id, org_id, status, attempt, max_retries, retry_policy, trigger_source, flow_id, flow_run_id, input, metadata, created_at)
            VALUES (?, ?, ?, 'pending', 0, ?, ?, 'flow', ?, ?, ?, ?, ?)
          `).bind(
            actionRun,
            actionDef.id,
            flow.org_id,
            actionDef.max_retries || 3,
            actionDef.retry_policy || 'fixed',
            flowId,
            runId,
            JSON.stringify(body || {}),
            JSON.stringify({ flowName: flow.name, stepId: actionStep.id }),
            now.toISOString()
          ).run()
          actionRunId = actionRun
        }
      }
    }

    if (actionRunId) {
      outcomeEventId = generateId()
      await db.prepare(`
        INSERT INTO outcome_events (id, org_id, action_run_id, outcome_type, label, amount_cents, currency, recorded_at, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        outcomeEventId,
        flow.org_id,
        actionRunId,
        'flow_triggered',
        `Flow ${flow.name} queued action`,
        null,
        'USD',
        now.toISOString(),
        JSON.stringify({ flowId, actionRunId })
      ).run()
    }

    const durationMs = 10
    const outcome = actionRunId ? 'success' : 'failed'

    await db.prepare(`
      UPDATE flow_runs
      SET outcome = ?, duration_ms = ?
      WHERE id = ?
    `).bind(outcome, durationMs, runId).run()

    const runRow = await db.prepare('SELECT * FROM flow_runs WHERE id = ?').bind(runId).first()

    return jsonResponse({
      run: {
        id: runRow.id,
        flowId: runRow.flow_id,
        orgId: runRow.org_id,
        startedAt: runRow.started_at,
        durationMs: runRow.duration_ms,
        outcome: runRow.outcome,
        triggeredPolicyIds: runRow.triggered_policy_ids ? JSON.parse(runRow.triggered_policy_ids) : [],
        metadata: runRow.metadata ? JSON.parse(runRow.metadata) : {},
        actionRunId,
        outcomeEventId,
      },
    }, 201)
  },

  // POST /portal/knowledge/retrieve - simple retrieval with citations
  async retrieveKnowledge(request, env, auth) {
    const { orgId, isKobyStaff } = auth
    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    let body = {}
    try {
      body = await request.json()
    } catch (err) {
      body = {}
    }

    const url = new URL(request.url)
    const query = body.query || url.searchParams.get('q')
    const limitParam = body.limit || url.searchParams.get('limit') || 5
    const limit = Math.min(parseInt(limitParam, 10) || 5, 20)

    if (!query) {
      return jsonResponse({ error: 'query is required' }, 400)
    }

    const db = env.DB
    const embeddingsRows = orgId
      ? await db.prepare(`
          SELECT ke.vector, ke.model, ke.chunk_id, ke.version_id, kv.stage, kv.is_live,
                 kc.content, kc.page_label, kc.metadata, kc.token_count,
                 kd.id as document_id, kd.source_id,
                 ks.name as source_name
          FROM knowledge_embeddings ke
          JOIN knowledge_chunks kc ON kc.id = ke.chunk_id
          JOIN knowledge_versions kv ON kv.id = kc.version_id
          JOIN knowledge_documents kd ON kd.id = kv.document_id
          JOIN knowledge_sources ks ON ks.id = kd.source_id
          WHERE ke.org_id = ?
          LIMIT 200
        `).bind(orgId).all()
      : await db.prepare(`
          SELECT ke.vector, ke.model, ke.chunk_id, ke.version_id, kv.stage, kv.is_live,
                 kc.content, kc.page_label, kc.metadata, kc.token_count,
                 kd.id as document_id, kd.source_id,
                 ks.name as source_name
          FROM knowledge_embeddings ke
          JOIN knowledge_chunks kc ON kc.id = ke.chunk_id
          JOIN knowledge_versions kv ON kv.id = kc.version_id
          JOIN knowledge_documents kd ON kd.id = kv.document_id
          JOIN knowledge_sources ks ON ks.id = kd.source_id
          LIMIT 200
        `).all()

    const embedText = (text) => {
      const tokens = (text || '').toLowerCase().split(/\s+/).filter(Boolean)
      const vec = Array(8).fill(0)
      tokens.forEach((tok, idx) => {
        const code = Array.from(tok).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
        vec[idx % vec.length] += code
      })
      const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1
      return vec.map(v => v / norm)
    }

    const queryVec = embedText(query)

    const cosine = (a, b) => {
      const len = Math.min(a.length, b.length)
      let dot = 0
      let na = 0
      let nb = 0
      for (let i = 0; i < len; i++) {
        dot += a[i] * b[i]
        na += a[i] * a[i]
        nb += b[i] * b[i]
      }
      if (na === 0 || nb === 0) return 0
      return dot / Math.sqrt(na * nb)
    }

    const scored = (embeddingsRows.results || []).map((row) => {
      const vector = Array.isArray(row.vector) ? row.vector : (() => {
        try {
          const parsed = JSON.parse(row.vector || '[]')
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      })()
      const score = cosine(queryVec, vector)
      return { ...row, score }
    }).sort((a, b) => b.score - a.score)

    const limited = scored.slice(0, limit)

    // Fallback to LIKE if no embeddings
    let results = []
    if (limited.length === 0) {
      const likeParam = `%${query}%`
      const rows = orgId
        ? await db.prepare(`
            SELECT kc.id as chunk_id, kc.content, kc.token_count, kc.page_label, kc.metadata,
                   kv.id as version_id, kv.stage, kv.is_live,
                   kd.id as document_id, kd.source_id,
                   ks.name as source_name
            FROM knowledge_chunks kc
            JOIN knowledge_versions kv ON kc.version_id = kv.id
            JOIN knowledge_documents kd ON kv.document_id = kd.id
            JOIN knowledge_sources ks ON kd.source_id = ks.id
            WHERE kc.content LIKE ? AND kc.org_id = ?
            ORDER BY datetime(kv.created_at) DESC, kv.version_number DESC, kc.rowid DESC
            LIMIT ?
          `).bind(likeParam, orgId, limit).all()
        : await db.prepare(`
            SELECT kc.id as chunk_id, kc.content, kc.token_count, kc.page_label, kc.metadata,
                   kv.id as version_id, kv.stage, kv.is_live,
                   kd.id as document_id, kd.source_id,
                   ks.name as source_name
            FROM knowledge_chunks kc
            JOIN knowledge_versions kv ON kc.version_id = kv.id
            JOIN knowledge_documents kd ON kv.document_id = kd.id
            JOIN knowledge_sources ks ON kd.source_id = ks.id
            WHERE kc.content LIKE ?
            ORDER BY datetime(kv.created_at) DESC, kv.version_number DESC, kc.rowid DESC
            LIMIT ?
          `).bind(likeParam, limit).all()

      results = (rows.results || []).map((row, index) => ({
        chunkId: row.chunk_id,
        documentId: row.document_id,
        sourceId: row.source_id,
        versionId: row.version_id,
        content: row.content,
        score: Math.max(0, 1 - index * 0.05),
        citations: [{
          chunk_id: row.chunk_id,
          source_id: row.source_id,
          version_id: row.version_id,
          pointer: row.page_label || undefined,
        }],
        policiesTriggered: [],
      }))
    } else {
      results = limited.map((row) => ({
        chunkId: row.chunk_id,
        documentId: row.document_id,
        sourceId: row.source_id,
        versionId: row.version_id,
        content: row.content,
        score: row.score,
        citations: [{
          chunk_id: row.chunk_id,
          source_id: row.source_id,
          version_id: row.version_id,
          pointer: row.page_label || undefined,
        }],
        policiesTriggered: [],
      }))
    }

    return jsonResponse({
      query,
      results,
    })
  },

  // PATCH /portal/flows/:id - update flow status, trigger, description
  async updateFlow(request, env, auth, flowId) {
    const { orgId, isKobyStaff } = auth

    const db = env.DB
    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    if (!flow) {
      return jsonResponse({ error: 'Flow not found' }, 404)
    }
    if (orgId && flow.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const body = await request.json()
    const { status, trigger, description, name } = body

    const updates = []
    const params = []

    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (trigger !== undefined) {
      updates.push('trigger = ?')
      params.push(JSON.stringify(trigger))
    }
    if (description !== undefined) {
      updates.push('description = ?')
      params.push(description)
    }
    if (name !== undefined) {
      updates.push('name = ?')
      params.push(name)
    }

    if (updates.length === 0) {
      return jsonResponse({ error: 'No fields to update' }, 400)
    }

    updates.push("updated_at = datetime('now')")
    params.push(flowId)

    await db.prepare(`UPDATE flows SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run()

    const updated = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    return jsonResponse({ flow: mapFlowRow(updated) })
  },

  // POST /portal/flows/:id/steps - add step to flow
  async createFlowStep(request, env, auth, flowId) {
    const { orgId, isKobyStaff } = auth

    const db = env.DB
    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    if (!flow) {
      return jsonResponse({ error: 'Flow not found' }, 404)
    }
    if (orgId && flow.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const body = await request.json()
    const { kind, name, config = {}, nextStepId = null } = body

    if (!kind || !name) {
      return jsonResponse({ error: 'kind and name are required' }, 400)
    }

    const id = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO flow_steps (id, flow_id, kind, name, config, next_step_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, flowId, kind, name, JSON.stringify(config), nextStepId, now, now).run()

    const step = await db.prepare('SELECT * FROM flow_steps WHERE id = ?').bind(id).first()
    return jsonResponse({ step: mapFlowStep(step) }, 201)
  },

  // POST /portal/flows/:id/rules - add rule to flow
  async createFlowRule(request, env, auth, flowId) {
    const { orgId, isKobyStaff } = auth

    const db = env.DB
    const flow = await db.prepare('SELECT * FROM flows WHERE id = ?').bind(flowId).first()
    if (!flow) {
      return jsonResponse({ error: 'Flow not found' }, 404)
    }
    if (orgId && flow.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const body = await request.json()
    const { stepId, condition, action, targetStepId = null } = body

    if (!condition || !action) {
      return jsonResponse({ error: 'condition and action are required' }, 400)
    }

    const id = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO flow_rules (id, flow_id, step_id, condition, action, target_step_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, flowId, stepId || null, condition, action, targetStepId, now, now).run()

    const rule = await db.prepare('SELECT * FROM flow_rules WHERE id = ?').bind(id).first()
    return jsonResponse({ rule: mapFlowRule(rule) }, 201)
  },

  // POST /actions - register a new action definition
  async registerAction(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const body = await request.json()
    const {
      key,
      name,
      description,
      handlerUrl,
      retryPolicy = 'fixed',
      maxRetries = 3,
      timeoutMs = 30000,
      metadata = {},
    } = body

    if (!key || !name) {
      return jsonResponse({ error: 'Missing key or name' }, 400)
    }

    const db = env.DB

    const id = generateId()
    const now = new Date().toISOString()

    await db.prepare(`
      INSERT INTO action_definitions (id, org_id, key, name, description, version, handler_url, timeout_ms, retry_policy, max_retries, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'v1', ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      orgId,
      key,
      name,
      description || null,
      handlerUrl || null,
      timeoutMs,
      retryPolicy,
      maxRetries,
      JSON.stringify(metadata || {}),
      now,
      now
    ).run()

    return jsonResponse({
      action: {
        id,
        orgId,
        key,
        name,
        description: description || null,
        version: 'v1',
        handlerUrl: handlerUrl || null,
        timeoutMs,
        retryPolicy,
        maxRetries,
        metadata,
        createdBy: auth.userId,
        createdAt: now,
        updatedAt: now,
      },
    }, 201)
  },

  // POST /actions/:id/run - enqueue an action run with idempotency
  async enqueueActionRun(request, env, auth, actionId) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    // Ensure action exists for this org
    const action = await db.prepare('SELECT * FROM action_definitions WHERE id = ? AND org_id = ?').bind(actionId, orgId).first()
    if (!action) {
      return jsonResponse({ error: 'Action not found' }, 404)
    }

    const body = await request.json()
    const {
      idempotencyKey,
      input = {},
      triggerSource = 'flow',
      flowId = null,
      retryPolicy = action.retry_policy || 'fixed',
      maxRetries = action.max_retries || 3,
      metadata = {},
    } = body

    if (idempotencyKey) {
      const existing = await db.prepare('SELECT * FROM action_runs WHERE org_id = ? AND idempotency_key = ?').bind(orgId, idempotencyKey).first()
      if (existing) {
        return jsonResponse({
          run: {
            id: existing.id,
            actionId: existing.action_id,
            orgId: existing.org_id,
            status: existing.status,
            attempt: existing.attempt,
            maxRetries: existing.max_retries,
            retryPolicy: existing.retry_policy,
            triggerSource: existing.trigger_source,
            idempotencyKey: existing.idempotency_key,
            flowId: existing.flow_id,
            input: JSON.parse(existing.input || '{}'),
            output: existing.output ? JSON.parse(existing.output) : null,
            error: existing.error,
            startedAt: existing.started_at,
            completedAt: existing.completed_at,
            nextRetryAt: existing.next_retry_at,
            metadata: existing.metadata ? JSON.parse(existing.metadata) : {},
            createdAt: existing.created_at,
          },
        }, 200)
      }
    }

    const now = new Date().toISOString()
    const runId = generateId()

    await db.prepare(`
      INSERT INTO action_runs (
        id, action_id, org_id, status, attempt, max_retries, retry_policy, trigger_source, idempotency_key,
        flow_id, input, metadata, created_at
      )
      VALUES (?, ?, ?, 'pending', 0, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      runId,
      actionId,
      orgId,
      maxRetries,
      retryPolicy,
      triggerSource,
      idempotencyKey || null,
      flowId,
      JSON.stringify(input || {}),
      JSON.stringify(metadata || {}),
      now
    ).run()

    return jsonResponse({
      run: {
        id: runId,
        actionId,
        orgId,
        status: 'pending',
        attempt: 0,
        maxRetries,
        retryPolicy,
        triggerSource,
        idempotencyKey: idempotencyKey || null,
        flowId,
        input,
        metadata,
        createdAt: now,
      },
    }, 202)
  },

  // POST /webhooks/:connector - ingest integration webhooks
  async ingestWebhook(request, env, auth, connector) {
    const { orgId, isKobyStaff } = auth

    // org optional for staff webhooks; otherwise required
    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const body = await request.json()
    const signature = request.headers.get('x-signature')
    const secret = env.WEBHOOK_SHARED_SECRET

    const signatureValid = secret ? signature === secret : true
    const now = new Date().toISOString()
    const eventId = generateId()

    await db.prepare(`
      INSERT INTO webhook_events (
        id, org_id, connector, event_type, status, payload, headers, signature_valid, received_at
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `).bind(
      eventId,
      orgId || null,
      connector,
      body?.type || 'unknown',
      JSON.stringify(body || {}),
      JSON.stringify(Object.fromEntries(request.headers) || {}),
      signatureValid ? 1 : 0,
      now
    ).run()

    return jsonResponse({ received: true, eventId }, 202)
  },

  // =============================================================================
  // Stripe Billing Endpoints (Agent 3: Subscription Architecture)
  // =============================================================================

  // GET /billing/overview - Get billing overview for org (customer, subscriptions, invoices)
  async getBillingOverview(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    // Get billing customer
    const customer = await db.prepare(
      'SELECT * FROM billing_customers WHERE org_id = ?'
    ).bind(orgId).first()

    // Get active subscriptions
    const subscriptions = await db.prepare(`
      SELECT * FROM billing_subscriptions 
      WHERE org_id = ? AND status NOT IN ('canceled', 'incomplete_expired')
      ORDER BY created_at DESC
    `).bind(orgId).all()

    // Get recent invoices (last 10)
    const invoices = await db.prepare(`
      SELECT * FROM billing_invoices 
      WHERE org_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(orgId).all()

    // Determine current plan from active subscription
    const activeSubscription = (subscriptions.results || []).find(
      s => s.status === 'active' || s.status === 'trialing'
    )

    return jsonResponse({
      customer: customer ? mapBillingCustomer(customer) : null,
      subscriptions: (subscriptions.results || []).map(mapBillingSubscription),
      currentPlan: activeSubscription ? {
        name: activeSubscription.plan_nickname || 'Standard Plan',
        status: activeSubscription.status,
        currentPeriodEnd: activeSubscription.current_period_end,
        cancelAtPeriodEnd: !!activeSubscription.cancel_at_period_end,
      } : null,
      upcomingInvoice: null, // Would require Stripe API call for upcoming invoice
      recentInvoices: (invoices.results || []).map(mapBillingInvoice),
    })
  },

  // GET /billing/subscriptions - List all subscriptions for org
  async getBillingSubscriptions(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const subscriptions = await db.prepare(`
      SELECT * FROM billing_subscriptions 
      WHERE org_id = ?
      ORDER BY created_at DESC
    `).bind(orgId).all()

    return jsonResponse({
      subscriptions: (subscriptions.results || []).map(mapBillingSubscription),
    })
  },

  // GET /billing/invoices - List invoices for org
  async getBillingInvoices(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '25', 10), 100)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const status = url.searchParams.get('status')

    const db = env.DB
    let query = 'SELECT * FROM billing_invoices WHERE org_id = ?'
    const params = [orgId]

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const invoices = await db.prepare(query).bind(...params).all()

    // Count total for pagination
    const countQuery = status
      ? db.prepare('SELECT COUNT(*) as count FROM billing_invoices WHERE org_id = ? AND status = ?').bind(orgId, status)
      : db.prepare('SELECT COUNT(*) as count FROM billing_invoices WHERE org_id = ?').bind(orgId)
    const countResult = await countQuery.first()

    return jsonResponse({
      invoices: (invoices.results || []).map(mapBillingInvoice),
      total: countResult?.count || 0,
      hasMore: offset + limit < (countResult?.count || 0),
    })
  },

  // GET /billing/invoices/:id - Get invoice detail with line items
  async getBillingInvoiceDetail(request, env, auth, invoiceId) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB
    const invoice = await db.prepare(
      'SELECT * FROM billing_invoices WHERE id = ?'
    ).bind(invoiceId).first()

    if (!invoice) {
      return jsonResponse({ error: 'Invoice not found' }, 404)
    }

    if (orgId && invoice.org_id !== orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const lines = await db.prepare(`
      SELECT * FROM billing_invoice_lines 
      WHERE billing_invoice_id = ?
      ORDER BY created_at ASC
    `).bind(invoiceId).all()

    return jsonResponse({
      invoice: mapBillingInvoice(invoice),
      lines: (lines.results || []).map(mapBillingInvoiceLine),
    })
  },

  // POST /billing/checkout-session - Create Stripe Checkout Session for subscription
  async createCheckoutSession(request, env, auth) {
    const { orgId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    if (!env.STRIPE_SECRET_KEY) {
      return jsonResponse({ error: 'Stripe not configured' }, 500)
    }

    const body = await request.json()
    const { priceId, successUrl, cancelUrl, quantity = 1, trialPeriodDays, metadata = {} } = body

    if (!priceId || !successUrl || !cancelUrl) {
      return jsonResponse({ error: 'priceId, successUrl, and cancelUrl are required' }, 400)
    }

    const db = env.DB

    // Get or create billing customer
    let customer = await db.prepare(
      'SELECT * FROM billing_customers WHERE org_id = ?'
    ).bind(orgId).first()

    if (!customer) {
      // Get org details for Stripe customer creation
      const org = await db.prepare('SELECT * FROM orgs WHERE id = ?').bind(orgId).first()

      // Create Stripe customer
      const stripeCustomer = await createStripeCustomer(env.STRIPE_SECRET_KEY, {
        metadata: { org_id: orgId, org_name: org?.name || '' },
        name: org?.name,
      })

      // Save billing customer
      const customerId = generateId()
      await db.prepare(`
        INSERT INTO billing_customers (id, org_id, stripe_customer_id, name, metadata)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        customerId,
        orgId,
        stripeCustomer.id,
        org?.name || null,
        JSON.stringify({ org_name: org?.name })
      ).run()

      customer = await db.prepare('SELECT * FROM billing_customers WHERE id = ?').bind(customerId).first()
    }

    // Create Stripe Checkout Session
    const sessionParams = {
      customer: customer.stripe_customer_id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: { org_id: orgId, ...metadata },
      },
      metadata: { org_id: orgId },
    }

    if (trialPeriodDays) {
      sessionParams.subscription_data.trial_period_days = trialPeriodDays
    }

    const session = await createStripeCheckoutSession(env.STRIPE_SECRET_KEY, sessionParams)

    // Save checkout session for tracking
    const sessionId = generateId()
    await db.prepare(`
      INSERT INTO billing_checkout_sessions (
        id, org_id, stripe_session_id, stripe_customer_id, mode, success_url, cancel_url, expires_at, metadata
      ) VALUES (?, ?, ?, ?, 'subscription', ?, ?, ?, ?)
    `).bind(
      sessionId,
      orgId,
      session.id,
      customer.stripe_customer_id,
      successUrl,
      cancelUrl,
      session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
      JSON.stringify(metadata)
    ).run()

    return jsonResponse({
      sessionId: session.id,
      url: session.url,
    }, 201)
  },

  // POST /billing/portal-session - Create Stripe Billing Portal session
  async createBillingPortalSession(request, env, auth) {
    const { orgId, userId } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    if (!env.STRIPE_SECRET_KEY) {
      return jsonResponse({ error: 'Stripe not configured' }, 500)
    }

    const body = await request.json()
    const { returnUrl } = body

    if (!returnUrl) {
      return jsonResponse({ error: 'returnUrl is required' }, 400)
    }

    const db = env.DB

    // Get billing customer
    const customer = await db.prepare(
      'SELECT * FROM billing_customers WHERE org_id = ?'
    ).bind(orgId).first()

    if (!customer) {
      return jsonResponse({ error: 'No billing customer found. Please set up a subscription first.' }, 404)
    }

    // Create Stripe Billing Portal session
    const session = await createStripeBillingPortalSession(env.STRIPE_SECRET_KEY, {
      customer: customer.stripe_customer_id,
      return_url: returnUrl,
    })

    // Save portal session for audit
    const sessionId = generateId()
    await db.prepare(`
      INSERT INTO billing_portal_sessions (
        id, org_id, billing_customer_id, stripe_session_id, stripe_session_url, return_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      orgId,
      customer.id,
      session.id,
      session.url,
      returnUrl,
      userId || null
    ).run()

    return jsonResponse({
      url: session.url,
    }, 201)
  },

  // =============================================================================
  // Membership Caps Endpoints (Agent 1: Auth + Invite + Membership Caps)
  // =============================================================================

  // GET /portal/membership-caps - Get membership cap info for org
  async getMembershipCaps(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    if (!orgId && !isKobyStaff) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    const db = env.DB

    // Get org with max_members
    const org = await db.prepare('SELECT id, name, max_members FROM orgs WHERE id = ?').bind(orgId).first()

    if (!org) {
      return jsonResponse({ error: 'Organization not found' }, 404)
    }

    // max_members defaults to 10 if not set
    const maxMembers = org.max_members ?? 10

    return jsonResponse({
      orgId: org.id,
      orgName: org.name,
      maxMembers,
      // Note: actual member count comes from Clerk
      // This endpoint provides the cap - UI should compare against Clerk member count
    })
  },

  // PATCH /portal/membership-caps - Update membership cap (staff only)
  async updateMembershipCaps(request, env, auth) {
    const { orgId, isKobyStaff } = auth

    // Only Koby staff can update membership caps
    if (!isKobyStaff) {
      return jsonResponse({ error: 'Staff access required' }, 403)
    }

    if (!orgId) {
      return jsonResponse({ error: 'Organization required. Use ?orgId= parameter.' }, 400)
    }

    const body = await request.json()
    const { maxMembers } = body

    if (typeof maxMembers !== 'number' || maxMembers < 1 || maxMembers > 1000) {
      return jsonResponse({ error: 'maxMembers must be a number between 1 and 1000' }, 400)
    }

    const db = env.DB

    // Verify org exists
    const org = await db.prepare('SELECT id, name FROM orgs WHERE id = ?').bind(orgId).first()
    if (!org) {
      return jsonResponse({ error: 'Organization not found' }, 404)
    }

    // Update max_members
    await db.prepare(`
      UPDATE orgs SET max_members = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(maxMembers, orgId).run()

    // Write audit log
    await db.prepare(`
      INSERT INTO audit_logs (id, org_id, actor_type, actor_id, event_type, target_type, target_id, metadata)
      VALUES (?, ?, 'user', ?, 'org.membership_cap_updated', 'org', ?, ?)
    `).bind(
      generateId(),
      orgId,
      auth.userId || 'staff',
      orgId,
      JSON.stringify({ maxMembers, previousValue: org.max_members ?? 10 })
    ).run()

    return jsonResponse({
      orgId,
      orgName: org.name,
      maxMembers,
      updated: true,
    })
  },

  // POST /portal/check-invite-allowed - Check if invite is allowed (cap enforcement)
  async checkInviteAllowed(request, env, auth) {
    const { orgId, isKobyStaff, orgRole } = auth

    if (!orgId) {
      return jsonResponse({ error: 'Organization required' }, 400)
    }

    // Only admins or staff can check invite permissions
    const adminRoles = ['org:admin', 'org:client_admin']
    if (!isKobyStaff && !adminRoles.includes(orgRole)) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const body = await request.json()
    const { currentMemberCount } = body

    if (typeof currentMemberCount !== 'number' || currentMemberCount < 0) {
      return jsonResponse({ error: 'currentMemberCount is required' }, 400)
    }

    const db = env.DB

    // Get org with max_members
    const org = await db.prepare('SELECT id, max_members FROM orgs WHERE id = ?').bind(orgId).first()

    if (!org) {
      return jsonResponse({ error: 'Organization not found' }, 404)
    }

    const maxMembers = org.max_members ?? 10

    // Staff can always bypass caps
    if (isKobyStaff) {
      return jsonResponse({
        allowed: true,
        reason: 'staff_override',
        currentMemberCount,
        maxMembers,
        remainingSlots: maxMembers - currentMemberCount,
      })
    }

    // Check if under cap
    const allowed = currentMemberCount < maxMembers
    const remainingSlots = Math.max(0, maxMembers - currentMemberCount)

    return jsonResponse({
      allowed,
      reason: allowed ? 'under_cap' : 'cap_reached',
      currentMemberCount,
      maxMembers,
      remainingSlots,
      message: allowed
        ? `You can invite up to ${remainingSlots} more member${remainingSlots === 1 ? '' : 's'}.`
        : `Your organization has reached the maximum of ${maxMembers} members. Contact Koby support to increase your limit.`,
    })
  },

  // GET /portal/me - Get current user info and memberships
  async getMe(request, env, auth) {
    const db = env.DB

    // Get full user record
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(auth.userId).first()

    // Get all memberships with org details
    const memberships = await db.prepare(`
      SELECT um.*, o.name as org_name, o.slug as org_slug, o.status as org_status, o.plan as org_plan
      FROM user_memberships um
      JOIN orgs o ON um.org_id = o.id
      WHERE um.clerk_user_id = ?
      ORDER BY um.created_at ASC
    `).bind(auth.clerkUserId).all()

    return jsonResponse({
      user: {
        id: user.id,
        clerkUserId: user.clerk_user_id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        isKobyStaff: !!user.is_koby_staff,
        status: user.status,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at,
      },
      memberships: (memberships.results || []).map(m => ({
        id: m.id,
        orgId: m.org_id,
        orgName: m.org_name,
        orgSlug: m.org_slug,
        orgStatus: m.org_status,
        orgPlan: m.org_plan,
        role: m.role,
        createdAt: m.created_at,
      })),
      currentOrgId: auth.orgId,
      currentOrgRole: auth.orgRole,
    })
  },

  // GET /portal/users - List all users (staff only)
  async getUsers(request, env, auth) {
    if (!auth.isKobyStaff) {
      return jsonResponse({ error: 'Staff access required' }, 403)
    }

    const db = env.DB
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)

    const users = await db.prepare(`
      SELECT u.*, 
        (SELECT COUNT(*) FROM user_memberships WHERE clerk_user_id = u.clerk_user_id) as org_count
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    const countResult = await db.prepare('SELECT COUNT(*) as count FROM users').first()

    return jsonResponse({
      users: (users.results || []).map(u => ({
        id: u.id,
        clerkUserId: u.clerk_user_id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatar_url,
        isKobyStaff: !!u.is_koby_staff,
        status: u.status,
        orgCount: u.org_count,
        lastLoginAt: u.last_login_at,
        createdAt: u.created_at,
      })),
      total: countResult?.count || 0,
    })
  },

  // PATCH /portal/users/:id - Update user (staff only)
  async updateUser(request, env, auth, userId) {
    if (!auth.isKobyStaff) {
      return jsonResponse({ error: 'Staff access required' }, 403)
    }

    const db = env.DB
    const body = await request.json()
    const { isKobyStaff, status, name, email } = body

    const updates = []
    const params = []

    if (isKobyStaff !== undefined) {
      updates.push('is_koby_staff = ?')
      params.push(isKobyStaff ? 1 : 0)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (name !== undefined) {
      updates.push('name = ?')
      params.push(name)
    }
    if (email !== undefined) {
      updates.push('email = ?')
      params.push(email)
    }

    if (updates.length === 0) {
      return jsonResponse({ error: 'No fields to update' }, 400)
    }

    updates.push("updated_at = datetime('now')")
    params.push(userId)

    await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run()

    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()

    return jsonResponse({
      user: {
        id: user.id,
        clerkUserId: user.clerk_user_id,
        email: user.email,
        name: user.name,
        isKobyStaff: !!user.is_koby_staff,
        status: user.status,
        updatedAt: user.updated_at,
      },
    })
  },

  // POST /portal/memberships - Add user to org (staff only or org admin)
  async createMembership(request, env, auth) {
    const db = env.DB
    const body = await request.json()
    const { clerkUserId, orgId, role = 'member' } = body

    if (!clerkUserId || !orgId) {
      return jsonResponse({ error: 'clerkUserId and orgId are required' }, 400)
    }

    // Check permissions: must be staff or admin of target org
    if (!auth.isKobyStaff) {
      const isOrgAdmin = auth.memberships?.some(m => m.org_id === orgId && ['owner', 'admin'].includes(m.role))
      if (!isOrgAdmin) {
        return jsonResponse({ error: 'Admin access required' }, 403)
      }
    }

    // Verify org exists
    const org = await db.prepare('SELECT id, name FROM orgs WHERE id = ?').bind(orgId).first()
    if (!org) {
      return jsonResponse({ error: 'Organization not found' }, 404)
    }

    // Check if membership already exists
    const existing = await db.prepare(
      'SELECT id FROM user_memberships WHERE clerk_user_id = ? AND org_id = ?'
    ).bind(clerkUserId, orgId).first()

    if (existing) {
      return jsonResponse({ error: 'User is already a member of this organization' }, 409)
    }

    const id = generateId()
    await db.prepare(`
      INSERT INTO user_memberships (id, clerk_user_id, org_id, role)
      VALUES (?, ?, ?, ?)
    `).bind(id, clerkUserId, orgId, role).run()

    return jsonResponse({
      membership: {
        id,
        clerkUserId,
        orgId,
        orgName: org.name,
        role,
      },
    }, 201)
  },

  // DELETE /portal/memberships/:id - Remove membership (staff only or org admin)
  async deleteMembership(request, env, auth, membershipId) {
    const db = env.DB

    const membership = await db.prepare('SELECT * FROM user_memberships WHERE id = ?').bind(membershipId).first()
    if (!membership) {
      return jsonResponse({ error: 'Membership not found' }, 404)
    }

    // Check permissions
    if (!auth.isKobyStaff) {
      const isOrgAdmin = auth.memberships?.some(m => m.org_id === membership.org_id && ['owner', 'admin'].includes(m.role))
      if (!isOrgAdmin) {
        return jsonResponse({ error: 'Admin access required' }, 403)
      }
    }

    await db.prepare('DELETE FROM user_memberships WHERE id = ?').bind(membershipId).run()

    return jsonResponse({ deleted: true })
  },

  // GET /portal/orgs - List all orgs (staff sees all, users see their orgs)
  async getOrgs(request, env, auth) {
    const db = env.DB

    let orgs
    if (auth.isKobyStaff) {
      // Staff sees all orgs
      orgs = await db.prepare(`
        SELECT o.*, 
          (SELECT COUNT(*) FROM user_memberships WHERE org_id = o.id) as member_count,
          (SELECT COUNT(*) FROM portal_sites WHERE org_id = o.id) as site_count
        FROM orgs o
        ORDER BY o.created_at DESC
      `).all()
    } else {
      // Users see only their orgs
      const orgIds = auth.memberships?.map(m => m.org_id) || []
      if (orgIds.length === 0) {
        return jsonResponse({ orgs: [] })
      }
      const placeholders = orgIds.map(() => '?').join(',')
      orgs = await db.prepare(`
        SELECT o.*, 
          (SELECT COUNT(*) FROM user_memberships WHERE org_id = o.id) as member_count,
          (SELECT COUNT(*) FROM portal_sites WHERE org_id = o.id) as site_count
        FROM orgs o
        WHERE o.id IN (${placeholders})
        ORDER BY o.created_at DESC
      `).bind(...orgIds).all()
    }

    return jsonResponse({
      orgs: (orgs.results || []).map(o => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        status: o.status,
        plan: o.plan,
        memberCount: o.member_count,
        siteCount: o.site_count,
        createdAt: o.created_at,
      })),
    })
  },

  // POST /portal/orgs - Create new org (staff only)
  async createOrg(request, env, auth) {
    if (!auth.isKobyStaff) {
      return jsonResponse({ error: 'Staff access required' }, 403)
    }

    const db = env.DB
    const body = await request.json()
    const { name, slug, plan = 'chatbot', status = 'active' } = body

    if (!name) {
      return jsonResponse({ error: 'name is required' }, 400)
    }

    const id = `org_${generateId().substring(0, 8)}`
    const orgSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    await db.prepare(`
      INSERT INTO orgs (id, name, slug, status, plan)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, name, orgSlug, status, plan).run()

    return jsonResponse({
      org: { id, name, slug: orgSlug, status, plan },
    }, 201)
  },

  // GET /portal/cloudflare-analytics - Cloudflare zone analytics for koby.ai (staff only)
  async getCloudflareAnalytics(request, env, auth) {
    const { isKobyStaff } = auth

    // Only Koby staff can access Cloudflare analytics
    if (!isKobyStaff) {
      return jsonResponse({ error: 'Staff access required' }, 403)
    }

    const url = new URL(request.url)
    const period = url.searchParams.get('period') || '24h' // 24h, 7d, 30d
    const zoneId = env.CLOUDFLARE_ZONE_ID
    const apiToken = env.CLOUDFLARE_API_TOKEN

    if (!zoneId || !apiToken) {
      return jsonResponse({
        error: 'Cloudflare credentials not configured',
        analytics: null,
      }, 200)
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '24h':
      default:
        startDate.setDate(now.getDate() - 1)
        break
    }

    const since = startDate.toISOString()
    const until = now.toISOString()

    try {
      // Cloudflare GraphQL Analytics API
      const graphqlQuery = `
        query GetZoneAnalytics($zoneTag: String!, $since: Time!, $until: Time!) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequests1dGroups(
                limit: 31
                filter: { date_geq: $since, date_lt: $until }
                orderBy: [date_ASC]
              ) {
                dimensions {
                  date
                }
                sum {
                  requests
                  cachedRequests
                  bytes
                  cachedBytes
                }
                uniq {
                  uniques
                }
              }
              httpRequestsAdaptiveGroups(
                limit: 1
                filter: { datetime_geq: $since, datetime_lt: $until }
              ) {
                sum {
                  visits
                }
              }
            }
          }
        }
      `

      const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: {
            zoneTag: zoneId,
            since: since.split('T')[0],
            until: until.split('T')[0],
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Cloudflare API error:', errorText)
        return jsonResponse({
          error: 'Failed to fetch Cloudflare analytics',
          analytics: null,
        }, 200)
      }

      const data = await response.json()
      
      if (data.errors && data.errors.length > 0) {
        console.error('Cloudflare GraphQL errors:', data.errors)
        return jsonResponse({
          error: 'Cloudflare GraphQL error',
          details: data.errors,
          analytics: null,
        }, 200)
      }

      const zones = data.data?.viewer?.zones || []
      if (zones.length === 0) {
        return jsonResponse({
          error: 'No zone data found',
          analytics: null,
        }, 200)
      }

      const httpData = zones[0].httpRequests1dGroups || []
      const adaptiveData = zones[0].httpRequestsAdaptiveGroups || []

      // Aggregate totals
      let totalRequests = 0
      let cachedRequests = 0
      let totalBytes = 0
      let cachedBytes = 0
      let uniqueVisitors = 0

      const timeseries = httpData.map(group => {
        totalRequests += group.sum?.requests || 0
        cachedRequests += group.sum?.cachedRequests || 0
        totalBytes += group.sum?.bytes || 0
        cachedBytes += group.sum?.cachedBytes || 0
        uniqueVisitors += group.uniq?.uniques || 0

        return {
          timestamp: group.dimensions?.date,
          requests: group.sum?.requests || 0,
          visitors: group.uniq?.uniques || 0,
          cachedRequests: group.sum?.cachedRequests || 0,
          bytesServed: group.sum?.bytes || 0,
        }
      })

      // Get unique visitors from adaptive endpoint if available
      if (adaptiveData.length > 0 && adaptiveData[0].sum?.visits) {
        uniqueVisitors = adaptiveData[0].sum.visits
      }

      const percentCached = totalRequests > 0 
        ? ((cachedRequests / totalRequests) * 100).toFixed(2)
        : 0

      const totalDataServedMB = (totalBytes / (1024 * 1024)).toFixed(2)
      const dataCachedMB = (cachedBytes / (1024 * 1024)).toFixed(2)

      return jsonResponse({
        analytics: {
          uniqueVisitors,
          totalRequests,
          percentCached: parseFloat(percentCached),
          totalDataServedMB: parseFloat(totalDataServedMB),
          dataCachedMB: parseFloat(dataCachedMB),
          period: {
            start: since,
            end: until,
          },
          timeseries,
        },
        zone: 'kobyai.com',
        lastUpdated: now.toISOString(),
      })
    } catch (error) {
      console.error('Error fetching Cloudflare analytics:', error)
      return jsonResponse({
        error: 'Failed to fetch analytics',
        details: error.message,
        analytics: null,
      }, 200)
    }
  },

  // POST /webhooks/stripe - Stripe webhook receiver with signature verification
  async handleStripeWebhook(request, env) {
    const signature = request.headers.get('stripe-signature')
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return jsonResponse({ error: 'Webhook not configured' }, 500)
    }

    const rawBody = await request.text()

    // Verify Stripe signature
    let event
    try {
      event = await verifyStripeWebhook(rawBody, signature, webhookSecret)
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err.message)
      return jsonResponse({ error: 'Invalid signature' }, 400)
    }

    const db = env.DB
    const now = new Date().toISOString()
    const eventId = generateId()

    // Check for duplicate event (idempotency)
    const existing = await db.prepare(
      'SELECT id FROM stripe_events WHERE stripe_event_id = ?'
    ).bind(event.id).first()

    if (existing) {
      return jsonResponse({ received: true, duplicate: true })
    }

    // Extract org_id from event metadata if present
    let orgId = null
    const eventObject = event.data?.object
    if (eventObject?.metadata?.org_id) {
      orgId = eventObject.metadata.org_id
    } else if (eventObject?.customer) {
      // Look up org by Stripe customer ID
      const customer = await db.prepare(
        'SELECT org_id FROM billing_customers WHERE stripe_customer_id = ?'
      ).bind(eventObject.customer).first()
      orgId = customer?.org_id || null
    }

    // Insert event record
    await db.prepare(`
      INSERT INTO stripe_events (
        id, stripe_event_id, event_type, api_version, livemode, org_id, 
        object_type, object_id, status, payload, received_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).bind(
      eventId,
      event.id,
      event.type,
      event.api_version || null,
      event.livemode ? 1 : 0,
      orgId,
      eventObject?.object || null,
      eventObject?.id || null,
      JSON.stringify(event),
      now
    ).run()

    // Process event based on type
    let processingError = null
    try {
      await processStripeEvent(db, event, orgId)
      await db.prepare(
        'UPDATE stripe_events SET status = ?, processed_at = ? WHERE id = ?'
      ).bind('processed', new Date().toISOString(), eventId).run()
    } catch (err) {
      processingError = err.message
      await db.prepare(
        'UPDATE stripe_events SET status = ?, processing_error = ?, processed_at = ? WHERE id = ?'
      ).bind('failed', processingError, new Date().toISOString(), eventId).run()
      console.error('Error processing Stripe event:', err)
    }

    return jsonResponse({ received: true, eventId })
  },
}

// JSON response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function parseJsonField(value, fallback) {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch (e) {
    console.warn('Failed to parse JSON field', e)
    return fallback
  }
}

function mapKnowledgeSource(row) {
  if (!row) return null
  return {
    id: row.id,
    org_id: row.org_id,
    name: row.name,
    type: row.type,
    status: row.status,
    sync_cursor: row.sync_cursor || null,
    last_synced_at: row.last_synced_at || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    config: parseJsonField(row.config, {}),
    error_message: row.error_message || null,
  }
}

function mapKnowledgeDocument(row) {
  if (!row) return null
  return {
    id: row.id,
    org_id: row.org_id,
    source_id: row.source_id,
    title: row.title,
    path: row.path || null,
    external_id: row.external_id || null,
    status: row.status,
    live_version_id: row.live_version_id || null,
    checksum: row.checksum || null,
    mime_type: row.mime_type || null,
    size_bytes: row.size_bytes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapKnowledgePolicy(row) {
  if (!row) return null
  return {
    id: row.id,
    org_id: row.org_id,
    name: row.name,
    description: row.description || null,
    rules: parseJsonField(row.rules, []),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapKnowledgeJob(row) {
  if (!row) return null
  return {
    id: row.id,
    org_id: row.org_id,
    source_id: row.source_id || null,
    document_id: row.document_id || null,
    version_id: row.version_id || null,
    type: row.type,
    status: row.status,
    error_message: row.error_message || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapFlowRow(row) {
  if (!row) return null
  return {
    id: row.id,
    org_id: row.org_id,
    name: row.name,
    description: row.description || null,
    status: row.status,
    trigger: parseJsonField(row.trigger, { type: 'api', config: {} }),
    entry_step_id: row.entry_step_id,
    last_published_at: row.last_published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    version: row.version,
  }
}

function mapFlowStep(row) {
  if (!row) return null
  return {
    id: row.id,
    flow_id: row.flow_id,
    kind: row.kind,
    name: row.name,
    config: parseJsonField(row.config, {}),
    next_step_id: row.next_step_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapFlowRule(row) {
  if (!row) return null
  return {
    id: row.id,
    flow_id: row.flow_id,
    step_id: row.step_id,
    condition: row.condition,
    action: row.action,
    target_step_id: row.target_step_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapFlowTest(row) {
  if (!row) return null
  return {
    id: row.id,
    flow_id: row.flow_id,
    name: row.name,
    input: parseJsonField(row.input, {}),
    expected_outcome: row.expected_outcome,
    last_run_at: row.last_run_at,
    last_result: row.last_result,
  }
}

function mapFlowRunInsight(row) {
  if (!row) return null
  return {
    flow_id: row.flow_id,
    run_id: row.id,
    started_at: row.started_at,
    duration_ms: row.duration_ms || 0,
    outcome: row.outcome || 'success',
    triggered_policy_ids: parseJsonField(row.triggered_policy_ids, []),
  }
}

function mapAuditLog(row) {
  if (!row) return null
  return {
    id: row.id,
    orgId: row.org_id,
    actorType: row.actor_type,
    actorId: row.actor_id || null,
    eventType: row.event_type,
    targetType: row.target_type || null,
    targetId: row.target_id || null,
    metadata: parseJsonField(row.metadata, {}),
    createdAt: row.created_at,
  }
}

function mapRetentionPolicy(row) {
  if (!row) return null
  return {
    id: row.id,
    orgId: row.org_id,
    dataType: row.data_type,
    ttlDays: row.ttl_days,
    applyAnonymization: !!row.apply_anonymization,
    enforcedAt: row.enforced_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Map portal_config row to API shape
function mapConfigRow(row) {
  if (!row) return null
  return {
    orgId: row.org_id,
    branding: JSON.parse(row.branding || '{}'),
    enabled_modules: JSON.parse(row.enabled_modules || '[]'),
    custom_cards: JSON.parse(row.custom_cards || '[]'),
    settings: JSON.parse(row.settings || '{}'),
    updated_at: row.updated_at,
  }
}

// Connector to category mapping for integrations
const connectorCategories = {
  pagerduty: 'communications',
  sendgrid: 'communications',
  twilio: 'communications',
  stripe: 'billing',
  dentrix: 'calendar',
  google_calendar: 'calendar',
  salesforce: 'crm',
  hubspot: 'crm',
  segment: 'analytics',
  mixpanel: 'analytics',
}

// Connector to friendly name mapping
const connectorNames = {
  pagerduty: 'PagerDuty',
  sendgrid: 'SendGrid',
  twilio: 'Twilio',
  stripe: 'Stripe',
  dentrix: 'Dentrix',
  google_calendar: 'Google Calendar',
  salesforce: 'Salesforce',
  hubspot: 'HubSpot',
  segment: 'Segment',
  mixpanel: 'Mixpanel',
}

// Map integration_connections row to IntegrationStatus shape (for UI)
function mapIntegrationStatus(row) {
  if (!row) return null
  const connector = row.connector || 'unknown'
  return {
    id: row.id,
    name: connectorNames[connector] || connector.charAt(0).toUpperCase() + connector.slice(1).replace(/_/g, ' '),
    category: connectorCategories[connector] || 'other',
    status: row.status || 'pending',
    lastSynced: row.last_refreshed_at || null,
    health: row.health_status === 'healthy' ? 'good' : row.health_status === 'warning' ? 'warning' : row.health_status === 'error' ? 'critical' : undefined,
    note: row.health_detail || null,
  }
}

// Map integration_connections row to IntegrationConnection shape (full data)
function mapIntegrationConnection(row) {
  if (!row) return null
  return {
    id: row.id,
    orgId: row.org_id,
    connector: row.connector,
    status: row.status,
    credentials: row.credentials ? JSON.parse(row.credentials) : {},
    lastRefreshedAt: row.last_refreshed_at,
    expiresAt: row.expires_at,
    healthStatus: row.health_status,
    healthDetail: row.health_detail,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Main handler
export default {
  async fetch(request, env) {
    // Generate request ID for tracing
    const requestId = request.headers.get('X-Request-ID') || generateRequestId()
    const log = createLogger(requestId, env)
    
    // Build dynamic CORS headers
    const dynamicCorsHeaders = getCorsHeaders(request, env)
    // Update global corsHeaders for this request (used in jsonResponse)
    corsHeaders = dynamicCorsHeaders

    const url = new URL(request.url)
    const path = url.pathname
    const method = request.method
    const clientIp = getClientIp(request)

    // Log request start
    log.info('request_start', {
      method,
      path,
      clientIp,
      userAgent: request.headers.get('User-Agent'),
    })

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      log.debug('cors_preflight', { origin: request.headers.get('Origin') })
      return new Response(null, { headers: dynamicCorsHeaders })
    }

    // Health check
    if (path === '/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString(), requestId })
    }

    // Request size check for POST/PATCH/PUT
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      const maxSize = path === '/webhooks/stripe' ? MAX_WEBHOOK_SIZE : MAX_REQUEST_SIZE
      const sizeCheck = await checkRequestSize(request, maxSize)
      if (!sizeCheck.valid) {
        log.warn('request_too_large', { 
          contentLength: request.headers.get('Content-Length'),
          maxSize,
        })
        return jsonResponse({ error: sizeCheck.error, requestId }, 413)
      }
    }

    // Stripe webhook - no auth required (uses signature verification)
    if (path === '/webhooks/stripe' && method === 'POST') {
      log.info('stripe_webhook_received')
      return routes.handleStripeWebhook(request, env, log)
    }

    // Basic rate limiting
    if (isRateLimited(request, env)) {
      log.warn('rate_limit_exceeded', { clientIp })
      return jsonResponse({ error: 'Rate limit exceeded', requestId }, 429)
    }

    // All portal routes require auth
    const auth = await getAuthContext(request, env)
    if (!auth) {
      log.warn('auth_failed', { path })
      return jsonResponse({ error: 'Unauthorized', requestId }, 401)
    }

    // Enrich logs with auth context
    log.info('auth_success', {
      userId: auth.userId,
      orgId: auth.orgId,
      isKobyStaff: auth.isKobyStaff,
      orgRole: auth.orgRole,
    })

    try {
      // Route matching
      if (path === '/portal/overview' && method === 'GET') {
        return routes.getOverview(request, env, auth)
      }
      if (path === '/portal/engines' && request.method === 'GET') {
        return routes.getEngines(request, env, auth)
      }
      if (path === '/portal/workflows' && request.method === 'GET') {
        return routes.getWorkflows(request, env, auth)
      }
      if (path === '/portal/insights' && request.method === 'GET') {
        return routes.getInsights(request, env, auth)
      }
      if (path === '/portal/team' && request.method === 'GET') {
        return routes.getTeam(request, env, auth)
      }
      if (path === '/portal/audit-logs' && request.method === 'GET') {
        return routes.getAuditLogs(request, env, auth)
      }
      if (path === '/portal/knowledge' && request.method === 'GET') {
        return routes.getKnowledge(request, env, auth)
      }
      if (path === '/portal/knowledge/sources' && request.method === 'POST') {
        return routes.createKnowledgeSource(request, env, auth)
      }
      if (path === '/portal/knowledge/documents' && request.method === 'POST') {
        return routes.createKnowledgeDocument(request, env, auth)
      }
      if (path === '/portal/flows' && request.method === 'GET') {
        return routes.getFlows(request, env, auth)
      }
      if (path === '/portal/flows' && request.method === 'POST') {
        return routes.createFlow(request, env, auth)
      }
      if (path.startsWith('/portal/flows/') && path.endsWith('/run') && request.method === 'POST') {
        const segments = path.split('/')
        const flowId = segments[3]
        return routes.runFlow(request, env, auth, flowId)
      }
      if (path.startsWith('/portal/flows/') && !path.endsWith('/tests') && request.method === 'GET') {
        const segments = path.split('/')
        const flowId = segments[3]
        return routes.getFlowDetail(request, env, auth, flowId)
      }
      if (path.startsWith('/portal/flows/') && path.endsWith('/tests') && request.method === 'POST') {
        const segments = path.split('/')
        const flowId = segments[3]
        return routes.createFlowTest(request, env, auth, flowId)
      }
      if (path === '/portal/retention' && request.method === 'GET') {
        return routes.getRetentionPolicies(request, env, auth)
      }
      if (path === '/portal/retention' && request.method === 'POST') {
        return routes.upsertRetentionPolicy(request, env, auth)
      }
      if (path === '/portal/clients' && request.method === 'GET') {
        return routes.getClients(request, env, auth)
      }
      // User & Membership Management
      if (path === '/portal/me' && request.method === 'GET') {
        return routes.getMe(request, env, auth)
      }
      if (path === '/portal/users' && request.method === 'GET') {
        return routes.getUsers(request, env, auth)
      }
      if (path.match(/^\/portal\/users\/[^/]+$/) && request.method === 'PATCH') {
        const userId = path.split('/')[3]
        return routes.updateUser(request, env, auth, userId)
      }
      if (path === '/portal/memberships' && request.method === 'POST') {
        return routes.createMembership(request, env, auth)
      }
      if (path.match(/^\/portal\/memberships\/[^/]+$/) && request.method === 'DELETE') {
        const membershipId = path.split('/')[3]
        return routes.deleteMembership(request, env, auth, membershipId)
      }
      if (path === '/portal/orgs' && request.method === 'GET') {
        return routes.getOrgs(request, env, auth)
      }
      if (path === '/portal/orgs' && request.method === 'POST') {
        return routes.createOrg(request, env, auth)
      }
      // Cloudflare Analytics endpoint (staff only)
      if (path === '/portal/cloudflare-analytics' && request.method === 'GET') {
        return routes.getCloudflareAnalytics(request, env, auth)
      }
      // Membership cap endpoints (Agent 1: Auth + Invite + Membership Caps)
      if (path === '/portal/membership-caps' && request.method === 'GET') {
        return routes.getMembershipCaps(request, env, auth)
      }
      if (path === '/portal/membership-caps' && request.method === 'PATCH') {
        return routes.updateMembershipCaps(request, env, auth)
      }
      if (path === '/portal/check-invite-allowed' && request.method === 'POST') {
        return routes.checkInviteAllowed(request, env, auth)
      }
      if (path === '/portal/config' && request.method === 'GET') {
        return routes.getConfig(request, env, auth)
      }
      if (path === '/portal/config' && request.method === 'PATCH') {
        return routes.updateConfig(request, env, auth)
      }
      if (path === '/portal/events' && request.method === 'GET') {
        return routes.getEvents(request, env, auth)
      }
      if (path === '/portal/integrations' && request.method === 'GET') {
        return routes.getIntegrations(request, env, auth)
      }
      if (path === '/integrations' && request.method === 'GET') {
        return routes.getIntegrations(request, env, auth)
      }
      if (path === '/integrations' && request.method === 'POST') {
        return routes.upsertIntegration(request, env, auth)
      }
      if (path.startsWith('/integrations/') && request.method === 'DELETE') {
        const segments = path.split('/')
        const integrationId = segments[2]
        return routes.deleteIntegration(request, env, auth, integrationId)
      }
      if (path === '/outcomes' && request.method === 'GET') {
        return routes.getOutcomes(request, env, auth)
      }
      if (path === '/billing/usage' && request.method === 'GET') {
        return routes.getBillingUsage(request, env, auth)
      }
      if (path === '/actions' && request.method === 'POST') {
        return routes.registerAction(request, env, auth)
      }
      if (path === '/actions/runs' && request.method === 'GET') {
        return routes.listActionRuns(request, env, auth)
      }
      if (path === '/actions/queue' && request.method === 'GET') {
        return routes.claimActionRuns(request, env, auth)
      }
      if (path.startsWith('/actions/') && path.endsWith('/run') && request.method === 'POST') {
        const segments = path.split('/')
        const actionId = segments[2]
        return routes.enqueueActionRun(request, env, auth, actionId)
      }
      if (path.startsWith('/actions/') && path.includes('/run/') && request.method === 'PATCH') {
        const segments = path.split('/')
        const actionId = segments[2]
        const runId = segments[4]
        return routes.updateActionRun(request, env, auth, actionId, runId)
      }
      if (path.startsWith('/webhooks/') && request.method === 'POST') {
        const segments = path.split('/')
        const connector = segments[2]
        return routes.ingestWebhook(request, env, auth, connector)
      }
      if (path === '/audit/logs' && request.method === 'GET') {
        return routes.getAuditLogs(request, env, auth)
      }
      if (path === '/retention/policies' && request.method === 'GET') {
        return routes.getRetentionPolicies(request, env, auth)
      }
      if (path === '/retention/policies' && request.method === 'PUT') {
        return routes.upsertRetentionPolicy(request, env, auth)
      }
      // New endpoints for knowledge, flows, actions
      if (path === '/actions' && request.method === 'GET') {
        return routes.getActions(request, env, auth)
      }
      if (path === '/portal/knowledge/policies' && request.method === 'GET') {
        return routes.getKnowledgePolicies(request, env, auth)
      }
      if (path === '/portal/knowledge/policies' && request.method === 'POST') {
        return routes.createKnowledgePolicy(request, env, auth)
      }
      if (path === '/portal/knowledge/versions' && request.method === 'GET') {
        return routes.getKnowledgeVersions(request, env, auth)
      }
      if (path === '/portal/knowledge/chunks' && request.method === 'GET') {
        return routes.getKnowledgeChunks(request, env, auth)
      }
      if (path === '/portal/knowledge/retrieve' && request.method === 'POST') {
        return routes.retrieveKnowledge(request, env, auth)
      }
      if (path.startsWith('/portal/flows/') && path.endsWith('/steps') && request.method === 'POST') {
        const segments = path.split('/')
        const flowId = segments[3]
        return routes.createFlowStep(request, env, auth, flowId)
      }
      if (path.startsWith('/portal/flows/') && path.endsWith('/rules') && request.method === 'POST') {
        const segments = path.split('/')
        const flowId = segments[3]
        return routes.createFlowRule(request, env, auth, flowId)
      }
      if (path.startsWith('/portal/flows/') && !path.includes('/steps') && !path.includes('/rules') && !path.includes('/tests') && request.method === 'PATCH') {
        const segments = path.split('/')
        const flowId = segments[3]
        return routes.updateFlow(request, env, auth, flowId)
      }

      // Stripe Billing endpoints (Agent 3: Subscription Architecture)
      if (path === '/billing/overview' && request.method === 'GET') {
        return routes.getBillingOverview(request, env, auth)
      }
      if (path === '/billing/subscriptions' && request.method === 'GET') {
        return routes.getBillingSubscriptions(request, env, auth)
      }
      if (path === '/billing/invoices' && request.method === 'GET') {
        return routes.getBillingInvoices(request, env, auth)
      }
      if (path.startsWith('/billing/invoices/') && request.method === 'GET') {
        const segments = path.split('/')
        const invoiceId = segments[3]
        return routes.getBillingInvoiceDetail(request, env, auth, invoiceId)
      }
      if (path === '/billing/checkout-session' && request.method === 'POST') {
        return routes.createCheckoutSession(request, env, auth)
      }
      if (path === '/billing/portal-session' && request.method === 'POST') {
        return routes.createBillingPortalSession(request, env, auth)
      }

      log.warn('route_not_found', { path, method })
      return jsonResponse({ error: 'Not found', requestId }, 404)
    } catch (error) {
      log.error('internal_error', { 
        error: error.message,
        stack: error.stack,
        path,
        method,
      })
      return jsonResponse({ error: 'Internal server error', requestId }, 500)
    }
  },
}

// Simple PII redaction for content fields (emails/phone)
function redactPII(text) {
  if (!text || typeof text !== 'string') return text
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  const phonePattern = /\+?\d[\d\-\s().]{6,}\d/g
  return text
    .replace(emailPattern, '[redacted email]')
    .replace(phonePattern, '[redacted phone]')
}

// =============================================================================
// Stripe Billing Helpers (Agent 3: Subscription Architecture)
// =============================================================================

// Map billing_customers row to API shape
function mapBillingCustomer(row) {
  if (!row) return null
  return {
    id: row.id,
    orgId: row.org_id,
    stripeCustomerId: row.stripe_customer_id,
    email: row.email,
    name: row.name,
    currency: row.currency || 'usd',
    balanceCents: row.balance_cents || 0,
    delinquent: !!row.delinquent,
    defaultPaymentMethodId: row.default_payment_method_id,
    invoiceSettings: parseJsonField(row.invoice_settings, {}),
    metadata: parseJsonField(row.metadata, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Map billing_subscriptions row to API shape
function mapBillingSubscription(row) {
  if (!row) return null
  return {
    id: row.id,
    orgId: row.org_id,
    billingCustomerId: row.billing_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    stripePriceId: row.stripe_price_id,
    status: row.status,
    planNickname: row.plan_nickname,
    quantity: row.quantity || 1,
    cancelAtPeriodEnd: !!row.cancel_at_period_end,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    canceledAt: row.canceled_at,
    endedAt: row.ended_at,
    trialStart: row.trial_start,
    trialEnd: row.trial_end,
    metadata: parseJsonField(row.metadata, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Map billing_invoices row to API shape
function mapBillingInvoice(row) {
  if (!row) return null
  return {
    id: row.id,
    orgId: row.org_id,
    billingCustomerId: row.billing_customer_id,
    billingSubscriptionId: row.billing_subscription_id,
    stripeInvoiceId: row.stripe_invoice_id,
    stripeInvoiceNumber: row.stripe_invoice_number,
    status: row.status,
    currency: row.currency || 'usd',
    subtotalCents: row.subtotal_cents || 0,
    taxCents: row.tax_cents || 0,
    totalCents: row.total_cents || 0,
    amountDueCents: row.amount_due_cents || 0,
    amountPaidCents: row.amount_paid_cents || 0,
    amountRemainingCents: row.amount_remaining_cents || 0,
    hostedInvoiceUrl: row.hosted_invoice_url,
    invoicePdf: row.invoice_pdf,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    dueDate: row.due_date,
    paidAt: row.paid_at,
    finalizedAt: row.finalized_at,
    metadata: parseJsonField(row.metadata, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Map billing_invoice_lines row to API shape
function mapBillingInvoiceLine(row) {
  if (!row) return null
  return {
    id: row.id,
    billingInvoiceId: row.billing_invoice_id,
    orgId: row.org_id,
    stripeLineItemId: row.stripe_line_item_id,
    description: row.description,
    quantity: row.quantity || 1,
    unitAmountCents: row.unit_amount_cents || 0,
    amountCents: row.amount_cents || 0,
    currency: row.currency || 'usd',
    priceId: row.price_id,
    productId: row.product_id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    proration: !!row.proration,
    metadata: parseJsonField(row.metadata, {}),
    createdAt: row.created_at,
  }
}

// Stripe API: Create customer
async function createStripeCustomer(secretKey, params) {
  const response = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(flattenParams(params)).toString(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Stripe error: ${error.error?.message || 'Unknown error'}`)
  }

  return response.json()
}

// Stripe API: Create Checkout Session
async function createStripeCheckoutSession(secretKey, params) {
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(flattenParams(params)).toString(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Stripe error: ${error.error?.message || 'Unknown error'}`)
  }

  return response.json()
}

// Stripe API: Create Billing Portal Session
async function createStripeBillingPortalSession(secretKey, params) {
  const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(flattenParams(params)).toString(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Stripe error: ${error.error?.message || 'Unknown error'}`)
  }

  return response.json()
}

// Flatten nested params for Stripe API (handles arrays and objects)
function flattenParams(params, prefix = '') {
  const result = {}
  for (const [key, value] of Object.entries(params)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key
    if (value === null || value === undefined) {
      continue
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          Object.assign(result, flattenParams(item, `${fullKey}[${index}]`))
        } else {
          result[`${fullKey}[${index}]`] = item
        }
      })
    } else if (typeof value === 'object') {
      Object.assign(result, flattenParams(value, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}

// Verify Stripe webhook signature
async function verifyStripeWebhook(rawBody, signature, secret) {
  if (!signature) {
    throw new Error('No signature provided')
  }

  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=')
    acc[key] = value
    return acc
  }, {})

  const timestamp = parts.t
  const signatureHash = parts.v1

  if (!timestamp || !signatureHash) {
    throw new Error('Invalid signature format')
  }

  // Check timestamp (reject events older than 5 minutes)
  const timestampSeconds = parseInt(timestamp, 10)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestampSeconds) > 300) {
    throw new Error('Timestamp too old')
  }

  // Compute expected signature
  const payload = `${timestamp}.${rawBody}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  if (expectedSignature !== signatureHash) {
    throw new Error('Signature mismatch')
  }

  return JSON.parse(rawBody)
}

// Process Stripe webhook events
async function processStripeEvent(db, event, orgId) {
  const eventObject = event.data?.object
  const now = new Date().toISOString()

  switch (event.type) {
    // Customer events
    case 'customer.created':
    case 'customer.updated': {
      if (!orgId) break

      const existing = await db.prepare(
        'SELECT id FROM billing_customers WHERE stripe_customer_id = ?'
      ).bind(eventObject.id).first()

      if (existing) {
        await db.prepare(`
          UPDATE billing_customers SET
            email = ?, name = ?, currency = ?, balance_cents = ?, 
            delinquent = ?, default_payment_method_id = ?, 
            invoice_settings = ?, metadata = ?, updated_at = ?
          WHERE stripe_customer_id = ?
        `).bind(
          eventObject.email || null,
          eventObject.name || null,
          eventObject.currency || 'usd',
          eventObject.balance || 0,
          eventObject.delinquent ? 1 : 0,
          eventObject.invoice_settings?.default_payment_method || null,
          JSON.stringify(eventObject.invoice_settings || {}),
          JSON.stringify(eventObject.metadata || {}),
          now,
          eventObject.id
        ).run()
      }
      break
    }

    // Subscription events
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      if (!orgId) break

      const customer = await db.prepare(
        'SELECT id FROM billing_customers WHERE stripe_customer_id = ?'
      ).bind(eventObject.customer).first()

      if (!customer) break

      const priceId = eventObject.items?.data?.[0]?.price?.id || ''
      const planNickname = eventObject.items?.data?.[0]?.price?.nickname || eventObject.plan?.nickname || null

      const existing = await db.prepare(
        'SELECT id FROM billing_subscriptions WHERE stripe_subscription_id = ?'
      ).bind(eventObject.id).first()

      if (existing) {
        await db.prepare(`
          UPDATE billing_subscriptions SET
            stripe_price_id = ?, status = ?, plan_nickname = ?, quantity = ?,
            cancel_at_period_end = ?, current_period_start = ?, current_period_end = ?,
            canceled_at = ?, ended_at = ?, trial_start = ?, trial_end = ?,
            metadata = ?, updated_at = ?
          WHERE stripe_subscription_id = ?
        `).bind(
          priceId,
          eventObject.status,
          planNickname,
          eventObject.quantity || 1,
          eventObject.cancel_at_period_end ? 1 : 0,
          eventObject.current_period_start ? new Date(eventObject.current_period_start * 1000).toISOString() : null,
          eventObject.current_period_end ? new Date(eventObject.current_period_end * 1000).toISOString() : null,
          eventObject.canceled_at ? new Date(eventObject.canceled_at * 1000).toISOString() : null,
          eventObject.ended_at ? new Date(eventObject.ended_at * 1000).toISOString() : null,
          eventObject.trial_start ? new Date(eventObject.trial_start * 1000).toISOString() : null,
          eventObject.trial_end ? new Date(eventObject.trial_end * 1000).toISOString() : null,
          JSON.stringify(eventObject.metadata || {}),
          now,
          eventObject.id
        ).run()
      } else {
        await db.prepare(`
          INSERT INTO billing_subscriptions (
            id, org_id, billing_customer_id, stripe_subscription_id, stripe_price_id,
            status, plan_nickname, quantity, cancel_at_period_end,
            current_period_start, current_period_end, canceled_at, ended_at,
            trial_start, trial_end, metadata, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          generateId(),
          orgId,
          customer.id,
          eventObject.id,
          priceId,
          eventObject.status,
          planNickname,
          eventObject.quantity || 1,
          eventObject.cancel_at_period_end ? 1 : 0,
          eventObject.current_period_start ? new Date(eventObject.current_period_start * 1000).toISOString() : null,
          eventObject.current_period_end ? new Date(eventObject.current_period_end * 1000).toISOString() : null,
          eventObject.canceled_at ? new Date(eventObject.canceled_at * 1000).toISOString() : null,
          eventObject.ended_at ? new Date(eventObject.ended_at * 1000).toISOString() : null,
          eventObject.trial_start ? new Date(eventObject.trial_start * 1000).toISOString() : null,
          eventObject.trial_end ? new Date(eventObject.trial_end * 1000).toISOString() : null,
          JSON.stringify(eventObject.metadata || {}),
          now,
          now
        ).run()
      }

      // Update org plan based on subscription
      if (eventObject.status === 'active' || eventObject.status === 'trialing') {
        const planMapping = {
          'chatbot': 'chatbot',
          'phone': 'phone',
          'bundle': 'bundle',
          'enterprise': 'enterprise',
        }
        const plan = planMapping[planNickname?.toLowerCase()] || 'chatbot'
        await db.prepare('UPDATE orgs SET plan = ?, updated_at = ? WHERE id = ?')
          .bind(plan, now, orgId).run()
      }

      // Write audit log for subscription event
      await db.prepare(`
        INSERT INTO audit_logs (id, org_id, actor_type, actor_id, event_type, target_type, target_id, metadata)
        VALUES (?, ?, 'integration', 'stripe', ?, 'subscription', ?, ?)
      `).bind(
        generateId(),
        orgId,
        `billing.subscription.${event.type.split('.').pop()}`,
        eventObject.id,
        JSON.stringify({
          status: eventObject.status,
          plan: planNickname,
          stripe_event_id: event.id,
        })
      ).run()
      break
    }

    case 'customer.subscription.deleted': {
      if (!orgId) break

      await db.prepare(`
        UPDATE billing_subscriptions SET
          status = 'canceled', ended_at = ?, updated_at = ?
        WHERE stripe_subscription_id = ?
      `).bind(now, now, eventObject.id).run()

      // Write audit log for subscription cancellation
      await db.prepare(`
        INSERT INTO audit_logs (id, org_id, actor_type, actor_id, event_type, target_type, target_id, metadata)
        VALUES (?, ?, 'integration', 'stripe', 'billing.subscription.canceled', 'subscription', ?, ?)
      `).bind(
        generateId(),
        orgId,
        eventObject.id,
        JSON.stringify({ stripe_event_id: event.id, ended_at: now })
      ).run()
      break
    }

    // Invoice events
    case 'invoice.created':
    case 'invoice.updated':
    case 'invoice.finalized':
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      if (!orgId) break

      const customer = await db.prepare(
        'SELECT id FROM billing_customers WHERE stripe_customer_id = ?'
      ).bind(eventObject.customer).first()

      if (!customer) break

      let subscriptionId = null
      if (eventObject.subscription) {
        const sub = await db.prepare(
          'SELECT id FROM billing_subscriptions WHERE stripe_subscription_id = ?'
        ).bind(eventObject.subscription).first()
        subscriptionId = sub?.id || null
      }

      const existing = await db.prepare(
        'SELECT id FROM billing_invoices WHERE stripe_invoice_id = ?'
      ).bind(eventObject.id).first()

      if (existing) {
        await db.prepare(`
          UPDATE billing_invoices SET
            billing_subscription_id = ?, stripe_invoice_number = ?, status = ?,
            currency = ?, subtotal_cents = ?, tax_cents = ?, total_cents = ?,
            amount_due_cents = ?, amount_paid_cents = ?, amount_remaining_cents = ?,
            hosted_invoice_url = ?, invoice_pdf = ?, period_start = ?, period_end = ?,
            due_date = ?, paid_at = ?, finalized_at = ?, metadata = ?, updated_at = ?
          WHERE stripe_invoice_id = ?
        `).bind(
          subscriptionId,
          eventObject.number || null,
          eventObject.status,
          eventObject.currency || 'usd',
          eventObject.subtotal || 0,
          eventObject.tax || 0,
          eventObject.total || 0,
          eventObject.amount_due || 0,
          eventObject.amount_paid || 0,
          eventObject.amount_remaining || 0,
          eventObject.hosted_invoice_url || null,
          eventObject.invoice_pdf || null,
          eventObject.period_start ? new Date(eventObject.period_start * 1000).toISOString() : null,
          eventObject.period_end ? new Date(eventObject.period_end * 1000).toISOString() : null,
          eventObject.due_date ? new Date(eventObject.due_date * 1000).toISOString() : null,
          event.type === 'invoice.paid' ? now : null,
          eventObject.status_transitions?.finalized_at 
            ? new Date(eventObject.status_transitions.finalized_at * 1000).toISOString() 
            : null,
          JSON.stringify(eventObject.metadata || {}),
          now,
          eventObject.id
        ).run()
      } else {
        const invoiceId = generateId()
        await db.prepare(`
          INSERT INTO billing_invoices (
            id, org_id, billing_customer_id, billing_subscription_id, stripe_invoice_id,
            stripe_invoice_number, status, currency, subtotal_cents, tax_cents, total_cents,
            amount_due_cents, amount_paid_cents, amount_remaining_cents,
            hosted_invoice_url, invoice_pdf, period_start, period_end,
            due_date, paid_at, finalized_at, metadata, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          invoiceId,
          orgId,
          customer.id,
          subscriptionId,
          eventObject.id,
          eventObject.number || null,
          eventObject.status,
          eventObject.currency || 'usd',
          eventObject.subtotal || 0,
          eventObject.tax || 0,
          eventObject.total || 0,
          eventObject.amount_due || 0,
          eventObject.amount_paid || 0,
          eventObject.amount_remaining || 0,
          eventObject.hosted_invoice_url || null,
          eventObject.invoice_pdf || null,
          eventObject.period_start ? new Date(eventObject.period_start * 1000).toISOString() : null,
          eventObject.period_end ? new Date(eventObject.period_end * 1000).toISOString() : null,
          eventObject.due_date ? new Date(eventObject.due_date * 1000).toISOString() : null,
          event.type === 'invoice.paid' ? now : null,
          eventObject.status_transitions?.finalized_at 
            ? new Date(eventObject.status_transitions.finalized_at * 1000).toISOString() 
            : null,
          JSON.stringify(eventObject.metadata || {}),
          now,
          now
        ).run()

        // Process line items
        for (const lineItem of (eventObject.lines?.data || [])) {
          await db.prepare(`
            INSERT OR IGNORE INTO billing_invoice_lines (
              id, billing_invoice_id, org_id, stripe_line_item_id, description,
              quantity, unit_amount_cents, amount_cents, currency,
              price_id, product_id, period_start, period_end, proration, metadata, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            generateId(),
            invoiceId,
            orgId,
            lineItem.id,
            lineItem.description || null,
            lineItem.quantity || 1,
            lineItem.unit_amount || 0,
            lineItem.amount || 0,
            lineItem.currency || 'usd',
            lineItem.price?.id || null,
            lineItem.price?.product || null,
            lineItem.period?.start ? new Date(lineItem.period.start * 1000).toISOString() : null,
            lineItem.period?.end ? new Date(lineItem.period.end * 1000).toISOString() : null,
            lineItem.proration ? 1 : 0,
            JSON.stringify(lineItem.metadata || {}),
            now
          ).run()
        }
      }

      // Write audit log for invoice events (paid and payment_failed are most critical)
      if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
        await db.prepare(`
          INSERT INTO audit_logs (id, org_id, actor_type, actor_id, event_type, target_type, target_id, metadata)
          VALUES (?, ?, 'integration', 'stripe', ?, 'invoice', ?, ?)
        `).bind(
          generateId(),
          orgId,
          `billing.${event.type.replace('.', '_')}`,
          eventObject.id,
          JSON.stringify({
            status: eventObject.status,
            total_cents: eventObject.total || 0,
            amount_paid_cents: eventObject.amount_paid || 0,
            stripe_event_id: event.id,
          })
        ).run()
      }
      break
    }

    // Checkout session completed
    case 'checkout.session.completed': {
      await db.prepare(`
        UPDATE billing_checkout_sessions SET
          status = 'complete', stripe_subscription_id = ?, completed_at = ?, updated_at = ?
        WHERE stripe_session_id = ?
      `).bind(
        eventObject.subscription || null,
        now,
        now,
        eventObject.id
      ).run()
      break
    }

    case 'checkout.session.expired': {
      await db.prepare(`
        UPDATE billing_checkout_sessions SET status = 'expired', updated_at = ?
        WHERE stripe_session_id = ?
      `).bind(now, eventObject.id).run()
      break
    }

    default:
      // Unknown event type - mark as skipped
      break
  }
}
