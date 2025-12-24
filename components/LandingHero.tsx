'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const highlights = [
  'Local LLMs for regulated teams',
  'Voice, chat, and automation in one stack',
  'RAG with citations and guardrails',
  'Deploy on cloud, VPC, or on-prem',
]

const snapshotSteps = [
  {
    title: 'Ingest',
    description: 'Calls, chat, email, and documents flow into one intake layer.',
  },
  {
    title: 'Reason',
    description: 'Local models, retrieval, and routing decide next best action.',
  },
  {
    title: 'Act',
    description: 'Automations update systems, schedule work, and close loops.',
  },
]

const snapshotStats = [
  { label: 'Coverage', value: '24/7' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Pilot', value: '2-4 weeks' },
]

const moduleTags = ['Voice AI', 'Chat AI', 'Automations', 'Knowledge']

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-28 lg:pt-32 pb-20 noise-overlay">
      <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
      <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute -bottom-24 left-[-5%] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]"
            >
              Koby AI operations platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[var(--ink)]"
            >
              Intelligence that answers, acts, and scales your business.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-base sm:text-lg text-[var(--ink-muted)] max-w-2xl"
            >
              We design production-ready AI systems that handle customer conversations, automate back-office work, and run on your preferred infrastructure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/get-started"
                className="btn-primary"
              >
                Start a pilot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/ai-suites"
                className="btn-secondary"
              >
                View platform
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--ink-muted)]"
            >
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="relative"
          >
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">System snapshot</p>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">Live</span>
              </div>

              <div className="mt-6 space-y-4">
                {snapshotSteps.map((step) => (
                  <div key={step.title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--ink)]">{step.title}</p>
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {moduleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {snapshotStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-[var(--ink)]">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden lg:block rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Launch notes</p>
              <p className="mt-1 text-sm text-[var(--ink)]">Pilot to production in days, not weeks.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
