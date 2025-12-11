'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Star } from 'lucide-react'

// Floating app icons - representing Koby AI products
const floatingIcons = [
  { id: 1, icon: '💬', label: 'Chatbot', x: '8%', y: '18%', size: 56, delay: 0 },
  { id: 2, icon: '📞', label: 'Phone AI', x: '85%', y: '22%', size: 52, delay: 0.2 },
  { id: 3, icon: '🏥', label: 'Healthcare', x: '12%', y: '65%', size: 48, delay: 0.4 },
  { id: 4, icon: '🏠', label: 'Real Estate', x: '88%', y: '58%', size: 54, delay: 0.6 },
  { id: 5, icon: '📈', label: 'Marketing', x: '5%', y: '42%', size: 44, delay: 0.8 },
  { id: 6, icon: '⚖️', label: 'Legal', x: '92%', y: '40%', size: 46, delay: 1.0 },
  { id: 7, icon: '🛒', label: 'Retail', x: '15%', y: '85%', size: 50, delay: 1.2 },
  { id: 8, icon: '🤖', label: 'Automation', x: '82%', y: '78%', size: 48, delay: 1.4 },
]

// Animated counter component
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => {
    if (value >= 1000) {
      return `${prefix}${Math.round(latest).toLocaleString()}${suffix}`
    }
    return `${prefix}${Math.round(latest)}${suffix}`
  })
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1],
    })

    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v))

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, count, rounded, prefix, suffix])

  return <span>{displayValue}</span>
}

// Floating Icon Component
function FloatingIcon({ icon, label, x, y, size, delay }: {
  icon: string
  label: string
  x: string
  y: string
  size: number
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay + 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="absolute z-10 group cursor-pointer"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay,
        }}
        whileHover={{ scale: 1.15 }}
        className="relative"
      >
        <div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transition-shadow duration-300 hover:shadow-2xl"
          style={{ width: size, height: size }}
        >
          <span style={{ fontSize: size * 0.45 }}>{icon}</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap"
        >
          {label}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const stats = [
  { value: 50, suffix: '+', label: 'Happy Clients' },
  { value: 24, suffix: '/7', label: 'AI Availability' },
  { value: 99.9, suffix: '%', label: 'Uptime' },
  { value: 21, suffix: 'x', label: 'Lead Conversion' },
]

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={containerRef} className="relative min-h-[90vh] pt-28 lg:pt-32 pb-20 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Icons */}
      <div className="absolute inset-0 hidden lg:block">
        {floatingIcons.map((item) => (
          <FloatingIcon key={item.id} {...item} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">Powering AI for businesses worldwide</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-8"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Transform Your Business
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                with AI
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto text-center leading-relaxed mb-10"
        >
          From intelligent chatbots to AI-powered phone services, we deliver cutting-edge solutions that help businesses automate, engage, and grow.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/get-started"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/25"
          >
            <span className="relative z-10 flex items-center">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/demo/voice"
            className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
          >
            <Play className="w-4 h-4 mr-2 text-orange-500" />
            Watch Demo
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-16"
        >
          <div className="flex -space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <span>Trusted by 50+ businesses</span>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 lg:p-6 bg-white/50 rounded-2xl border border-gray-100">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
