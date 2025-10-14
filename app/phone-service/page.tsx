'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, Phone, CheckCircle, Clock, Users, DollarSign, Star, Zap, Shield, Headphones } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const keyStats = [
  { number: 98, suffix: "%", label: "Call Answer Rate", icon: <Phone className="w-6 h-6" /> },
  { number: 24, suffix: "/7", label: "Availability", icon: <Clock className="w-6 h-6" /> },
  { number: 67, suffix: "%", label: "Cost Reduction", icon: <DollarSign className="w-6 h-6" /> },
  { number: 4.8, suffix: "/5", label: "Customer Rating", icon: <Star className="w-6 h-6" /> }
]

const features = [
  {
    title: "Professional Call Handling",
    description: "Every call is answered professionally with a warm, human-like voice that represents your brand perfectly.",
    icon: <Headphones className="w-8 h-8 text-green-500" />
  },
  {
    title: "Intelligent Call Routing",
    description: "Smart call routing ensures each caller reaches the right department or person based on their needs.",
    icon: <Zap className="w-8 h-8 text-green-500" />
  },
  {
    title: "Lead Qualification",
    description: "Automatically qualifies leads by asking the right questions and collecting essential information.",
    icon: <Users className="w-8 h-8 text-green-500" />
  },
  {
    title: "Appointment Scheduling",
    description: "Seamlessly schedules appointments directly into your calendar with real-time availability checking.",
    icon: <CheckCircle className="w-8 h-8 text-green-500" />
  },
  {
    title: "Multi-Language Support",
    description: "Communicates with callers in their preferred language for better customer experience.",
    icon: <Phone className="w-8 h-8 text-green-500" />
  },
  {
    title: "Secure & Compliant",
    description: "Enterprise-grade security and compliance with all major regulations and standards.",
    icon: <Shield className="w-8 h-8 text-green-500" />
  }
]

const benefits = [
  {
    title: "Never Miss a Call",
    description: "Every call is answered within 3 rings, ensuring you never lose a potential customer.",
    stat: "98% Answer Rate"
  },
  {
    title: "Reduce Operating Costs",
    description: "Cut receptionist costs by up to 67% while improving service quality.",
    stat: "67% Cost Savings"
  },
  {
    title: "24/7 Availability",
    description: "Your virtual receptionist works around the clock, even on weekends and holidays.",
    stat: "24/7 Service"
  },
  {
    title: "Professional Image",
    description: "Maintain a professional image with consistent, high-quality call handling.",
    stat: "4.8/5 Rating"
  }
]

const pricing = {
  startingPrice: 400,
  period: "month"
}

export default function PhoneServicePage() {
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
              background: 'linear-gradient(to right, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))',
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
              <div 
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                style={{ 
                  boxShadow: '0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)',
                  filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(34, 197, 94, 0.6), 0 0 70px rgba(34, 197, 94, 0.3)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.5))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))';
                }}
              >
                <Phone className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-4 font-display">
              AI Phone Service & Virtual Receptionist
            </h1>
          </motion.div>

          {/* Pricing */}
          <div className="mb-6 relative z-10">
            <div className="text-3xl font-bold text-green-500 mb-2">Starting at ${pricing.startingPrice}/{pricing.period}</div>
            <div className="text-lg text-gray-600">Never miss another call with our AI virtual receptionist</div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 relative z-10">
            Never miss another call. Our AI virtual receptionist answers every call professionally, 
            qualifies leads, and schedules appointments 24/7. Don't let missed calls cost you revenue.
          </p>
        </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {keyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-500 mb-2">{stat.number}{stat.suffix}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <Link href="/get-started">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-150"
              >
                Get Started Today
              </motion.button>
            </Link>
          </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Our AI Phone Service?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
                >
                  <div className="text-3xl font-bold text-green-500 mb-2">{benefit.stat}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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
