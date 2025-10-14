'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Users
} from 'lucide-react'

const features = [
  {
    icon: <Brain className="w-8 h-8 text-accent-500" />,
    title: "Advanced AI Models",
    description: "Powered by state-of-the-art machine learning algorithms and neural networks",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100"
  },
  {
    icon: <Zap className="w-8 h-8 text-accent-500" />,
    title: "Lightning Fast Processing",
    description: "Process complex AI tasks in milliseconds with our optimized infrastructure",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "from-yellow-50 to-yellow-100"
  },
  {
    icon: <Shield className="w-8 h-8 text-accent-500" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols to protect your data",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100"
  },
  {
    icon: <Globe className="w-8 h-8 text-accent-500" />,
    title: "Global Infrastructure",
    description: "Deployed across multiple regions for optimal performance worldwide",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-accent-500" />,
    title: "Real-time Analytics",
    description: "Comprehensive insights and analytics for all your AI operations",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "from-indigo-50 to-indigo-100"
  },
  {
    icon: <Users className="w-8 h-8 text-accent-500" />,
    title: "Team Collaboration",
    description: "Seamless collaboration tools for teams of any size",
    color: "from-pink-500 to-pink-600",
    bgColor: "from-pink-50 to-pink-100"
  }
]

export default function FloatingFeaturesCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Why Choose Koby AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine cutting-edge artificial intelligence with enterprise-grade security 
            and performance to deliver solutions that transform your business.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-150 border border-gray-100 overflow-hidden group hover-orange-glow"
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-150`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-display">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}