'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const integrations = [
  'Slack',
  'HubSpot',
  'Salesforce',
  'Calendly',
  'Stripe',
  'Zapier',
  'Google Workspace',
  'Zendesk',
  'Intercom',
  'Mailchimp',
  'Twilio',
  'Shopify',
]

const integrationStats = [
  { label: 'Setup time', value: 'Days, not months' },
  { label: 'Data sync', value: 'Bi-directional' },
  { label: 'Custom API', value: 'Supported' },
]

export default function IntegrationsSection() {
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Integrations</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Connected to the tools you already trust.
            </h2>
            <p className="mt-4 text-base text-[var(--ink-muted)]">
              Koby connects to your CRM, scheduling, billing, and support stack so every workflow stays in sync.
            </p>
            <div className="mt-6 space-y-3 text-sm text-[var(--ink-muted)]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                No-code setup with secure credentials
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Webhooks and custom endpoints for advanced routing
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Real-time reporting across every channel
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {integrationStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">{stat.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {integrations.map((integration) => (
              <div
                key={integration}
                className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--ink-muted)] shadow-[var(--shadow-soft)]"
              >
                {integration}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
