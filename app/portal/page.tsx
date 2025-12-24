'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useOrganization, useUser, useAuth } from '@clerk/nextjs'
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import KobyClientsList from '@/components/portal/KobyClientsList'
import StatusPill from '@/components/portal/StatusPill'
import type { 
  PortalClient, 
  MetricCard, 
  EngineStatus, 
  Workflow, 
  QualitySignal, 
  TrendDataPoint, 
  TeamAccess,
  IntegrationStatus,
  OutcomeMetric,
  OutcomeEvent,
  BillingRecord,
  AuditLog,
  RetentionPolicy,
  PortalOverviewResponse,
  PortalEnginesResponse,
  PortalInsightsResponse,
  PortalWorkflowsResponse,
  PortalEventsResponse,
  PortalTeamResponse,
  PortalEvent,
  OutcomesResponse,
  BillingUsageResponse,
  PortalIntegrationsResponse,
} from '@/types/portal'
import type {
  KnowledgeOverviewResponse,
  FlowListResponse,
  Flow,
  FlowTestCase,
  FlowRunInsight,
} from '@/types/knowledge'

const PORTAL_WORKER_URL = process.env.NEXT_PUBLIC_PORTAL_WORKER_URL || ''

interface PortalData {
  metrics: MetricCard[]
  engines: EngineStatus[]
  workflows: Workflow[]
  flows: Flow[]
  flowTests: FlowTestCase[]
  flowInsights: FlowRunInsight[]
  insights: TrendDataPoint[]
  qualitySignals: QualitySignal[]
  teamAccess: TeamAccess[]
  knowledge: KnowledgeOverviewResponse | null
  events: PortalEvent[]
  integrations: IntegrationStatus[]
  outcomes: OutcomeMetric[]
  auditLogs: AuditLog[]
  retentionPolicies: RetentionPolicy[]
}

type LoadingState = 'loading' | 'success' | 'error'

const defaultPeriod = () => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 30)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '--'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

const formatCurrency = (cents?: number | null): string => {
  if (cents === undefined || cents === null) return '--'
  return `$${(cents / 100).toFixed(2)}`
}

function buildMetrics(stats: PortalOverviewResponse['stats']): MetricCard[] {
  return [
    { label: 'Total sessions', value: formatNumber(stats.totalSessions) },
    { label: 'Messages', value: formatNumber(stats.totalMessages) },
    { label: 'Active sessions', value: formatNumber(stats.activeSessions) },
    { label: 'Leads captured', value: formatNumber(stats.leadsCapture) },
    { label: 'Appointments booked', value: formatNumber(stats.appointmentsBooked) },
    { label: 'Avg latency', value: stats.avgLatency ? `${Math.round(stats.avgLatency)} ms` : '--' },
  ]
}

function mapEngineStatus(engines: PortalEnginesResponse['engines']): EngineStatus[] {
  return engines.map(engine => ({
    title: engine.name,
    status: engine.status === 'active' ? 'Active' : engine.status === 'paused' ? 'Degraded' : 'Down',
    detail: engine.domain ? `Domain: ${engine.domain}` : 'No domain configured',
    metric: `Sessions today: ${formatNumber(engine.todaySessions)}`,
  }))
}

function buildTrend(dailyMetrics: PortalInsightsResponse['dailyMetrics']): TrendDataPoint[] {
  return dailyMetrics.slice(-7).map(metric => ({
    label: metric.date.slice(5),
    value: metric.total_sessions,
  }))
}

function buildSignals(insights: PortalInsightsResponse['insights']): QualitySignal[] {
  return insights.map((insight, index) => ({
    title: insight.type === 'alert' ? 'Alert' : insight.type === 'warning' ? 'Warning' : 'Tip',
    value: `#${index + 1}`,
    note: insight.message,
  }))
}

function buildTeamAccess(team: PortalTeamResponse['team']): TeamAccess[] {
  const counts: Record<string, number> = {}
  team.forEach(member => {
    const roleKey = member.role || 'Member'
    counts[roleKey] = (counts[roleKey] || 0) + 1
  })
  return Object.entries(counts).map(([role, count]) => ({
    role,
    count,
  }))
}

