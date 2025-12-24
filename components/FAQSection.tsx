'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'How does the AI chatbot work?',
    answer: 'Our AI chatbot uses advanced language models to understand customer inquiries and respond in your brand voice. It can qualify leads, answer FAQs, and book appointments directly into your calendar.',
  },
  {
    question: 'What is included in the AI Phone Service?',
    answer: 'The phone service includes a virtual receptionist that answers calls 24/7, handles common requests, schedules appointments, and routes urgent calls. You also get call transcriptions and analytics.',
  },
  {
    question: 'How long does setup take?',
    answer: 'Most chatbot deployments go live in 24-48 hours. Voice and automation builds typically launch in 1-2 weeks depending on integrations.',
  },
  {
    question: 'Can we use local LLMs or private hosting?',
    answer: 'Yes. We support VPC and on-prem deployments with private models, data residency controls, and audit-ready logging.',
  },
  {
    question: 'What industries do you serve?',
    answer: 'We serve healthcare, legal, real estate, HVAC, payroll, invoicing, retail, and professional services. Each deployment is tailored to your workflows.',
  },
  {
    question: 'Is our data secure?',
    answer: 'Security is built into every deployment. We use encryption at rest and in transit, maintain audit logs, and support compliance-ready controls.',
  },
  {
    question: 'What is the pricing model?',
    answer: 'Pricing is transparent and modular. Start with a chatbot, a voice agent, or a full bundle. Enterprise pricing is available for custom deployments.',
  },
]

function FAQItem({ faq, isOpen, onClick, index }: {
  faq: typeof faqs[0]
  isOpen: boolean
  onClick: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-[var(--line)] last:border-b-0"
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-start justify-between text-left"
      >
        <span className="text-base sm:text-lg font-medium text-[var(--ink)] pr-8">
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-[var(--line)] transition-colors ${
          isOpen ? 'bg-[var(--accent-soft)]' : 'bg-[var(--paper-muted)]'
        }`}>
          {isOpen ? (
            <Minus className="w-4 h-4 text-[var(--accent-strong)]" />
          ) : (
            <Plus className="w-4 h-4 text-[var(--ink-muted)]" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-[var(--ink-muted)] leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 lg:py-32 bg-[var(--paper)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">FAQ</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
            Answers for every stage.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            Learn how we deploy, integrate, and support AI systems across your organization.
          </p>
        </motion.div>

        <div className="mt-12 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6 shadow-[var(--shadow-soft)]">
          <div className="divide-y divide-[var(--line)]">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                index={index}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-[var(--ink-muted)]">Still have questions?</p>
          <a
            href="/contact"
            className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--accent-strong)]"
          >
            Contact our team
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
