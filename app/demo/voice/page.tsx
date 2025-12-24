'use client'

import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import CustomElevenLabsVoiceWidget from '@/components/demo/CustomElevenLabsVoiceWidget'
import { Phone, Zap, Shield, Headphones, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VoiceDemo() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 relative"
          >
            <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55] -z-10" />
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center">
                <Phone className="w-8 h-8 text-[var(--accent)]" />
              </div>
            </div>
            <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              Live Demo
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--ink)] mb-6 font-display tracking-tight">
              AI Voice Assistant Demo
            </h1>
            <p className="text-xl text-[var(--ink-muted)] mb-4 max-w-3xl mx-auto">
              Experience natural voice conversations with our AI-powered receptionist.
            </p>
            <p className="text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
              This demo showcases how our voice assistant can handle phone calls, answer questions,
              and provide a human-like experience for your customers.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
              <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">Natural Conversations</h3>
              <p className="text-[var(--ink-muted)] text-sm">
                Advanced speech recognition and natural language processing enable fluid, human-like conversations.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
              <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">Always Available</h3>
              <p className="text-[var(--ink-muted)] text-sm">
                Never miss a call. Our voice assistant answers every call instantly, ensuring no inquiry goes unanswered.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
              <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">Fully Customizable</h3>
              <p className="text-[var(--ink-muted)] text-sm">
                Customize the voice, personality, and knowledge base to perfectly match your business's unique needs and brand.
              </p>
            </div>
          </motion.div>

          {/* Important Browser Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 bg-[var(--accent-soft)] border border-[var(--line)] rounded-2xl p-4"
          >
            <p className="text-[var(--ink)] text-sm text-center">
              <strong>Note:</strong> This demo uses advanced voice AI technology.
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
            <CustomElevenLabsVoiceWidget agentId="agent_01jvap5cwxfd486ghvmc6x6gzw" />
          </motion.div>

          {/* How to Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-[var(--panel)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--line)] mb-12"
          >
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-6 text-center font-display">
              How to Use This Demo
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-2">Click Start Call</h3>
                <p className="text-sm text-[var(--ink-muted)]">
                  Click the phone button to initiate the voice conversation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-2">Allow Microphone</h3>
                <p className="text-sm text-[var(--ink-muted)]">
                  Grant permission when your browser asks to use your microphone
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-2">Start Speaking</h3>
                <p className="text-sm text-[var(--ink-muted)]">
                  Speak naturally as if you're calling a receptionist
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-2">Listen & Interact</h3>
                <p className="text-sm text-[var(--ink-muted)]">
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
            className="bg-[var(--panel)] rounded-3xl p-10 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-4 font-display tracking-tight">
              Ready to Customize for Your Business?
            </h2>
            <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-2xl mx-auto">
              This is a generic demonstration of our voice AI technology. We can fully customize the assistant to match
              your specific services, scheduling system, and policies. The voice, personality, and
              responses can all be tailored to your brand, and we can integrate with your phone system for seamless call handling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/schedule-meeting"
                className="btn-secondary"
              >
                Schedule a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-[var(--panel)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--line)]"
          >
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-6 text-center font-display">
              What Can This Voice Assistant Do?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--ink)] mb-3">Call Handling</h3>
                <ul className="space-y-2 text-[var(--ink-muted)]">
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Answer common customer questions about services and procedures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Provide office hours, location, and contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Explain payment options and policies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Route urgent matters to appropriate staff members</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--ink)] mb-3">Business Benefits</h3>
                <ul className="space-y-2 text-[var(--ink-muted)]">
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Handle multiple calls simultaneously</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Reduce staff burden and improve efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Capture after-hours calls and appointment requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Provide consistent, professional customer experience</span>
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
            className="mt-8 p-6 bg-[var(--paper-muted)] rounded-3xl border border-[var(--line)]"
          >
            <h3 className="font-semibold text-[var(--ink)] mb-3 text-center">Enterprise Voice AI Technology</h3>
            <p className="text-sm text-[var(--ink-muted)] text-center max-w-3xl mx-auto">
              This demonstration uses enterprise-grade voice AI technology with natural-sounding voices and advanced
              speech recognition. Our production implementations offer seamless integration with your phone system,
              practice management software, appointment scheduling, and CRM to provide a complete automated receptionist solution.
              We can handle multiple calls simultaneously, transfer to staff when needed, and capture detailed call information.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