function describeEvent(event: PortalEvent): string {
  switch (event.type) {
    case 'session_started':
      return 'Session started'
    case 'session_ended':
      return 'Session ended'
    case 'user_message':
      return 'Visitor message'
    case 'assistant_message':
      return 'Assistant response'
    case 'lead_captured':
      return 'Lead captured'
    case 'appointment_booked':
      return 'Appointment booked'
    case 'action_run':
      return 'Action run'
    case 'outcome_recorded':
      return 'Outcome recorded'
    default:
      return event.type
  }
}

function buildOutcomeMetrics(events: OutcomeEvent[]): OutcomeMetric[] {
  if (!events.length) return []

  const totalAmount = events.reduce((sum, event) => sum + (event.amountCents || 0), 0)

  return [
    {
      id: 'outcomes_count',
      title: 'Outcomes logged',
      value: formatNumber(events.length),
      note: 'Last 30 days',
      status: 'up',
    },
    {
      id: 'outcomes_value',
      title: 'Captured value',
      value: formatCurrency(totalAmount),
      note: 'Total captured across outcomes',
      status: 'up',
    },
  ]
}

function getEmptyPortalData(): PortalData {
  return {
    metrics: [],
    engines: [],
    workflows: [],
    flows: [],
    flowTests: [],
    flowInsights: [],
    insights: [],
    qualitySignals: [],
    teamAccess: [],
    knowledge: null,
    events: [],
    integrations: [],
    outcomes: [],
    auditLogs: [],
    retentionPolicies: [],
  }
}

function buildPortalData(
  overview: PortalOverviewResponse,
  engines: PortalEnginesResponse | null,
  insights: PortalInsightsResponse | null,
  workflows: PortalWorkflowsResponse | null,
  events: PortalEventsResponse | null,
  team: PortalTeamResponse | null,
  knowledge: KnowledgeOverviewResponse | null,
  flows: FlowListResponse | null,
  integrations?: IntegrationStatus[],
  outcomeMetrics?: OutcomeMetric[]
): PortalData {
  return {
    metrics: buildMetrics(overview.stats),
    engines: mapEngineStatus(engines?.engines || []),
    workflows: workflows?.workflows || [],
    flows: flows?.flows || [],
    flowTests: flows?.tests || [],
    flowInsights: flows?.insights || [],
    insights: buildTrend(insights?.dailyMetrics || []),
    qualitySignals: buildSignals(insights?.insights || []),
    teamAccess: buildTeamAccess(team?.team || []),
    knowledge: knowledge || { sources: [], documents: [], policies: [] },
    events: events?.events || [],
    integrations: integrations || [],
    outcomes: outcomeMetrics || [],
  }
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-pulse">
      <section className="pt-10">
        <div className="h-6 w-24 bg-[var(--paper-muted)] rounded mb-4" />
        <div className="h-10 w-96 bg-[var(--paper-muted)] rounded mb-4" />
        <div className="h-4 w-72 bg-[var(--paper-muted)] rounded" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 h-32" />
          ))}
        </div>
      </section>
    </div>
  )
}

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-6xl mx-auto pt-10">
      <div className="rounded-3xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-8 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load portal data
        </h2>
        <p className="text-sm text-red-600 dark:text-red-400 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-red-300 dark:border-red-700 bg-white dark:bg-red-900/30 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  )
}

// Empty state component
function EmptyState() {
  return (
    <div className="max-w-6xl mx-auto pt-10">
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-12 text-center shadow-[var(--shadow-soft)]">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mb-6">
          <Loader2 className="h-8 w-8 text-[var(--accent)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-2">
          Setting up your portal
        </h2>
        <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto">
          Your portal is being configured. Data will appear here once your AI services are active
          and generating metrics.
        </p>
      </div>
    </div>
  )
}

