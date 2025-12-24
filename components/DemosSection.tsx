'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const demos = [
  {
    title: 'Voice Receptionist',
    description: 'See how calls are answered, routed, and summarized in seconds.',
    href: '/demo/voice',
    badge: 'Live demo',
  },
  {
    title: 'AI Chat Concierge',
    description: 'Lead capture and appointment booking without human intervention.',
    href: '/demo/chat',
    badge: 'Live demo',
  },
  {
    title: 'Law Intake + RAG',
    description: 'Document intake with citations and compliance guardrails.',
    href: '/contact',
    badge: 'Request access',
  },
  {
    title: 'Healthcare Triage',
    description: 'HIPAA-ready routing and scheduling for clinics.',
    href: '/contact',
    badge: 'Request access',
  },
  {
    title: 'HVAC Dispatch',
    description: 'Job scheduling, reminders, and invoice triggers in one flow.',
    href: '/contact',
    badge: 'Request access',
  },
  {
    title: 'Payroll + Invoicing',
    description: 'Automated checks, approvals, and collections workflows.',
    href: '/contact',
    badge: 'Request access',
  },
]

export default function DemosSection() {
  return (
    <section id="demos" className="py-24 lg:py-32 bg-[var(--paper-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Demo studio</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Explore the workflows before you buy.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
              Each demo shows how Koby handles real operations without exposing sensitive data or provider names.
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-[var(--ink)]">Demo highlights</p>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Voice, chat, and automation are all connected with one knowledge layer, giving your teams a single source of truth.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--accent-strong)]"
            >
              Schedule a custom walkthrough
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--ink)]">{demo.title}</p>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                  {demo.badge}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--ink-muted)]">{demo.description}</p>
              <Link
                href={demo.href}
                className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--accent-strong)]"
              >
                View demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
