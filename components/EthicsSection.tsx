'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Clock, HeartHandshake, BarChart3, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security protocols. SOC 2 compliant and HIPAA ready for sensitive industries.',
    lightBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Setup',
    description: 'Get started in minutes, not months. Our no-code platform means you can deploy AI solutions without technical expertise.',
    lightBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Your AI assistants never sleep, take breaks, or call in sick. Handle customer inquiries around the clock.',
    lightBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: HeartHandshake,
    title: 'Human-Like Conversations',
    description: 'Powered by advanced AI models that understand context, nuance, and can handle complex customer needs naturally.',
    lightBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Actionable Analytics',
    description: 'Track performance, monitor conversations, and gain insights to continuously improve your customer experience.',
    lightBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Our team is here to help you succeed. Get personalized onboarding and ongoing support from AI experts.',
    lightBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
]

export default function EthicsSection() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-green-600 text-sm font-medium">Why Koby AI</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Built for Businesses
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-300">
            That Demand More
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300 h-full">
                <div className={`w-12 h-12 ${feature.lightBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
