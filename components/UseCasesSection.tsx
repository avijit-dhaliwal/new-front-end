'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Phone, Sparkles, Cpu, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const solutions = [
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Capture leads, answer questions, and guide customers to the next step.',
    href: '/chatbot',
    tags: ['Lead capture', 'FAQ automation', 'Booking flows'],
    detail: 'Web, SMS, and in-app experiences with your brand voice.',
  },
  {
    icon: Phone,
    title: 'AI Phone Service',
    description: 'Voice agents that handle calls, route urgency, and schedule jobs.',
    href: '/phone-service',
    tags: ['Call routing', 'Appointment booking', 'Transcriptions'],
    detail: 'Always-on coverage with graceful human handoff.',
  },
  {
    icon: Sparkles,
    title: 'Automations',
    description: 'Orchestrate workflows across CRM, finance, and operations.',
    href: '/ai-suites',
    tags: ['CRM updates', 'Invoicing', 'Task handoff'],
    detail: 'Reduce manual work while keeping oversight in the loop.',
  },
  {
    icon: Cpu,
    title: 'Local LLMs',
    description: 'Private models and knowledge layers for sensitive data.',
    href: '/contact',
    tags: ['VPC or on-prem', 'RAG with citations', 'Model routing'],
    detail: 'Ideal for legal, healthcare, payroll, and finance teams.',
  },
]

export default function UseCasesSection() {
  const ref = useRef(null)

  return (
    <section id="solutions" ref={ref} className="py-24 lg:py-32 bg-[var(--paper-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Solutions</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
            Products built for real operations.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            Mix and match modules or ship a full platform. Every build ships with analytics, quality monitoring, and secure deployment options.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <div className="h-full rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] flex items-center justify-center">
                        <solution.icon className="h-5 w-5 text-[var(--accent-strong)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--ink)]">{solution.title}</h3>
                        <p className="mt-1 text-sm text-[var(--ink-muted)]">{solution.description}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={solution.href}
                    className="text-sm font-semibold text-[var(--accent-strong)] inline-flex items-center gap-2"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {solution.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--line)] bg-[var(--paper-muted)] px-3 py-1 text-xs text-[var(--ink-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm text-[var(--ink-muted)]">{solution.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
