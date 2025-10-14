'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, Users, Target, Award, Globe, Zap, Shield, Heart } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const values = [
  {
    icon: <Zap className="w-8 h-8 text-accent-500" />,
    title: "Innovation",
    description: "We push the boundaries of what's possible with AI, constantly exploring new technologies and methodologies."
  },
  {
    icon: <Shield className="w-8 h-8 text-accent-500" />,
    title: "Trust",
    description: "Security and reliability are at the core of everything we build. Your data and success are our top priorities."
  },
  {
    icon: <Users className="w-8 h-8 text-accent-500" />,
    title: "Collaboration",
    description: "We believe in the power of working together, both within our team and with our clients to achieve extraordinary results."
  },
  {
    icon: <Heart className="w-8 h-8 text-accent-500" />,
    title: "Empathy",
    description: "We understand the challenges businesses face and design solutions that truly make a difference in people's lives."
  }
]


export default function AboutPage() {
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto px-6 sm:px-8 mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
            About Koby AI
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're on a mission to democratize artificial intelligence and make it accessible 
            to businesses of all sizes. Founded by AI researchers and engineers, we believe 
            that every company should have access to cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 font-display">
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To empower businesses with intelligent AI solutions that drive growth, 
                  efficiency, and innovation. We believe that artificial intelligence should 
                  be a force for good, helping companies achieve their goals while creating 
                  better experiences for their customers.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our platform combines the latest advances in machine learning with 
                  user-friendly interfaces, making it easy for any business to harness 
                  the power of AI without needing a team of data scientists.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-accent-500 mb-2">50K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-accent-500 mb-2">150+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-accent-500 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-accent-500 mb-2">5/5</div>
                  <div className="text-gray-600">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Our Values
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core principles guide everything we do and shape how we build products and serve our customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
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
              Ready to Join Our Journey?
            </h2>
            <p className="text-accent-100 mb-8">
              Be part of the AI revolution. Let's build the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-accent-500 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-150"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-accent-500 transition-all duration-150"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}