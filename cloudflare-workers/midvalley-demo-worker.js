const MIDVALLEY_AGENT_ID = 'agent_0501kdrbgz2yecq81zx93sv6tkaw'

const DEFAULT_ALLOWED_ORIGINS = [
  'https://kobyai.com',
  'https://www.kobyai.com',
  'http://localhost:3000',
]

function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || ''
  const allowedOriginsStr = env?.ALLOWED_ORIGINS || ''
  const allowedOrigins = allowedOriginsStr
    ? allowedOriginsStr.split(',').map(o => o.trim())
    : DEFAULT_ALLOWED_ORIGINS

  const isAllowed = allowedOrigins.some(allowed => origin === allowed) || 
    env?.ENVIRONMENT === 'development'

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

function jsonResponse(data, status = 200, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(request, env),
    },
  })
}

function errorResponse(message, status, request, env) {
  return jsonResponse({ error: message }, status, request, env)
}

async function verifyHmacSignature(request, secret, rawBody) {
  const sigHeader = request.headers.get('ElevenLabs-Signature') || 
    request.headers.get('elevenlabs-signature')
  
  if (!sigHeader) {
    return { valid: false, error: 'Missing ElevenLabs-Signature header' }
  }

  const parts = sigHeader.split(',')
  let timestamp = null
  let signature = null

  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key === 't') timestamp = value
    if (key === 'v0') signature = value
  }

  if (!timestamp || !signature) {
    return { valid: false, error: 'Invalid signature format' }
  }

  const timestampMs = parseInt(timestamp, 10) * 1000
  const now = Date.now()
  const thirtyMinutes = 30 * 60 * 1000
  if (Math.abs(now - timestampMs) > thirtyMinutes) {
    return { valid: false, error: 'Timestamp too old or in future' }
  }

  const signedPayload = `${timestamp}.${rawBody}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  if (signature !== expectedSignature) {
    return { valid: false, error: 'Signature mismatch' }
  }

  return { valid: true }
}

function normalizePhone(phone) {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

function normalizeZip(zip) {
  if (!zip) return ''
  const digits = zip.replace(/\D/g, '')
  return digits.slice(0, 5)
}

function toBool(val) {
  if (val === true || val === 'true' || val === 1 || val === '1') return true
  return false
}

async function handleMissedCollection(request, env) {
  const authHeader = request.headers.get('Authorization') || ''
  const expectedToken = env.TOOL_AUTH_BEARER

  if (!expectedToken || authHeader !== expectedToken) {
    console.error('Auth failed. Got:', authHeader, 'Expected:', expectedToken)
    return errorResponse('Unauthorized', 401, request, env)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON', 400, request, env)
  }

  console.log('Received body:', JSON.stringify(body))

  const ticketId = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  const normalizedPayload = {
    ...body,
    phone: normalizePhone(body.phone || ''),
    service_zip: normalizeZip(body.service_zip || ''),
  }

  try {
    await env.DB.prepare(`
      INSERT INTO missed_collection_requests (
        id, demo_session_id, conversation_id, created_at,
        contact_first_name, contact_last_name, phone, email,
        account_name, account_number,
        service_street_1, service_street_2, service_city, service_state, service_zip,
        service_day,
        non_collection_tag_present, container_out_by_6am, lids_closed,
        cart_trash, cart_recycle, cart_organics,
        bin_trash, bin_recycle, bin_organics,
        job_order_confirmation_preference, additional_comments,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      ticketId,
      body.demo_session_id || null,
      body.conversation_id || null,
      createdAt,
      body.contact_first_name || 'Unknown',
      body.contact_last_name || 'Unknown',
      normalizedPayload.phone || '',
      body.email || '',
      body.account_name || null,
      body.account_number || null,
      body.service_street_1 || '',
      body.service_street_2 || null,
      body.service_city || '',
      body.service_state || '',
      normalizedPayload.service_zip || '',
      body.service_day || 'Unknown',
      toBool(body.non_collection_tag_present) ? 1 : 0,
      toBool(body.container_out_by_6am) ? 1 : 0,
      toBool(body.lids_closed) ? 1 : 0,
      toBool(body.cart_trash) ? 1 : 0,
      toBool(body.cart_recycle) ? 1 : 0,
      toBool(body.cart_organics) ? 1 : 0,
      toBool(body.bin_trash) ? 1 : 0,
      toBool(body.bin_recycle) ? 1 : 0,
      toBool(body.bin_organics) ? 1 : 0,
      body.job_order_confirmation_preference || 'email',
      body.additional_comments || null,
      JSON.stringify(body)
    ).run()

    return jsonResponse({
      ticket_id: ticketId,
      created_at: createdAt,
      message: 'Ticket created successfully',
      normalized_payload: normalizedPayload,
    }, 201, request, env)
  } catch (err) {
    console.error('DB insert error:', err)
    return errorResponse('Database error: ' + err.message, 500, request, env)
  }
}

