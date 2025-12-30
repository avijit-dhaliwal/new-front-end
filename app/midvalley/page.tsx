'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Script from 'next/script'
import { Phone, FileText, Clock, MapPin, Trash2, Recycle, Leaf, X } from 'lucide-react'

const API_BASE = 'https://koby-midvalley-demo.voidinfrastructuretechnologies.workers.dev'

interface MissedCollectionRequest {
  id: string
  demo_session_id: string | null
  conversation_id: string | null
  created_at: string
  contact_first_name: string
  contact_last_name: string
  phone: string
  email: string
  service_street_1: string
  service_city: string
  service_state: string
  service_zip: string
  service_day: string
  non_collection_tag_present: number
  container_out_by_6am: number
  lids_closed: number
  cart_trash: number
  cart_recycle: number
  cart_organics: number
  bin_trash: number
  bin_recycle: number
  bin_organics: number
  job_order_confirmation_preference: string
  additional_comments: string | null
  raw_json: string
}

interface ElevenLabsCall {
  conversation_id: string
  agent_id: string
  demo_session_id: string | null
  created_at: string
  call_duration_secs: number | null
  cost: number | null
  termination_reason: string | null
  call_successful: string | null
  transcript_summary: string | null
  transcript_json: string
  metadata_json: string
  analysis_json: string
  raw_json: string
}

