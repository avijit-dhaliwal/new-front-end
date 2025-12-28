/**
 * CHADIS Chat API - Cloudflare Worker
 * Handles Gemini AI integration for healthcare chat assistant
 * Now with site_key authentication and D1 logging
 */

// =============================================================================
// Configuration
// =============================================================================

// Rate limiting (per IP, sliding window)
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 30 // 30 requests per minute per IP for chat
const rateLimitBuckets = new Map()

// Request size limit
const MAX_REQUEST_SIZE = 50 * 1024 // 50KB max for chat requests
const MAX_MESSAGE_LENGTH = 5000 // 5000 chars max per message

// Generate UUID
function generateId() {
  return crypto.randomUUID()
}

// CORS headers - use origin validation when possible
function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || ''
  
  // In production, validate origin against allowed domains
  // For now, allow all but log suspicious origins
  const suspiciousPatterns = [/localhost/i, /127\.0\.0\.1/, /0\.0\.0\.0/]
  const isSuspicious = env?.ENVIRONMENT === 'production' && 
    suspiciousPatterns.some(p => p.test(origin))
  
  if (isSuspicious) {
    console.warn('Suspicious origin:', origin)
  }
  
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Site-Key',
    'Access-Control-Max-Age': '86400',
  }
}

// Legacy corsHeaders for backward compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Site-Key',
}

// =============================================================================
// Rate Limiting
// =============================================================================

function getClientIp(request) {
  return request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         'unknown'
}

function isRateLimited(request, env) {
  if (env?.SKIP_RATE_LIMIT === 'true') return false
  
  const ip = getClientIp(request)
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  
  const bucket = rateLimitBuckets.get(ip) || []
  const recent = bucket.filter(ts => ts > windowStart)
  
  const maxRequests = env?.RATE_LIMIT_MAX 
    ? parseInt(env.RATE_LIMIT_MAX, 10) 
    : RATE_LIMIT_MAX
  
  if (recent.length >= maxRequests) {
    rateLimitBuckets.set(ip, recent)
    return true
  }
  
  recent.push(now)
  rateLimitBuckets.set(ip, recent)
  return false
}

// =============================================================================
// Request Validation
// =============================================================================

async function validateRequest(request, env) {
  // Check content length
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
  if (contentLength > MAX_REQUEST_SIZE) {
    return { valid: false, error: 'Request too large', status: 413 }
  }
  
  return { valid: true }
}

// Lookup site by site_key and get config
async function getSiteConfig(siteKey, db) {
  if (!db || !siteKey) return null

  try {
    const site = await db.prepare(`
      SELECT ps.*, o.id as org_id, o.name as org_name
      FROM portal_sites ps
      JOIN orgs o ON ps.org_id = o.id
      WHERE ps.site_key = ? AND ps.status = 'active'
    `).bind(siteKey).first()

    return site
  } catch (error) {
    console.error('Error looking up site:', error)
    return null
  }
}

// Log chat session start
async function createSession(db, siteId, orgId, visitorId) {
  if (!db) return null

  try {
    const sessionId = generateId()
    await db.prepare(`
      INSERT INTO chat_sessions (id, site_id, org_id, visitor_id, started_at, status)
      VALUES (?, ?, ?, ?, datetime('now'), 'active')
    `).bind(sessionId, siteId, orgId, visitorId || null).run()

    return sessionId
  } catch (error) {
    console.error('Error creating session:', error)
    return null
  }
}

