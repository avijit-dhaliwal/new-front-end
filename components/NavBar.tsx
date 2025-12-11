'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Cpu, MessageCircle, Phone, ArrowRight } from 'lucide-react'
import KobyLogo from './KobyLogo'

const navLinks = [
  { name: 'AI Automations', href: '/ai-suites' },
  { name: 'Chatbot', href: '/chatbot' },
  { name: 'Phone Service', href: '/phone-service' },
  { name: 'Articles', href: '/articles' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const products = [
  {
    name: 'AI Automations',
    description: 'Industry-specific AI solutions',
    href: '/ai-suites',
    icon: Cpu,
  },
  {
    name: 'AI Chatbot',
    description: '24/7 intelligent conversations',
    href: '/chatbot',
    icon: MessageCircle,
  },
  {
    name: 'AI Phone Service',
    description: 'Never miss a call',
    href: '/phone-service',
    icon: Phone,
  },
]

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const { scrollY } = useScroll()

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  )

  const borderOpacity = useTransform(
    scrollY,
    [0, 50],
    [0, 1]
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.nav
        style={{ backgroundColor }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? 'shadow-soft backdrop-blur-md' : ''
        }`}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"
          style={{ opacity: borderOpacity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-2.5 group">
                <KobyLogo className="w-9 h-9 transition-transform duration-200 group-hover:scale-105" />
                <span className="text-xl font-bold text-gray-900 font-display tracking-tight">
                  Koby AI
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:flex items-center space-x-1"
            >
              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-150 font-medium text-sm">
                  Products
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {products.map((product) => (
                          <Link
                            key={product.name}
                            href={product.href}
                            className="flex items-start p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                          >
                            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-accent-200 transition-colors duration-150">
                              <product.icon className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{product.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <Link
                          href="/ai-suites"
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 text-sm font-medium text-accent-600"
                        >
                          View all products
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/articles" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-150 font-medium text-sm">
                Articles
              </Link>
              <Link href="/about" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-150 font-medium text-sm">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-150 font-medium text-sm">
                Contact
              </Link>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <Link
                href="/get-started"
                className="btn-primary text-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <Link href="/" className="flex items-center space-x-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                    <KobyLogo className="w-8 h-8" />
                    <span className="text-lg font-bold text-gray-900 font-display">Koby AI</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Products</p>
                    {products.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                          <product.icon className="w-5 h-5 text-accent-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-1">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Company</p>
                    <Link
                      href="/articles"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-150 font-medium"
                    >
                      Articles
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-150 font-medium"
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-150 font-medium"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="p-4 border-t border-gray-100">
                  <Link
                    href="/get-started"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