// Client Portal View (when viewing a specific organization)
function ClientPortalView({ data, outcomes, billing }: { data: PortalData; outcomes: OutcomeEvent[]; billing: BillingRecord[] }) {
  const metricHasValue = data.metrics.some(metric => {
    const numericValue = Number(metric.value.replace(/[^0-9.]/g, ''))
    return Number.isFinite(numericValue) && numericValue > 0
  })

  const hasData =
    metricHasValue ||
    data.engines.length > 0 ||
    data.workflows.length > 0 ||
    data.flows.length > 0 ||
    data.flowTests.length > 0 ||
    data.flowInsights.length > 0 ||
    data.insights.length > 0 ||
    data.qualitySignals.length > 0 ||
    (data.knowledge && (data.knowledge.sources.length > 0 || data.knowledge.documents.length > 0)) ||
    data.teamAccess.length > 0 ||
    data.integrations.length > 0 ||
    data.outcomes.length > 0 ||
    data.events.length > 0 ||
    outcomes.length > 0 ||
    billing.length > 0

  if (!hasData) {
    return <EmptyState />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Overview Section */}
      <section id="overview" className="pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Overview</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Your AI operations, at a glance.
            </h2>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              All metrics are aggregated and anonymized for security.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs text-[var(--ink-muted)]">
            Reporting window: Last 30 days
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{metric.value}</p>
              {metric.change && <p className="mt-2 text-xs text-[var(--ink-muted)]">{metric.change}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Live Ops Section */}
      {data.engines.length > 0 && (
        <section id="operations">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Live Ops</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Core engines status
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.engines.map((engine) => (
              <div key={engine.title} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-[var(--ink)]">{engine.title}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    engine.status === 'Healthy' || engine.status === 'Active' || engine.status === 'Synced'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : engine.status === 'Degraded'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {engine.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--ink-muted)]">{engine.detail}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{engine.metric}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      {data.events.length > 0 && (
        <section id="activity">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Recent Activity</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Latest conversations and actions
            </h2>
          </div>
          <div className="mt-6 space-y-3">
            {data.events.slice(0, 15).map((event) => (
              <div key={event.id} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">{describeEvent(event)}</span>
                    <span className="text-xs text-[var(--ink-muted)]">•</span>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {new Date(event.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--ink-muted)]">
                    {event.session_id ? `Session ${event.session_id.slice(0, 8)}` : ''}
                  </span>
                </div>
                {event.content && (
                  <p className="mt-2 text-sm text-[var(--ink-muted)] line-clamp-2">{event.content}</p>
                )}
                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                  Site {event.site_id.slice(0, 8)} · Org {event.org_id.slice(0, 8)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Workflows Section */}
      {(data.flows.length > 0 || data.workflows.length > 0) && (
        <section id="automations">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Automations</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
                Flows powering actions
              </h2>
            </div>
            {data.flowTests.length > 0 && (
              <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--ink-muted)]">
                {data.flowTests.filter(test => test.last_result === 'passed').length} / {data.flowTests.length} tests passing
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            {(data.flows.length > 0 ? data.flows : data.workflows).map((flow) => {
              const status = 'status' in flow ? flow.status : 'active'
              const tone = status === 'active' ? 'success' : status === 'draft' || status === 'paused' ? 'warning' : 'neutral'
              return (
                <div key={flow.id || flow.name} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--ink)]">{'name' in flow ? flow.name : 'Unnamed flow'}</p>
                      {'description' in flow && flow.description && (
                        <p className="text-xs text-[var(--ink-muted)] line-clamp-2">{flow.description}</p>
                      )}
                      {'lastRun' in flow && flow.lastRun && (
                        <p className="text-xs text-[var(--ink-muted)]">Last run: {flow.lastRun}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {'trigger' in flow && flow.trigger?.type && (
                        <StatusPill label={`Trigger: ${flow.trigger.type}`} tone="info" />
                      )}
                      <StatusPill label={`Status: ${status}`} tone={tone} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {data.flowTests.length > 0 && (
            <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4">Flow tests</p>
              <div className="space-y-3">
                {data.flowTests.slice(0, 5).map((test) => {
                  const tone = test.last_result === 'passed' ? 'success' : test.last_result === 'failed' ? 'critical' : 'warning'
                  return (
                    <div key={test.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{test.name}</p>
                        <p className="text-xs text-[var(--ink-muted)]">Expected: {test.expected_outcome}</p>
                      </div>
                      <StatusPill label={test.last_result || 'not run'} tone={tone} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {data.flowInsights.length > 0 && (
            <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4">Recent flow runs</p>
              <div className="space-y-3">
                {data.flowInsights.slice(0, 5).map((run) => {
                  const tone = run.outcome === 'success' ? 'success' : run.outcome === 'handoff' ? 'info' : run.outcome === 'failed' ? 'critical' : 'warning'
                  return (
                    <div key={run.run_id} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{run.flow_id}</p>
                        <p className="text-xs text-[var(--ink-muted)]">
                          {new Date(run.started_at).toLocaleString()} · {Math.round(run.duration_ms)} ms
                        </p>
                      </div>
                      <StatusPill label={run.outcome} tone={tone} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Outcomes Section */}
      <section id="outcomes">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Outcomes</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
            Proof of impact across inbox, bookings, and revenue
          </h2>
        </div>
        {data.outcomes.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.outcomes.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                  {item.change && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.status === 'down'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : item.status === 'flat'
                        ? 'bg-[var(--paper-muted)] text-[var(--ink-muted)]'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }`}>
                      {item.change}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{item.value}</p>
                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                  {item.note || item.horizon || 'Last 30 days'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--ink)]">Outcome tracking coming online</p>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Once flows are paired with billing, scheduling, and CRM actions, we&apos;ll show closed-loop outcomes here—bookings, payments, recoveries, and review wins.
            </p>
          </div>
        )}
      </section>

      {/* Knowledge Section */}
      <section id="knowledge">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Knowledge</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Sources, versions, and policy guardrails
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--ink-muted)]">
            <span className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1">
              {data.knowledge?.sources.length || 0} sources
            </span>
            <span className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1">
              {data.knowledge?.documents.length || 0} documents
            </span>
            <span className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1">
              {data.knowledge?.policies.length || 0} policies
            </span>
          </div>
        </div>

        {data.knowledge && data.knowledge.sources.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.knowledge.sources.map((source) => {
              const tone = source.status === 'connected'
                ? 'success'
                : source.status === 'syncing'
                ? 'warning'
                : source.status === 'error'
                ? 'critical'
                : 'neutral'
              return (
                <div key={source.id} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{source.name}</p>
                      <p className="text-xs text-[var(--ink-muted)] capitalize">{source.type} source</p>
                    </div>
                    <StatusPill label={source.status} tone={tone} />
                  </div>
                  <p className="mt-3 text-xs text-[var(--ink-muted)]">
                    {source.last_synced_at
                      ? `Last synced ${new Date(source.last_synced_at).toLocaleString()}`
                      : 'Waiting on first sync'}
                  </p>
                  {source.error_message && (
                    <p className="mt-2 text-xs text-red-600">{source.error_message}</p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--ink)]">No sources connected yet</p>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Link files, URLs, and apps to ground the assistant. Sync status and errors will show here once Agent 3 plugs in ingestion.
            </p>
          </div>
        )}

        {data.knowledge && data.knowledge.documents.length > 0 && (
          <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4">Latest documents</p>
            <div className="space-y-3">
              {data.knowledge.documents.slice(0, 4).map((doc) => {
                const tone = doc.status === 'ready' ? 'success' : doc.status === 'processing' ? 'warning' : doc.status === 'failed' ? 'critical' : 'neutral'
                return (
                  <div key={doc.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{doc.title}</p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {doc.mime_type || 'Unknown type'} · {doc.size_bytes ? `${Math.round(doc.size_bytes / 1024)} KB` : 'Size pending'}
                      </p>
                    </div>
                    <StatusPill label={doc.status} tone={tone} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {data.qualitySignals.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.qualitySignals.map((signal) => (
              <div key={signal.title} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold text-[var(--ink)]">{signal.title}</p>
                <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{signal.value}</p>
                <p className="mt-2 text-xs text-[var(--ink-muted)]">{signal.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Integrations Section */}
      <section id="integrations">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Integrations</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
            Systems connected for sync + actions
          </h2>
        </div>
        {data.integrations.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.integrations.map((integration) => {
              const status = integration.status || 'pending'
              return (
                <div key={integration.id} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{integration.name}</p>
                      <p className="text-xs text-[var(--ink-muted)] capitalize">{integration.category} integration</p>
                    </div>
                    <StatusPill
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      tone={
                        status === 'connected'
                          ? 'success'
                          : status === 'pending'
                          ? 'warning'
                          : status === 'error'
                          ? 'critical'
                          : 'neutral'
                      }
                    />
                  </div>
                  <p className="mt-3 text-xs text-[var(--ink-muted)]">
                    {integration.lastSynced ? `Last synced ${integration.lastSynced}` : 'Awaiting first sync'}
                  </p>
                  {integration.note && (
                    <p className="mt-2 text-xs text-[var(--ink-muted)]">{integration.note}</p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--ink)]">No integrations connected yet</p>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Connect your CRM, calendars, phone systems, and billing to keep flows in sync and unlock downstream outcomes.
            </p>
          </div>
        )}
      </section>

      {/* Insights Section */}
      {data.insights.length > 0 && (
        <section id="insights">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Insights</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Weekly volume trend
            </h2>
          </div>
          <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-end gap-3">
              {data.insights.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="w-8 rounded-full bg-[var(--accent-soft)]">
                    <div
                      className="rounded-full bg-[var(--accent-strong)]"
                      style={{ height: `${item.value}px` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--ink-muted)]">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--ink-muted)]">
              Volumes include voice, chat, and automation events.
            </p>
          </div>
        </section>
      )}

      {/* Team Section */}
      {data.teamAccess.length > 0 && (
        <section id="team">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Team & Access</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Shared visibility for clients + Koby ops
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.teamAccess.map((entry) => (
              <div key={entry.role} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold text-[var(--ink)]">{entry.role}</p>
                <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{entry.count}</p>
                <p className="mt-2 text-xs text-[var(--ink-muted)]">Active seats</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outcomes Section */}
      {outcomes.length > 0 && (
        <section id="outcome-events">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Outcomes</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
                Actions that proved ROI
              </h2>
            </div>
            <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--ink-muted)]">
              Last {Math.min(outcomes.length, 5)} events
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {outcomes.slice(0, 5).map((event) => (
              <div key={event.id} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{event.outcomeType}</p>
                    {event.label && <p className="text-xs text-[var(--ink-muted)] mt-1">{event.label}</p>}
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    {formatCurrency(event.amountCents)}
                  </span>
                </div>
                {event.actionRunId && (
                  <div className="mt-2">
                    <StatusPill label={`Action run ${event.actionRunId.slice(0, 6)}`} tone="info" />
                  </div>
                )}
                <p className="mt-3 text-xs text-[var(--ink-muted)]">
                  {new Date(event.recordedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Billing Section */}
      {billing.length > 0 && (
        <section id="billing">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Billing</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
                Usage ledger
              </h2>
            </div>
            <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--ink-muted)]">
              {formatCurrency(billing.reduce((acc, record) => acc + (record.amountCents || 0), 0))}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {billing.slice(0, 4).map((record) => (
              <div key={record.id} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{record.usageType}</p>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      {new Date(record.periodStart).toLocaleDateString()} - {new Date(record.periodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--ink)]">{formatCurrency(record.amountCents)}</p>
                    <p className="text-xs text-[var(--ink-muted)]">Status: {record.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PortalPageContent() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  
  const viewingOrgId = searchParams.get('orgId')
  const filterParam = searchParams.get('filter')
  
  // Check if user is Koby staff
  const isKobyStaff = user?.publicMetadata?.kobyRole === 'staff'
  
  // Determine which view to show
  const activeOrgId = viewingOrgId || organization?.id || null
  const showStaffClientsView = isKobyStaff && !activeOrgId
  
  // Portal data state
  const [loadingState, setLoadingState] = useState<LoadingState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [portalData, setPortalData] = useState<PortalData | null>(null)
  const [clients, setClients] = useState<PortalClient[]>([])
  const [outcomeEvents, setOutcomeEvents] = useState<OutcomeEvent[]>([])
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([])

  // Fetch data
  const fetchData = async () => {
    setLoadingState('loading')
    setError(null)

    try {
      const token = await getToken()
      
      if (!token) {
        throw new Error('Not authenticated')
      }

      const authedFetch = async <T,>(path: string): Promise<T | null> => {
        const response = await fetch(`${PORTAL_WORKER_URL}${path}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.status === 404) {
          return null
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch ${path}: ${response.status}`)
        }

        return response.json()
      }

      if (showStaffClientsView) {
        // Fetch clients list for Koby staff
        if (!PORTAL_WORKER_URL) {
          // No worker URL configured - show empty state with message
          setClients([])
          setLoadingState('success')
          return
        }

        const response = await fetch(`${PORTAL_WORKER_URL}/portal/clients${filterParam ? `?filter=${filterParam}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`)
        }

        const data = await response.json()
        setClients(data.clients || [])
        setLoadingState('success')
      } else if (activeOrgId) {
        // Fetch portal data for specific org
        if (!PORTAL_WORKER_URL) {
          // No worker URL configured - show empty state
          setPortalData(getEmptyPortalData())
          setLoadingState('success')
          return
        }

        const [overview, engines, insights, workflows, events, team, integrations, knowledge, flows] = await Promise.all([
          authedFetch<PortalOverviewResponse>(`/portal/overview?orgId=${activeOrgId}`),
          authedFetch<PortalEnginesResponse>(`/portal/engines?orgId=${activeOrgId}`),
          authedFetch<PortalInsightsResponse>(`/portal/insights?orgId=${activeOrgId}`),
          authedFetch<PortalWorkflowsResponse>(`/portal/workflows?orgId=${activeOrgId}`),
          authedFetch<PortalEventsResponse>(`/portal/events?orgId=${activeOrgId}`),
          authedFetch<PortalTeamResponse>(`/portal/team?orgId=${activeOrgId}`),
          authedFetch<PortalIntegrationsResponse>(`/portal/integrations?orgId=${activeOrgId}`),
          authedFetch<KnowledgeOverviewResponse>(`/portal/knowledge?orgId=${activeOrgId}`),
          authedFetch<FlowListResponse>(`/portal/flows?orgId=${activeOrgId}`),
        ])

        let outcomes: OutcomeEvent[] = []
        let billing: BillingRecord[] = []

        if (PORTAL_WORKER_URL) {
          const [outcomesResult, billingResult] = await Promise.allSettled([
            authedFetch<OutcomesResponse>(`/outcomes?orgId=${activeOrgId}`),
            authedFetch<BillingUsageResponse>(`/billing/usage?orgId=${activeOrgId}`),
          ])

          if (outcomesResult.status === 'fulfilled' && outcomesResult.value?.outcomes) {
            outcomes = outcomesResult.value.outcomes
          }

          if (billingResult.status === 'fulfilled' && billingResult.value?.records) {
            billing = billingResult.value.records
          }
        }

        if (!PORTAL_WORKER_URL) {
          const sampleTimestamp = new Date().toISOString()
          outcomes = [
            {
              id: 'sample_outcome',
              orgId: activeOrgId,
              actionRunId: undefined,
              outcomeType: 'lead_captured',
              label: 'Sample outcome (worker disabled)',
              amountCents: 0,
              currency: 'USD',
              recordedAt: sampleTimestamp,
              metadata: {},
            },
          ]
          billing = [
            {
              id: 'sample_billing',
              orgId: activeOrgId,
              usageType: 'actions',
              quantity: 0,
              unitPriceCents: 0,
              amountCents: 0,
              status: 'pending',
              periodStart: sampleTimestamp,
              periodEnd: sampleTimestamp,
              externalInvoiceId: undefined,
              createdAt: sampleTimestamp,
              updatedAt: sampleTimestamp,
            },
          ]
        }

        const overviewData: PortalOverviewResponse = overview || {
          org: null,
          sites: [],
          stats: {
            totalSessions: 0,
            totalMessages: 0,
            avgLatency: 0,
            leadsCapture: 0,
            appointmentsBooked: 0,
            activeSessions: 0,
          },
          period: defaultPeriod(),
        }

        setPortalData(buildPortalData(
          overviewData,
          engines,
          insights,
          workflows,
          events,
          team,
          knowledge,
          flows,
          integrations?.integrations || [],
          buildOutcomeMetrics(outcomes),
        ))
        setOutcomeEvents(outcomes)
        setBillingRecords(billing)
        setLoadingState('success')
      } else {
        // No org context
        setLoadingState('success')
      }
    } catch (err) {
      console.error('Error fetching portal data:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoadingState('error')
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeOrgId, showStaffClientsView, filterParam])

  // Loading state
  if (loadingState === 'loading') {
    return <LoadingSkeleton />
  }

  // Error state
  if (loadingState === 'error' && error) {
    return <ErrorState message={error} onRetry={fetchData} />
  }

  // Koby staff: Show clients list
  if (showStaffClientsView) {
    return (
      <div className="max-w-6xl mx-auto pt-10">
        <KobyClientsList clients={clients} />
      </div>
    )
  }

  // Client/Org view: Show portal dashboard
  if (portalData) {
    return <ClientPortalView data={portalData} outcomes={outcomeEvents} billing={billingRecords} />
  }

  // Fallback empty state
  return <EmptyState />
}

export default function PortalPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PortalPageContent />
    </Suspense>
  )
}
