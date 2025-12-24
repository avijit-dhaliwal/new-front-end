'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Check, MessageCircle, Phone, Crown, Sparkles, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'AI Chatbot',
    price: '50',
    description: '24/7 customer support and lead capture',
    icon: MessageCircle,
    features: [
      'Always-on chat support',
      'Multi-language support',
      'Calendar integration',
      'Lead qualification',
      'Custom responses',
      'Analytics dashboard',
    ],
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Bundle Pack',
    price: '425',
    description: 'Chatbot + phone service combined',
    icon: Crown,
    features: [
      'Everything in Chatbot',
      'Everything in Phone Service',
      'Unified reporting',
      'Priority support',
      'Save $25 per month',
      'Custom integrations',
    ],
    cta: 'Get started',
    popular: true,
  },
  {
    name: 'AI Phone Service',
    price: '400',
    description: 'Virtual receptionist for your business',
    icon: Phone,
    features: [
      'Unlimited calls handled',
      '24/7 availability',
      'Custom greeting setup',
      'Calendar integration',
      'Call transcriptions',
      'Voicemail management',
    ],
    cta: 'Get started',
    popular: false,
  },
]

export default function SimplePricingSection() {
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[var(--paper-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Pricing</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[var(--ink)]">
            Clear pricing, built to scale.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            Start with a core module or bundle for full coverage. Enterprise plans available for custom deployments.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={plan.popular ? 'md:-mt-4' : ''}
            >
              <div className={`relative h-full rounded-3xl border p-6 lg:p-8 shadow-[var(--shadow-soft)] ${
                plan.popular
                  ? 'border-[var(--accent-soft)] bg-[var(--panel)]'
                  : 'border-[var(--line)] bg-[var(--panel)]'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-strong)] px-4 py-1.5 text-xs font-semibold text-white shadow-[var(--shadow-soft)]">
                      <Sparkles className="w-4 h-4" />
                      Best value
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] flex items-center justify-center">
                    <plan.icon className="w-6 h-6 text-[var(--accent-strong)]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{plan.name}</h3>
                  <p className="mt-2 text-sm text-[var(--ink-muted)]">{plan.description}</p>
                  <div className="mt-4 flex items-baseline justify-center gap-2">
                    <span className="text-sm text-[var(--ink-muted)]">Starting at</span>
                    <span className="text-4xl font-semibold text-[var(--ink)]">${plan.price}</span>
                    <span className="text-sm text-[var(--ink-muted)]">/month</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--ink-muted)]">
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                        <Check className="h-3 w-3 text-[var(--accent-strong)]" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="mt-6 block">
                  <button className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-[var(--accent-strong)] text-white hover:shadow-[var(--shadow-soft)]'
                      : 'bg-[var(--paper-muted)] text-[var(--ink)] hover:bg-[var(--panel)]'
                  }`}>
                    {plan.cta}
                    <ArrowRight className="inline-block w-4 h-4 ml-2" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[var(--ink-muted)]">Need a custom solution?</p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--accent-strong)]"
          >
            Contact us for enterprise pricing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
