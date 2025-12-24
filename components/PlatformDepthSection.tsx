'use client'

import { motion } from 'framer-motion'

const layers = [
  {
    title: 'Agent Builder',
    description: 'Design multi-step agents that can call tools, request approvals, and keep context.',
  },
  {
    title: 'Knowledge + RAG',
    description: 'Vector search, citations, and structured data grounding for high-stakes answers.',
  },
  {
    title: 'Voice & Multichannel',
    description: 'Phone, SMS, chat, and email orchestration with one memory layer.',
  },
  {
    title: 'Automation Studio',
    description: 'Workflow triggers, approvals, and integrations across your stack.',
  },
  {
    title: 'Observability',
    description: 'Eval suites, drift tracking, QA dashboards, and audit logs.',
  },
  {
    title: 'Security & Compliance',
    description: 'RBAC, redaction, data residency, and policy enforcement baked in.',
  },
]

const proofPoints = [
  { label: 'Deployment options', value: 'Cloud, VPC, on-prem' },
  { label: 'Data handling', value: 'Encrypted + audited' },
  { label: 'Model routing', value: 'Best model per task' },
  { label: 'Human handoff', value: 'Escalation ready' },
]

export default function PlatformDepthSection() {
  return (
    <section id="platform" className="py-24 lg:py-32 bg-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Platform depth</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Everything you need to run AI in production.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
              We build full-stack AI platforms, not single features. Each layer is designed to scale with compliance, reliability, and measurable outcomes.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {proofPoints.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {layers.map((layer) => (
              <div key={layer.title} className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                <p className="text-base font-semibold text-[var(--ink)]">{layer.title}</p>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{layer.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
