'use client'

import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import GenericVoiceAgent from '@/components/demo/GenericVoiceAgent'
import { Phone, Zap, Shield, Headphones } from 'lucide-react'

export default function VoiceDemo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NavBar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Voice Assistant Demo
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Experience natural voice conversations with our AI-powered dental office receptionist.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              This demo showcases how our voice assistant can handle phone calls, answer questions,
              and provide a human-like experience for your patients.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Conversations</h3>
              <p className="text-gray-600 text-sm">
                Advanced speech recognition and natural language processing enable fluid, human-like conversations with patients.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Available</h3>
              <p className="text-gray-600 text-sm">
                Never miss a call. Our voice assistant answers every call instantly, ensuring no patient inquiry goes unanswered.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Customizable</h3>
              <p className="text-gray-600 text-sm">
                Customize the voice, personality, and knowledge base to perfectly match your practice's unique needs and brand.
              </p>
            </div>
          </motion.div>

          {/* Important Browser Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <p className="text-blue-900 text-sm text-center">
              <strong>Note:</strong> This demo uses your browser's built-in speech recognition.
              For best results, use Chrome, Edge, or Safari and allow microphone access when prompted.
            </p>
          </motion.div>

          {/* Main Voice Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <GenericVoiceAgent />
          </motion.div>

          {/* How to Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to Use This Demo
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Click Start Call</h3>
                <p className="text-sm text-gray-600">
                  Click the green phone button to initiate the voice conversation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Allow Microphone</h3>
                <p className="text-sm text-gray-600">
                  Grant permission when your browser asks to use your microphone
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Speaking</h3>
                <p className="text-sm text-gray-600">
                  Speak naturally as if you're calling a dental office receptionist
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Listen & Interact</h3>
                <p className="text-sm text-gray-600">
                  The assistant will respond and continue the conversation naturally
                </p>
              </div>
            </div>
          </motion.div>

          {/* Customization Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Customize for Your Practice?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              This is a generic demonstration using browser-based speech technology. In production, we use advanced voice AI
              with natural-sounding voices and can fully customize the assistant to match your dental practice's
              specific services, scheduling system, and policies. The voice, personality, and responses can all be tailored
              to your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/schedule-meeting"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Schedule a Demo
              </a>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What Can This Voice Assistant Do?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Call Handling</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Answer common patient questions about services and procedures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Provide office hours, location, and contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Explain insurance acceptance and payment options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Route urgent matters to appropriate staff members</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Practice Benefits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Handle multiple calls simultaneously</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Reduce staff burden and improve efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Capture after-hours calls and appointment requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Provide consistent, professional patient experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Technology Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-center">Production Implementation</h3>
            <p className="text-sm text-gray-600 text-center max-w-3xl mx-auto">
              This demonstration uses browser-based speech recognition for simplicity. Our production voice assistants
              utilize enterprise-grade voice AI technology with natural-sounding voices, advanced speech recognition,
              and seamless integration with your practice management software. We can integrate with your phone system,
              appointment scheduling, and CRM to provide a complete automated receptionist solution.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
