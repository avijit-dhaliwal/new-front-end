'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Brain,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  Cpu
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "State-of-the-art machine learning for superior performance and natural conversations.",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process complex tasks in milliseconds with optimized infrastructure.",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption. SOC 2 compliant and HIPAA ready.",
    gradient: "from-emerald-500 to-green-600",
    lightBg: "bg-emerald-50",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Deployed across multiple regions for optimal worldwide performance.",
    gradient: "from-blue-500 to-cyan-600",
    lightBg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive insights dashboard for all your AI operations.",
    gradient: "from-pink-500 to-rose-600",
    lightBg: "bg-pink-50",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless tools for teams with role-based access controls.",
    gradient: "from-indigo-500 to-blue-600",
    lightBg: "bg-indigo-50",
  }
]

export default function FloatingFeaturesCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm font-medium">Why Choose Us</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Built for Modern Business
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Cutting-edge AI with enterprise-grade security and performance to transform your business.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Subtle gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`relative w-14 h-14 ${feature.lightBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.gradient} bg-clip-text`} style={{ color: 'inherit' }} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-10`} />
                  <feature.icon className="w-7 h-7 text-gray-700 relative z-10" />
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/about"
            className="inline-flex items-center text-gray-900 font-semibold hover:text-gray-700 transition-colors group"
          >
            Learn more about our technology
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
