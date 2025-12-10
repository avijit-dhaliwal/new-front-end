'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Industry icons representing who uses Koby AI
const industries = [
  { name: 'Healthcare', icon: '🏥' },
  { name: 'Real Estate', icon: '🏠' },
  { name: 'Legal', icon: '⚖️' },
  { name: 'Retail', icon: '🛒' },
  { name: 'Hospitality', icon: '🏨' },
  { name: 'Finance', icon: '💰' },
  { name: 'Dental', icon: '🦷' },
  { name: 'Insurance', icon: '🛡️' },
  { name: 'Marketing', icon: '📈' },
  { name: 'Education', icon: '📚' },
  { name: 'Automotive', icon: '🚗' },
  { name: 'Tech', icon: '💻' },
]

// Split into rows
const row1 = industries.slice(0, 6)
const row2 = industries.slice(6)

function MarqueeRow({ items, direction = 'left', speed = 30 }: {
  items: typeof row1
  direction?: 'left' | 'right'
  speed?: number
}) {
  return (
    <div className="relative overflow-hidden py-3">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <motion.div
        animate={{
          x: direction === 'left' ? [0, -50 * items.length] : [-50 * items.length, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        className="flex gap-6"
      >
        {/* Triple the items for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors duration-200 cursor-default flex-shrink-0"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-gray-700 font-medium whitespace-nowrap text-sm">{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function TrustedBySection() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Serving Every Industry
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From healthcare to retail, Koby AI powers customer engagement for businesses of all sizes across every sector.
          </p>
        </motion.div>
      </div>

      {/* Marquee Rows - Full width */}
      <div className="space-y-2 mb-12">
        <MarqueeRow items={row1} direction="left" speed={35} />
        <MarqueeRow items={row2} direction="right" speed={40} />
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all group"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
