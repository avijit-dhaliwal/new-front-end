'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO, TechFlow Inc.',
    text: 'Koby AI reduced our response times from hours to minutes. The team shipped a production-ready system that our ops staff trusts.',
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Practice Manager, WellCare Medical',
    text: 'The phone service handles scheduling flawlessly. We can finally focus on patient care instead of call queues.',
  },
  {
    name: 'Lisa Thompson',
    role: 'Real Estate Broker, Premier Properties',
    text: 'Lead qualification runs 24/7 now. Our conversion rate is up and every inquiry gets a clear next step.',
  },
  {
    name: 'Robert Martinez',
    role: 'Partner, Martinez Law Firm',
    text: 'Client intake is faster and more accurate. The local model keeps sensitive data where it belongs.',
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]"
    >
      <p className="text-sm text-[var(--ink-muted)]">"{testimonial.text}"</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full border border-[var(--line)] bg-[var(--paper-muted)] flex items-center justify-center text-sm font-semibold text-[var(--ink)]">
          {testimonial.name.split(' ').map((part) => part[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">{testimonial.name}</p>
          <p className="text-xs text-[var(--ink-muted)]">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function NewTestimonialsSection() {
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Customer stories</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
            Proof that the systems work.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            Operations teams trust Koby to deliver consistent, measurable improvements across every channel.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
