'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cpu, MessageCircle, Phone } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 sm:px-8 pt-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 font-display leading-tight">
            The Future of{' '}
            <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">
              AI is Here
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Transform your business with our cutting-edge AI solutions. 
            From intelligent chatbots to powerful AI suites, we deliver 
            the tools you need to succeed in the digital age.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col lg:flex-row gap-6 justify-center items-center max-w-4xl mx-auto"
        >
          {/* AI Suites Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:w-1/3"
          >
            <Link href="/ai-suites" className="block group">
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden orange-glow">
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-accent-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Cpu className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">AI Suites</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Explore our powerful collection of AI tools for content, data, and more.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* AI Chatbot Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:w-1/3"
          >
            <Link href="/chatbot" className="block group">
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden orange-glow">
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">AI Chatbot Assistant</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Engage customers 24/7 with intelligent, human-like conversations.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* AI Phone Service Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:w-1/3"
          >
            <Link href="/phone-service" className="block group">
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden orange-glow">
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">AI Phone Service</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Never miss a call with our AI virtual receptionist. 21× more likely to qualify leads.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}