// Log chat message
async function logMessage(db, sessionId, siteId, orgId, role, content, latencyMs, tokensUsed) {
  if (!db || !sessionId) return

  try {
    const messageId = generateId()
    await db.prepare(`
      INSERT INTO chat_messages (id, session_id, site_id, org_id, role, content, latency_ms, tokens_used, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(messageId, sessionId, siteId, orgId, role, content, latencyMs || null, tokensUsed || null).run()

    // Update session message count
    await db.prepare(`
      UPDATE chat_sessions SET message_count = message_count + 1 WHERE id = ?
    `).bind(sessionId).run()
  } catch (error) {
    console.error('Error logging message:', error)
  }
}

// Update daily metrics
async function updateDailyMetrics(db, orgId, siteId, latencyMs) {
  if (!db) return

  try {
    const today = new Date().toISOString().split('T')[0]
    const metricsId = `${orgId}_${siteId || 'all'}_${today}`

    // Upsert daily metrics
    await db.prepare(`
      INSERT INTO metrics_daily (id, org_id, site_id, date, total_sessions, total_messages, avg_latency_ms)
      VALUES (?, ?, ?, ?, 0, 1, ?)
      ON CONFLICT(org_id, site_id, date) DO UPDATE SET
        total_messages = total_messages + 1,
        avg_latency_ms = (avg_latency_ms * total_messages + ?) / (total_messages + 1)
    `).bind(metricsId, orgId, siteId, today, latencyMs || 0, latencyMs || 0).run()
  } catch (error) {
    console.error('Error updating metrics:', error)
  }
}

export default {
  async fetch(request, env) {
    const headers = getCorsHeaders(request, env)
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers
      })
    }

    // Rate limiting check
    if (isRateLimited(request, env)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.' 
      }), {
        status: 429,
        headers: { 
          ...headers, 
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      })
    }

    // Request size validation
    const validation = await validateRequest(request, env)
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: validation.status,
        headers: { ...headers, 'Content-Type': 'application/json' }
      })
    }

    const startTime = Date.now()

    try {
      const body = await request.json()
      const { message, session_id, visitor_id } = body

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        })
      }

      // Message length validation
      if (message.length > MAX_MESSAGE_LENGTH) {
        return new Response(JSON.stringify({ 
          error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` 
        }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        })
      }

      // Get site_key from header or body
      const siteKey = request.headers.get('X-Site-Key') || body.site_key

      // Try to get site config from D1 if available
      let site = null
      let apiKey = env.GEMINI_API_KEY
      let systemPrompt = null
      let sessionId = session_id

      if (env.DB && siteKey) {
        site = await getSiteConfig(siteKey, env.DB)
        if (site) {
          // Use site-specific API key if available
          if (site.google_api_key) {
            apiKey = site.google_api_key
          }
          // Use site-specific system prompt if available
          if (site.system_prompt) {
            systemPrompt = site.system_prompt
          }

          // Create or continue session
          if (!sessionId) {
            sessionId = await createSession(env.DB, site.id, site.org_id, visitor_id)
          }

          // Log user message
          await logMessage(env.DB, sessionId, site.id, site.org_id, 'user', message, null, null)
        }
      }

      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Default context for CHADIS (can be overridden by site.system_prompt)
      const defaultContext = `You are a healthcare assistant for CHADIS (Child Health and Development Interactive System), a pediatric healthcare screening platform. You help with:

      - Pediatric health screening questionnaires
      - Developmental assessments for children and adolescents
      - Early identification of ADHD, depression, anxiety, and other psychosocial concerns
      - Clinical documentation support
      - Patient engagement and family education
      - Healthcare provider decision support

      Key facts about CHADIS:
      - Automates 1,000+ screening and diagnostic questionnaires
      - Tailored to patient age and visit reason
      - Serves 15% of primary care pediatric market
      - 90% renewal rate with 10-20X ROI for practices
      - HIPAA compliant and clinically validated
      - Created by developmental-behavioral pediatricians

      Respond as a knowledgeable, caring healthcare assistant. Be professional, helpful, and focused on pediatric healthcare. If asked about specific medical advice, remind users to consult with their healthcare provider.

      Respond in a professional, conversational tone. Keep responses concise but informative, typically 2-4 sentences unless more detail is specifically requested.

      Format your responses clearly:
      - Use proper paragraph breaks for readability
      - If listing items, use clear bullet points with "•"
      - Avoid asterisks (*) - use bullet points (•) instead
      - Keep formatting clean and professional`

      const context = systemPrompt || defaultContext
      const fullPrompt = `${context}\n\nUser question: ${message}`

      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      })

      const latencyMs = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates[0].content.parts[0].text
      const tokensUsed = data.usageMetadata?.totalTokenCount || null

      // Log assistant response and update metrics
      if (env.DB && site && sessionId) {
        await logMessage(env.DB, sessionId, site.id, site.org_id, 'assistant', text, latencyMs, tokensUsed)
        await updateDailyMetrics(env.DB, site.org_id, site.id, latencyMs)
      }

      return new Response(JSON.stringify({
        response: text,
        session_id: sessionId,
        latency_ms: latencyMs
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } catch (error) {
      console.error('Error:', error)
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}
