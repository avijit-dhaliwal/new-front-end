'use client'

import { motion } from 'framer-motion'
import { Shield, Server, Database, Phone, Settings, LineChart } from 'lucide-react'

const features = [
  {
    icon: Server,
    title: 'Local LLM deployments',
    description: 'Run in your VPC or on-prem with full control over data residency.',
  },
  {
    icon: Database,
    title: 'Grounded knowledge layers',
    description: 'RAG pipelines with citations, structured data, and policy guardrails.',
  },
  {
    icon: Phone,
    title: 'Voice and telephony',
    description: 'Phone, SMS, and voicemail agents with live transfers and summaries.',
  },
  {
    icon: Settings,
    title: 'Workflow automation',
    description: 'Tool calls across CRM, payroll, invoicing, and scheduling systems.',
  },
  {
    icon: LineChart,
    title: 'Observability and QA',
    description: 'Monitor quality, evaluate runs, and improve outcomes over time.',
  },
  {
    icon: Shield,
    title: 'Security by design',
    description: 'Audit logs, role-based access, and compliance-ready controls.',
  },
]

export default function EthicsSection() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Capabilities</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
            Built to ship AI that your team can trust.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            From private model hosting to end-to-end automation, we deliver the full stack required to run AI in production.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="h-11 w-11 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-[var(--accent-strong)]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
