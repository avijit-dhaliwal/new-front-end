'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const industries = [
  {
    name: 'Law',
    focus: 'Client intake and document review',
    deliverable: 'Local LLM with citations',
  },
  {
    name: 'Healthcare',
    focus: 'Patient triage and scheduling',
    deliverable: 'HIPAA-ready voice and chat',
  },
  {
    name: 'HVAC',
    focus: 'Dispatch, quoting, and follow-up',
    deliverable: 'Call and SMS agent',
  },
  {
    name: 'Payroll',
    focus: 'Onboarding and compliance checks',
    deliverable: 'Automated workflows',
  },
  {
    name: 'Invoicing',
    focus: 'AR follow-up and collections',
    deliverable: 'Finance automations',
  },
  {
    name: 'Real Estate',
    focus: 'Lead qualification and tours',
    deliverable: '24/7 inquiry desk',
  },
  {
    name: 'Dental',
    focus: 'Appointment reminders',
    deliverable: 'Voice plus calendar sync',
  },
  {
    name: 'Logistics',
    focus: 'Order status and routing',
    deliverable: 'Multi-channel support',
  },
]

export default function TrustedBySection() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--paper-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Industry playbooks</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
            Built for specialized teams and complex workflows.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            We ship tailored AI systems for law firms, clinics, HVAC teams, payroll providers, and more. Every build is grounded in your data and processes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6"
        >
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Local LLM foundations</p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">Private, compliant, and deeply integrated.</h3>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              Keep sensitive data local while still delivering real-time automation across scheduling, billing, and customer support.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--ink-muted)]">
              <div className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Private model hosting and retrieval
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Structured data + unstructured knowledge
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Audit logs and policy controls
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Secure handoff to human teams
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Delivery timeline</p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">From discovery to live AI in weeks.</h3>
            <div className="mt-4 space-y-3 text-sm text-[var(--ink-muted)]">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-[var(--line)] flex items-center justify-center text-xs">01</span>
                Map workflows and gather data sources
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-[var(--line)] flex items-center justify-center text-xs">02</span>
                Configure local models, guardrails, and tools
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-[var(--line)] flex items-center justify-center text-xs">03</span>
                Launch pilot with analytics and QA dashboards
              </div>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--accent-strong)]"
            >
              Talk to our team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((industry) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]"
            >
              <h4 className="text-base font-semibold text-[var(--ink)]">{industry.name}</h4>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">{industry.focus}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--accent-strong)]">{industry.deliverable}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
