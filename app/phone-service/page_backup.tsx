'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, Phone, Clock, Users, DollarSign, CheckCircle, Calendar, MessageSquare, Zap, Target } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const keyStats = [
  { number: 21, suffix: "×", label: "More likely to qualify leads", icon: <Target className="w-6 h-6" /> },
  { number: 78, suffix: "%", label: "Buy from first responder", icon: <CheckCircle className="w-6 h-6" /> },
  { number: 85, suffix: "%", label: "Won't call back if missed", icon: <Phone className="w-6 h-6" /> },
  { number: "$126,000", suffix: "", label: "Average cost of missed calls/year", icon: <DollarSign className="w-6 h-6" /> }
]

const features = [
  {
    icon: <Phone className="w-8 h-8 text-accent-500" />,
    title: "Professional Call Handling",
    description: "Answers every call with your custom greeting and handles inquiries professionally 24/7"
  },
  {
    icon: <Calendar className="w-8 h-8 text-accent-500" />,
    title: "Smart Appointment Scheduling",
    description: "Schedules appointments directly to your calendar with intelligent conflict detection"
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-accent-500" />,
    title: "Instant Message Delivery",
    description: "Takes detailed messages and texts them to you immediately for quick response"
  },
  {
    icon: <Users className="w-8 h-8 text-accent-500" />,
    title: "Multi-Call Management",
    description: "Handles multiple calls simultaneously during busy times without dropping any"
  }
]

const benefits = [
  {
    stat: "21× more likely",
    description: "to qualify leads when responding within 5 minutes"
  },
  {
    stat: "78% of buyers",
    description: "purchase from the first company that responds"
  },
  {
    stat: "22-27% of calls",
    description: "are missed by businesses on average"
  },
  {
    stat: "$126,000/year",
    description: "average cost of missed calls for businesses"
  }
]

const useCases = [
  {
    title: "Law Firms",
    description: "Intake new clients, schedule consultations, and capture every potential case",
    icon: "⚖️",
    features: ["Client intake forms", "Consultation scheduling", "Case qualification", "Follow-up reminders"]
  },
  {
    title: "Home Services",
    description: "Book service calls, provide quotes, and never miss a potential customer",
    icon: "🏠",
    features: ["Service booking", "Quote requests", "Emergency calls", "Customer follow-up"]
  },
  {
    title: "Medical Practices",
    description: "Schedule appointments, handle prescription refills, and improve patient care",
    icon: "🏥",
    features: ["Appointment scheduling", "Prescription refills", "Insurance verification", "Patient reminders"]
  },
  {
    title: "Small Businesses",
    description: "Never miss a sales opportunity with professional call handling",
    icon: "💼",
    features: ["Lead qualification", "Sales inquiries", "Customer support", "Order processing"]
  }
]

const pricing = {
  startingPrice: 400,
  period: "month",
  features: [
    "Unlimited calls handled",
    "24/7 availability",
    "Custom greeting setup",
    "Calendar integration",
    "Instant message delivery",
    "Multi-call handling",
    "Professional call screening",
    "Lead qualification",
    "Appointment scheduling",
    "Message transcription"
  ]
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
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-200">
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800 font-display">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-sm text-gray-600 text-center">{stat.label}</div>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-4xl mx-auto mb-16"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Don't Miss Revenue - 82% of consumers expect immediate response
            </h2>
            <p className="text-red-700 text-lg mb-6">
              Responding within 5 minutes makes you 21× more likely to qualify leads. 
              Missed calls cost businesses $126,000/year on average.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="font-semibold text-red-800">{benefit.stat}</div>
                  <div className="text-red-600">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
              What It Does For You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI virtual receptionist handles every aspect of call management professionally and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Perfect For Every Industry
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI phone service adapts to your business needs and industry requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-150"
                >
                  <div className="text-4xl mb-4 text-center">{useCase.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>


        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-accent-500 py-16"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">
              Stop Missing Revenue - Start Today
            </h2>
            <p className="text-accent-100 mb-8">
              Don't let another potential customer slip away. Our AI virtual receptionist 
              ensures every call is answered professionally and every lead is captured.
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-accent-500 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-150"
              >
                Start Free Trial
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
