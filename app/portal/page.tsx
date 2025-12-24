const metrics = [
  { label: 'Calls handled', value: '12,482', change: '+14% vs last month' },
  { label: 'Chats resolved', value: '38,910', change: '+9% vs last month' },
  { label: 'Leads qualified', value: '4,380', change: '+18% vs last month' },
  { label: 'Appointments booked', value: '2,106', change: 'Stable week-over-week' },
  { label: 'Automation hours saved', value: '1,240', change: 'Across ops + finance' },
  { label: 'Avg response time', value: '42s', change: 'Across voice and chat' },
]

const engines = [
  {
    title: 'Voice Engine',
    status: 'Healthy',
    detail: '24/7 coverage with live escalation.',
    metric: '99.9% uptime',
  },
  {
    title: 'Chat Engine',
    status: 'Healthy',
    detail: 'Multi-channel support and lead capture.',
    metric: '97% resolution rate',
  },
  {
    title: 'Knowledge Engine',
    status: 'Synced',
    detail: 'RAG with citations and policy guardrails.',
    metric: '92% answer confidence',
  },
  {
    title: 'Automation Engine',
    status: 'Active',
    detail: 'Workflow orchestration across your stack.',
    metric: '421 runs this week',
  },
]

const workflows = [
  {
    name: 'Client intake + scheduling',
    lastRun: '12 minutes ago',
    outcome: '224 appointments booked this week',
  },
  {
    name: 'HVAC dispatch + follow-up',
    lastRun: '45 minutes ago',
    outcome: '98% routing accuracy',
  },
  {
    name: 'Payroll onboarding checks',
    lastRun: 'Today, 8:12 AM',
    outcome: '52 new hires processed',
  },
  {
    name: 'AR invoicing reminders',
    lastRun: 'Yesterday, 6:40 PM',
    outcome: '$84K collected this month',
  },
]

const insights = [
  { label: 'Mon', value: 68 },
  { label: 'Tue', value: 82 },
  { label: 'Wed', value: 76 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 88 },
  { label: 'Sat', value: 64 },
  { label: 'Sun', value: 71 },
]

const qualitySignals = [
  { title: 'Escalation rate', value: '3.8%', note: 'Below target threshold' },
  { title: 'Guardrail triggers', value: '12', note: 'Reviewed and resolved' },
  { title: 'Top issue cluster', value: 'Scheduling edits', note: 'Automation update queued' },
]

const teamAccess = [
  { role: 'Client admins', count: '4' },
  { role: 'Client viewers', count: '16' },
  { role: 'Koby operators', count: '3' },
]

export default function PortalPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <section id="overview" className="pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Overview</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Your AI operations, at a glance.</h2>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">All metrics are aggregated and anonymized for security.</p>
          </div>
          <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs text-[var(--ink-muted)]">
            Reporting window: Last 30 days
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{metric.value}</p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">{metric.change}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="operations">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Live Ops</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Core engines status</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {engines.map((engine) => (
            <div key={engine.title} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-[var(--ink)]">{engine.title}</p>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">{engine.status}</span>
              </div>
              <p className="mt-3 text-sm text-[var(--ink-muted)]">{engine.detail}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{engine.metric}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="automations">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Automations</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Workflows running right now</h2>
        </div>
        <div className="mt-6 space-y-3">
          {workflows.map((workflow) => (
            <div key={workflow.name} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{workflow.name}</p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">Last run: {workflow.lastRun}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">{workflow.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="knowledge">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Knowledge</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Grounded insights and guardrails</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {qualitySignals.map((signal) => (
            <div key={signal.title} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold text-[var(--ink)]">{signal.title}</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{signal.value}</p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">{signal.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="integrations">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Integrations</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Connected stack health</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--ink)]">Core systems</p>
            <p className="mt-2 text-xs text-[var(--ink-muted)]">CRM, scheduling, billing, messaging, and BI are synced.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['CRM', 'Scheduling', 'Billing', 'Messaging', 'Warehouse', 'Analytics'].map((item) => (
                <span key={item} className="rounded-full border border-[var(--line)] bg-[var(--paper-muted)] px-3 py-1 text-xs text-[var(--ink-muted)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--ink)]">Sync status</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--ink-muted)]">
              <div className="flex items-center justify-between">
                <span>Bi-directional sync</span>
                <span className="text-[var(--accent-strong)]">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Latency</span>
                <span>Under 2 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sync errors</span>
                <span>0 in last 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="insights">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Insights</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Weekly volume trend</h2>
        </div>
        <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-end gap-3">
            {insights.map((item) => (
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
          <p className="mt-4 text-xs text-[var(--ink-muted)]">Volumes include voice, chat, and automation events.</p>
        </div>
      </section>

      <section id="team">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Team & Access</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">Shared visibility for clients + Koby ops</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamAccess.map((entry) => (
            <div key={entry.role} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold text-[var(--ink)]">{entry.role}</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">{entry.count}</p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">Active seats</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
