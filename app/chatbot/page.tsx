'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, MessageCircle, Sparkles, CheckCircle, Zap, Star, Users } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const performanceMetrics = [
  { number: 67, suffix: "%", label: "Increase in Sales", icon: <CheckCircle className="w-6 h-6" /> },
  { number: 23, suffix: "%", label: "Higher Conversion Rates", icon: <Zap className="w-6 h-6" /> },
  { number: 35, suffix: "%", label: "Consumers Buy from Suggestions", icon: <Star className="w-6 h-6" /> },
  { number: 30, suffix: "%", label: "Cost Savings in Support", icon: <Users className="w-6 h-6" /> }
]

const features = [
  {
    title: "24/7 Availability",
    description: "Never miss a customer inquiry - your AI chatbot works around the clock",
    icon: <Zap className="w-8 h-8 text-accent-500" />
  },
  {
    title: "Multi-Language Support",
    description: "Communicate with customers in their preferred language",
    icon: <MessageCircle className="w-8 h-8 text-accent-500" />
  },
  {
    title: "Calendar Integration",
    description: "Books appointments directly into your calendar",
    icon: <CheckCircle className="w-8 h-8 text-accent-500" />
  },
  {
    title: "Lead Qualification",
    description: "Collects customer information and qualifies leads automatically",
    icon: <Sparkles className="w-8 h-8 text-accent-500" />
  }
]

const useCases = [
  {
    title: "Restaurants",
    description: "Take reservations, answer menu questions",
    icon: "🍽️"
  },
  {
    title: "Medical Offices",
    description: "Schedule appointments, answer insurance questions",
    icon: "🏥"
  },
  {
    title: "Real Estate",
    description: "Qualify leads, schedule showings",
    icon: "🏠"
  },
  {
    title: "E-commerce",
    description: "Product recommendations, order tracking",
    icon: "🛒"
  }
]

export default function ChatbotPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  



  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />
      
      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-100">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto px-6 sm:px-8 mb-16 relative">
          {/* Fixed Glow Background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
              filter: 'blur(60px)',
              WebkitFilter: 'blur(60px)',
              zIndex: -1
            }}
          ></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center orange-glow">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
              AI Chatbot
            </h1>
          </motion.div>
          
          <div className="mb-6 relative z-10">
            <div className="text-3xl font-bold text-blue-500 mb-2">Starting at $50/month</div>
            <div className="text-lg text-gray-600">67% increase in sales reported after chatbot adoption</div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 relative z-10">
            Convert More Customers, 24/7 - Businesses with chatbots see a 67% increase in sales and 23% higher conversion rates. Your AI chatbot never sleeps, ensuring you capture every opportunity.
          </p>
        </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-500 mb-2">{metric.number}{metric.suffix}</div>
                <div className="text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <Link href="/get-started">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-150"
              >
                Get Started Today
              </motion.button>
            </Link>
          </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What it does for you:</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Perfect for:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
                >
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  )
}