async function handlePostCallWebhook(request, env) {
  const rawBody = await request.text()

  if (env.ELEVENLABS_WEBHOOK_SECRET) {
    const verification = await verifyHmacSignature(request, env.ELEVENLABS_WEBHOOK_SECRET, rawBody)
    if (!verification.valid) {
      console.error('Webhook verification failed:', verification.error)
      return errorResponse(verification.error, 401, request, env)
    }
  }

  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return errorResponse('Invalid JSON', 400, request, env)
  }

  if (payload.type !== 'post_call_transcription') {
    return jsonResponse({ status: 'ignored', reason: 'not post_call_transcription' }, 200, request, env)
  }

  const data = payload.data || {}
  
  if (data.agent_id !== MIDVALLEY_AGENT_ID && data.agent_id !== env.MIDVALLEY_AGENT_ID) {
    return jsonResponse({ status: 'ignored', reason: 'agent_id mismatch' }, 200, request, env)
  }

  const conversationId = data.conversation_id
  if (!conversationId) {
    return errorResponse('Missing conversation_id', 400, request, env)
  }

  const demoSessionId = data.conversation_initiation_client_data?.dynamic_variables?.demo_session_id || null
  const metadata = data.metadata || {}
  const analysis = data.analysis || {}

  const createdAt = new Date().toISOString()

  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO elevenlabs_calls (
        conversation_id, agent_id, demo_session_id, created_at,
        status, user_id,
        call_start_time_unix, call_duration_secs, cost, termination_reason,
        call_successful, transcript_summary,
        transcript_json, metadata_json, analysis_json, initiation_client_data_json,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      conversationId,
      data.agent_id,
      demoSessionId,
      createdAt,
      data.status || null,
      data.user_id || null,
      metadata.start_time_unix_secs || null,
      metadata.call_duration_secs || null,
      metadata.cost || null,
      metadata.termination_reason || null,
      analysis.call_successful || null,
      analysis.transcript_summary || null,
      JSON.stringify(data.transcript || []),
      JSON.stringify(metadata),
      JSON.stringify(analysis),
      JSON.stringify(data.conversation_initiation_client_data || {}),
      rawBody
    ).run()

    return jsonResponse({ status: 'stored', conversation_id: conversationId }, 200, request, env)
  } catch (err) {
    console.error('DB insert error:', err)
    return errorResponse('Database error', 500, request, env)
  }
}

async function handleGetSession(request, env, demoSessionId) {
  try {
    const requests = await env.DB.prepare(
      'SELECT * FROM missed_collection_requests WHERE demo_session_id = ? ORDER BY created_at DESC'
    ).bind(demoSessionId).all()

    const calls = await env.DB.prepare(
      'SELECT * FROM elevenlabs_calls WHERE demo_session_id = ? ORDER BY created_at DESC'
    ).bind(demoSessionId).all()

    return jsonResponse({
      demo_session_id: demoSessionId,
      requests: requests.results || [],
      calls: calls.results || [],
    }, 200, request, env)
  } catch (err) {
    console.error('DB query error:', err)
    return errorResponse('Database error', 500, request, env)
  }
}

async function handleGetRecent(request, env) {
  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100)

  try {
    const requests = await env.DB.prepare(
      'SELECT * FROM missed_collection_requests ORDER BY created_at DESC LIMIT ?'
    ).bind(limit).all()

    const calls = await env.DB.prepare(
      'SELECT * FROM elevenlabs_calls ORDER BY created_at DESC LIMIT ?'
    ).bind(limit).all()

    return jsonResponse({
      requests: requests.results || [],
      calls: calls.results || [],
    }, 200, request, env)
  } catch (err) {
    console.error('DB query error:', err)
    return errorResponse('Database error', 500, request, env)
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      })
    }

    if (path === '/api/midvalley/missed-collection' && request.method === 'POST') {
      return handleMissedCollection(request, env)
    }

    if (path === '/api/midvalley/elevenlabs/postcall' && request.method === 'POST') {
      return handlePostCallWebhook(request, env)
    }

    if (path.startsWith('/api/midvalley/session/') && request.method === 'GET') {
      const demoSessionId = path.replace('/api/midvalley/session/', '')
      if (!demoSessionId) {
        return errorResponse('Missing demo_session_id', 400, request, env)
      }
      return handleGetSession(request, env, demoSessionId)
    }

    if (path === '/api/midvalley/recent' && request.method === 'GET') {
      return handleGetRecent(request, env)
    }

    return errorResponse('Not found', 404, request, env)
  },
}
