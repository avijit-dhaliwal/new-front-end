'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import KobyLogo from './KobyLogo'

const footerLinks = {
  products: [
    { name: 'AI Suites', href: '/ai-suites' },
    { name: 'AI Chatbot', href: '/chatbot' },
    { name: 'AI Phone Service', href: '/phone-service' },
    { name: 'Custom Solutions', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Articles', href: '/articles' },
    { name: 'Contact', href: '/contact' },
    { name: 'Get Started', href: '/get-started' },
  ],
  industries: [
    { name: 'Healthcare', href: '/ai-suites' },
    { name: 'Real Estate', href: '/ai-suites' },
    { name: 'Legal', href: '/ai-suites' },
    { name: 'Retail', href: '/ai-suites' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2.5 mb-6">
              <KobyLogo className="w-10 h-10" />
              <span className="text-2xl font-bold">Koby AI</span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-sm text-sm">
              Transforming businesses with cutting-edge AI solutions. From chatbots to phone services, we help you automate and grow.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a href="mailto:admin@kobyai.com" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mr-3 group-hover:bg-gray-800 transition-colors">
                  <Mail className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">admin@kobyai.com</span>
              </a>
              <a href="tel:+15599609723" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mr-3 group-hover:bg-gray-800 transition-colors">
                  <Phone className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">(559) 960-9723</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Products */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
                  Products
                </h3>
                <ul className="space-y-3">
                  {footerLinks.products.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industries */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
                  Industries
                </h3>
                <ul className="space-y-3">
                  {footerLinks.industries.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay updated</h3>
              <p className="text-gray-500 text-sm">Get the latest AI insights and product updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-5 py-3 bg-gray-900 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700 transition-colors text-sm"
              />
              <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Koby AI Solutions. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