function formatTime(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function MissedItemBadges({ request }: { request: MissedCollectionRequest }) {
  const items = []
  if (request.cart_trash) items.push({ label: 'Cart Trash', icon: Trash2, color: 'bg-gray-600' })
  if (request.cart_recycle) items.push({ label: 'Cart Recycle', icon: Recycle, color: 'bg-blue-600' })
  if (request.cart_organics) items.push({ label: 'Cart Organics', icon: Leaf, color: 'bg-green-600' })
  if (request.bin_trash) items.push({ label: 'Bin Trash', icon: Trash2, color: 'bg-gray-500' })
  if (request.bin_recycle) items.push({ label: 'Bin Recycle', icon: Recycle, color: 'bg-blue-500' })
  if (request.bin_organics) items.push({ label: 'Bin Organics', icon: Leaf, color: 'bg-green-500' })

  return (
    <div className="flex flex-wrap gap-1">
      {items.map(item => (
        <span
          key={item.label}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white ${item.color}`}
        >
          <item.icon className="w-3 h-3" />
          {item.label.split(' ')[1]}
        </span>
      ))}
    </div>
  )
}

function GatingBadges({ request }: { request: MissedCollectionRequest }) {
  return (
    <div className="flex flex-wrap gap-1 text-xs">
      <span className={`px-2 py-0.5 rounded ${request.non_collection_tag_present ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        Tag: {request.non_collection_tag_present ? 'Yes' : 'No'}
      </span>
      <span className={`px-2 py-0.5 rounded ${request.container_out_by_6am ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        6am: {request.container_out_by_6am ? 'Yes' : 'No'}
      </span>
      <span className={`px-2 py-0.5 rounded ${request.lids_closed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        Lids: {request.lids_closed ? 'Yes' : 'No'}
      </span>
    </div>
  )
}

function TranscriptModal({ call, onClose }: { call: ElevenLabsCall; onClose: () => void }) {
  let transcript: Array<{ role: string; message: string }> = []
  try {
    transcript = JSON.parse(call.transcript_json || '[]')
  } catch {
    transcript = []
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h3 className="font-semibold text-lg">Call Transcript</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {call.transcript_summary && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm font-medium text-orange-800 mb-1">Summary</p>
              <p className="text-sm text-orange-700">{call.transcript_summary}</p>
            </div>
          )}

          <div className="space-y-3">
            {transcript.map((turn, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  turn.role === 'agent' ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'
                }`}
              >
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {turn.role === 'agent' ? 'Agent' : 'Caller'}
                </p>
                <p className="text-sm">{turn.message}</p>
              </div>
            ))}
          </div>

          {call.call_duration_secs && (
            <div className="text-xs text-gray-500 pt-2 border-t">
              Duration: {Math.floor(call.call_duration_secs / 60)}m {call.call_duration_secs % 60}s
              {call.termination_reason && ` • Ended: ${call.termination_reason}`}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function MidValleyDemo() {
  const [demoSessionId, setDemoSessionId] = useState<string>('')
  const [requests, setRequests] = useState<MissedCollectionRequest[]>([])
  const [calls, setCalls] = useState<ElevenLabsCall[]>([])
  const [selectedCall, setSelectedCall] = useState<ElevenLabsCall | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  useEffect(() => {
    let sessionId = sessionStorage.getItem('midvalley_demo_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('midvalley_demo_session_id', sessionId)
    }
    setDemoSessionId(sessionId)

    const widget = document.getElementById('midvalley-widget')
    if (widget) {
      widget.setAttribute('dynamic-variables', JSON.stringify({
        demo_session_id: sessionId,
        demo_source: 'kobyai.com/midvalley'
      }))
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/midvalley/recent?limit=20`)
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
        setCalls(data.calls || [])
        setLastRefresh(new Date())
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (demoSessionId) {
      const widget = document.getElementById('midvalley-widget')
      if (widget) {
        widget.setAttribute('dynamic-variables', JSON.stringify({
          demo_session_id: demoSessionId,
          demo_source: 'kobyai.com/midvalley'
        }))
      }
    }
  }, [demoSessionId])

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4">
              Live Demo
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Mid Valley Disposal — Missed Collection
            </h1>
            <p className="mt-4 text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
              AI-powered intake for missed garbage collection reports. Try calling the agent and watch tickets appear in real-time.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-6 shadow-sm sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[var(--ink)]">Report Missed Pickup</h2>
                    <p className="text-sm text-[var(--ink-muted)]">Click below to call the AI agent</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                  <elevenlabs-convai
                    id="midvalley-widget"
                    agent-id="agent_0501kdrbgz2yecq81zx93sv6tkaw"
                    action-text="Report a missed pickup"
                    start-call-text="Call the missed pickup line"
                    end-call-text="End call"
                  />
                </div>

                <p className="text-xs text-[var(--ink-muted)] mt-4 text-center">
                  Session: {demoSessionId.slice(0, 8)}...
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="font-semibold text-[var(--ink)]">Live Intake Log</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                    <Clock className="w-4 h-4" />
                    Updated {lastRefresh ? formatTime(lastRefresh.toISOString()) : '--:--'}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {requests.length === 0 && calls.length === 0 ? (
                    <div className="p-12 text-center text-[var(--ink-muted)]">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No intake records yet.</p>
                      <p className="text-sm mt-1">Make a call to see tickets appear here.</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-[var(--line)]">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Time</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Name</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Address</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Missed Items</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Day</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Checks</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Ticket</th>
                          <th className="px-4 py-3 text-left font-medium text-[var(--ink-muted)]">Transcript</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {requests.map(req => {
                          const matchingCall = calls.find(c => 
                            c.demo_session_id === req.demo_session_id ||
                            c.conversation_id === req.conversation_id
                          )
                          return (
                            <tr key={req.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-[var(--ink)]">{formatTime(req.created_at)}</div>
                                <div className="text-xs text-[var(--ink-muted)]">{formatDate(req.created_at)}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-[var(--ink)]">
                                  {req.contact_first_name} {req.contact_last_name}
                                </div>
                                <div className="text-xs text-[var(--ink-muted)]">{req.email}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-start gap-1">
                                  <MapPin className="w-4 h-4 text-[var(--ink-muted)] mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-[var(--ink)]">{req.service_street_1}</div>
                                    <div className="text-xs text-[var(--ink-muted)]">
                                      {req.service_city}, {req.service_state} {req.service_zip}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <MissedItemBadges request={req} />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-[var(--ink)]">
                                {req.service_day}
                              </td>
                              <td className="px-4 py-3">
                                <GatingBadges request={req} />
                              </td>
                              <td className="px-4 py-3">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                  {req.id.slice(0, 8)}
                                </code>
                              </td>
                              <td className="px-4 py-3">
                                {matchingCall ? (
                                  <button
                                    onClick={() => setSelectedCall(matchingCall)}
                                    className="text-[var(--accent)] hover:underline text-sm"
                                  >
                                    View ({matchingCall.call_duration_secs || 0}s)
                                  </button>
                                ) : (
                                  <span className="text-xs text-[var(--ink-muted)]">Pending...</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                        {calls.filter(c => !requests.find(r => 
                          r.demo_session_id === c.demo_session_id ||
                          r.conversation_id === c.conversation_id
                        )).map(call => (
                          <tr key={call.conversation_id} className="hover:bg-gray-50 bg-blue-50/30">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-[var(--ink)]">{formatTime(call.created_at)}</div>
                              <div className="text-xs text-[var(--ink-muted)]">{formatDate(call.created_at)}</div>
                            </td>
                            <td colSpan={5} className="px-4 py-3 text-[var(--ink-muted)] italic">
                              Call completed — no ticket created
                              {call.transcript_summary && (
                                <div className="text-xs mt-1 not-italic">{call.transcript_summary.slice(0, 80)}...</div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {call.conversation_id.slice(0, 8)}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => setSelectedCall(call)}
                                className="text-[var(--accent)] hover:underline text-sm"
                              >
                                View ({call.call_duration_secs || 0}s)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {selectedCall && (
        <TranscriptModal call={selectedCall} onClose={() => setSelectedCall(null)} />
      )}

      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
    </main>
  )
}
