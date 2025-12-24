/**
 * Koby Portal API - Cloudflare Worker
 * Handles portal data endpoints with Clerk JWT verification
 * Scopes data by org unless user is Koby staff
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

// Extract auth context from request
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

  // Check for Koby staff role in public metadata
  const isKobyStaff = claims.public_metadata?.kobyRole === 'staff'

  // Get org ID from claims or query param (staff can override)
  const url = new URL(request.url)
  let orgId = claims.org_id

  if (isKobyStaff && url.searchParams.has('orgId')) {
    orgId = url.searchParams.get('orgId')
  }

  return {
    userId: claims.sub,
    orgId,
    isKobyStaff,
    orgRole: claims.org_role,
  }
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

    return jsonResponse({
      sources: (sources.results || []).map(mapKnowledgeSource),
      documents: (documents.results || []).map(mapKnowledgeDocument),
      policies: (policies.results || []).map(mapKnowledgePolicy),
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
        content: message.content,
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
        content: outcome.label || outcome.outcome_type,
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
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const path = url.pathname

    // Health check
    if (path === '/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() })
    }

    // Basic rate limiting
    if (isRateLimited(request, env)) {
      return jsonResponse({ error: 'Rate limit exceeded' }, 429)
    }

    // All portal routes require auth
    const auth = await getAuthContext(request, env)
    if (!auth) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    try {
      // Route matching
      if (path === '/portal/overview' && request.method === 'GET') {
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
      if (path === '/portal/clients' && request.method === 'GET') {
        return routes.getClients(request, env, auth)
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

      return jsonResponse({ error: 'Not found' }, 404)
    } catch (error) {
      console.error('Portal worker error:', error)
      return jsonResponse({ error: 'Internal server error' }, 500)
    }
  },
}
