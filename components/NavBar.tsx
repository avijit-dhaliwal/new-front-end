'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import KobyLogo from './KobyLogo'

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-150"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <KobyLogo className="w-10 h-10" />
              <span className="text-xl font-bold text-gray-800 font-display">
                Koby AI
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            <Link href="/ai-suites" className="text-gray-600 hover:text-accent-500 transition-colors duration-100 font-medium">
              AI Suites
            </Link>
            <Link href="/chatbot" className="text-gray-600 hover:text-accent-500 transition-colors duration-100 font-medium">
              Chatbot
            </Link>
            <Link href="/phone-service" className="text-gray-600 hover:text-accent-500 transition-colors duration-100 font-medium">
              Phone Service
            </Link>
            <Link href="/articles" className="text-gray-600 hover:text-accent-500 transition-colors duration-100 font-medium">
              Articles
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-accent-500 transition-colors duration-100 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-accent-500 transition-colors duration-100 font-medium">
              Contact
            </Link>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden md:block"
          >
            <Link href="/get-started" className="btn-primary">
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}