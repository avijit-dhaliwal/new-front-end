'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

// Tool integrations with actual tool names relevant to businesses
const integrations = [
  { name: 'Slack', icon: '💬', color: '#4A154B' },
  { name: 'HubSpot', icon: '🧲', color: '#FF7A59' },
  { name: 'Salesforce', icon: '☁️', color: '#00A1E0' },
  { name: 'Calendly', icon: '📅', color: '#006BFF' },
  { name: 'Stripe', icon: '💳', color: '#635BFF' },
  { name: 'Zapier', icon: '⚡', color: '#FF4A00' },
  { name: 'Google', icon: '🔍', color: '#4285F4' },
  { name: 'Zendesk', icon: '💚', color: '#03363D' },
  { name: 'Intercom', icon: '💙', color: '#1F8DED' },
  { name: 'Mailchimp', icon: '🐵', color: '#FFE01B' },
  { name: 'Twilio', icon: '📱', color: '#F22F46' },
  { name: 'Shopify', icon: '🛒', color: '#96BF48' },
]

export default function IntegrationsSection() {
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-blue-600 text-sm font-medium">Integrations</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Works seamlessly with the
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-300">
            tools you already use.
          </p>
        </motion.div>

        {/* Integration Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 lg:gap-6 mb-16">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group cursor-pointer hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col items-center">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl lg:text-3xl">{integration.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {integration.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 py-8 border-t border-gray-100"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 text-sm">No-code setup in minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 text-sm">50+ integrations available</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 text-sm">Custom API available</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
