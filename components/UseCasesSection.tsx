'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { MessageSquare, Phone, Cpu, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const products = [
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Engage customers 24/7 with intelligent, human-like conversations. Qualify leads, answer questions, and book appointments automatically.',
    href: '/chatbot',
    gradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50',
    features: ['24/7 availability', 'Multi-language support', 'Lead qualification', 'Calendar booking'],
    preview: {
      type: 'chat',
      messages: [
        { sender: 'Customer', time: '2:34 PM', text: 'Hi, I need help with your pricing plans' },
        { sender: 'Koby AI', time: '2:34 PM', text: "I'd be happy to help! We have three plans: Chatbot ($50/mo), Phone Service ($400/mo), or Bundle ($425/mo). What features are most important to you?" },
      ]
    }
  },
  {
    icon: Phone,
    title: 'AI Phone Service',
    description: 'Never miss a call with our AI virtual receptionist. Handle inquiries, schedule appointments, and route urgent calls 24/7.',
    href: '/phone-service',
    gradient: 'from-green-500 to-green-600',
    lightBg: 'bg-green-50',
    features: ['Unlimited calls', 'Custom greetings', 'Call transcription', 'Smart routing'],
    preview: {
      type: 'voice',
      content: {
        title: 'Koby AI',
        subtitle: 'Virtual Receptionist',
        status: 'Handling call...',
        caller: 'John Smith',
      }
    }
  },
  {
    icon: Cpu,
    title: 'Automations',
    description: 'Connect all your software to eliminate manual work. Automate invoices, CRM updates, scheduling, and more.',
    href: '/ai-suites',
    gradient: 'from-orange-500 to-orange-600',
    lightBg: 'bg-orange-50',
    features: ['No manual entry', 'Reduce errors', 'Sync all data', 'Custom workflows'],
    preview: {
      type: 'dashboard',
      stats: [
        { label: 'Tasks Automated', value: '234' },
        { label: 'Hours Saved', value: '47' },
        { label: 'Accuracy', value: '99%' },
      ]
    }
  },
]

// Mini chat preview component
function ChatPreview({ messages }: { messages: { sender: string; time: string; text: string }[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-full">
      <div className="space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              msg.sender === 'Koby AI' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {msg.sender === 'Koby AI' ? 'AI' : 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-gray-900">{msg.sender}</span>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Voice preview component
function VoicePreview({ content }: { content: { title: string; subtitle: string; status: string; caller: string } }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-5 w-full">
      <div className="flex items-center gap-1.5 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-white font-semibold text-sm">{content.title}</h4>
        <p className="text-gray-400 text-xs">{content.subtitle}</p>
      </div>
      <div className="bg-gray-800/50 rounded-xl px-4 py-3 text-center">
        <p className="text-green-400 text-xs animate-pulse">{content.status}</p>
        <p className="text-white text-sm mt-1">Caller: {content.caller}</p>
      </div>
    </div>
  )
}

// Dashboard preview component
function DashboardPreview({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900">Today's Overview</h4>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Live</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UseCasesSection() {
  const ref = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-gray-600 text-sm font-medium">Our Products</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            AI Solutions That Work
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-300">
            For You, 24/7.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${product.lightBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <product.icon className={`w-6 h-6 text-gray-700`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Preview */}
                <div className="flex-1 flex items-center justify-center py-4">
                  <motion.div
                    animate={{
                      y: hoveredIndex === index ? -5 : 0,
                      scale: hoveredIndex === index ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {product.preview.type === 'chat' && (
                      <ChatPreview messages={product.preview.messages!} />
                    )}
                    {product.preview.type === 'voice' && (
                      <VoicePreview content={product.preview.content!} />
                    )}
                    {product.preview.type === 'dashboard' && (
                      <DashboardPreview stats={product.preview.stats!} />
                    )}
                  </motion.div>
                </div>

                {/* CTA */}
                <Link href={product.href} className="mt-auto">
                  <button className={`w-full py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center group/btn bg-gray-100 text-gray-900 hover:bg-gray-200`}>
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
