'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, MessageCircle, CheckCircle, Zap, Star, Users, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const performanceMetrics = [
  { number: "67%", label: "Increase in Sales" },
  { number: "23%", label: "Higher Conversion" },
  { number: "35%", label: "Buy from Suggestions" },
  { number: "30%", label: "Support Cost Savings" }
]

const features = [
  {
    title: "24/7 Availability",
    description: "Never miss a customer inquiry - your AI chatbot works around the clock",
    icon: Zap,
    color: "bg-amber-50",
    iconColor: "text-amber-600"
  },
  {
    title: "Multi-Language Support",
    description: "Communicate with customers in their preferred language",
    icon: MessageCircle,
    color: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Calendar Integration",
    description: "Books appointments directly into your calendar",
    icon: CheckCircle,
    color: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Lead Qualification",
    description: "Collects customer information and qualifies leads automatically",
    icon: Star,
    color: "bg-purple-50",
    iconColor: "text-purple-600"
  }
]

const includedFeatures = [
  "24/7 AI chatbot availability",
  "Multi-language support",
  "Calendar integration",
  "Lead qualification",
  "Custom responses",
  "Analytics dashboard"
]

export default function ChatbotPage() {
  const ref = useRef(null)

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg blue-glow">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              AI Chatbot
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display tracking-tight"
            >
              Convert More Customers,{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                24/7
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <div className="text-2xl font-bold text-primary-600 mb-2">Starting at $50/month</div>
              <p className="text-gray-600">67% increase in sales reported after chatbot adoption</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-gray-600 leading-relaxed mb-8"
            >
              Businesses with chatbots see a 67% increase in sales and 23% higher conversion rates.
              Your AI chatbot never sleeps, ensuring you capture every opportunity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/get-started" className="btn-primary">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 font-display mb-1">
                  {metric.number}
                </div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 font-display tracking-tight">
              What It Does for You
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft border border-gray-100 text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 font-display">
              AI Chatbot
            </h2>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-sm text-gray-500">Starting at</span>
              <span className="text-4xl font-bold text-gray-900 font-display mx-2">$50</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 mb-8 max-w-md mx-auto">
              {includedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center justify-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/get-started" className="btn-primary">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
              Ready to Convert More Customers?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Get started with our AI chatbot today and never miss another opportunity.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold py-3.5 px-7 rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
