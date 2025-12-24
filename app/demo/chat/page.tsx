'use client'

import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import GenericChatBot from '@/components/demo/GenericChatBot'
import { MessageSquare, Sparkles, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChatDemo() {
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
                <MessageSquare className="w-8 h-8 text-[var(--accent)]" />
              </div>
            </div>
            <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              Live Demo
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--ink)] mb-6 font-display tracking-tight">
              AI Chat Assistant Demo
            </h1>
            <p className="text-xl text-[var(--ink-muted)] mb-4 max-w-3xl mx-auto">
              Experience the future of customer communication with our AI-powered chat assistant.
            </p>
            <p className="text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
              This demo showcases how our chatbot can handle inquiries, appointment scheduling,
              and general questions about your services 24/7.
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
                <Sparkles className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">Intelligent Responses</h3>
              <p className="text-[var(--ink-muted)] text-sm">
                Powered by advanced AI to provide accurate, helpful answers to customer questions about services, procedures, and policies.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
              <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">24/7 Availability</h3>
              <p className="text-[var(--ink-muted)] text-sm">
                Your virtual receptionist never sleeps. Provide instant support to customers at any time, day or night.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
              <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">Fully Customizable</h3>
              <p className="text-[var(--ink-muted)] text-sm">
                Tailor the assistant to your business's specific services, policies, and branding for a personalized customer experience.
              </p>
            </div>
          </motion.div>

          {/* Main Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <GenericChatBot onClose={() => {}} />
          </motion.div>

          {/* Customization Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-[var(--panel)] rounded-3xl p-10 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-4 font-display tracking-tight">
              Ready to Customize for Your Business?
            </h2>
            <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-2xl mx-auto">
              This is a generic demonstration. We can fully customize this chat assistant to match your
              specific services, branding, policies, and workflow. The AI can be trained on your unique offerings,
              frequently asked questions, and appointment scheduling preferences.
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
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-[var(--panel)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--line)]"
          >
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-6 text-center font-display">
              What Can This Chat Assistant Do?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--ink)] mb-3">Customer Support</h3>
                <ul className="space-y-2 text-[var(--ink-muted)]">
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Answer questions about services and procedures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Provide information about office hours and locations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Explain payment options and policies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Offer helpful tips and guidance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--ink)] mb-3">Business Benefits</h3>
                <ul className="space-y-2 text-[var(--ink-muted)]">
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Reduce call volume and staff workload</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Capture leads outside business hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Provide consistent, accurate information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Improve customer satisfaction and engagement</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
