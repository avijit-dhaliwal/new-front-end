'use client'

import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Script from 'next/script'

export default function LegalServicesDemo() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NavBar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Legal Services Voice Assistant
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Speak with our AI-powered legal assistant for instant support and guidance.
            </p>
          </motion.div>

          <div className="flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl"
            >
              <elevenlabs-convai agent-id="agent_6101k97ydt1xf4psr8sempwz701n"></elevenlabs-convai>
            </motion.div>
          </div>
        </div>
      </div>

      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript" />
    </main>
  )
}
