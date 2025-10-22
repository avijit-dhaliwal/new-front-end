'use client'

import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import ChatBot from '@/components/chadis/ChatBot'
import { Heart, Brain, Shield, Users } from 'lucide-react'
import Script from 'next/script'

interface VoiceMessage {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
  isVoice?: boolean
}

export default function ChadisDemo() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NavBar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              CHADIS Support
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              
              Start a conversation to experience intelligent support.
            </p>

            
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Chat Bot */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ChatBot onClose={() => {}} />
              </motion.div>
            </div>

            {/* Right Side - ElevenLabs Voice Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <elevenlabs-convai agent-id="agent_6801k85391dtfmmakapdgv38yp3q"></elevenlabs-convai>
            </motion.div>
          </div>
        </div>
      </div>

      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript" />
    </main>
  )
}