'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowLeft, Mail, Phone, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6 text-accent-500" />,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "admin@kobyai.com",
    action: "mailto:admin@kobyai.com"
  },
  {
    icon: <Phone className="w-6 h-6 text-accent-500" />,
    title: "Call Us",
    description: "Speak directly with our team during business hours",
    contact: "(559) 960-9723",
    action: "tel:+15599609723"
  },
]

const faqs = [
  {
    question: "How quickly can I get started with Koby AI?",
    answer: "We have a dedicated team ready to meet with your team immediately. After you choose your plan, we'll schedule a personal meeting to work directly with you and your team to set up everything perfectly for your business needs."
  },
  {
    question: "Do you offer custom AI solutions?",
    answer: "Yes! We offer custom AI model training, integrations, and enterprise solutions. Contact our sales team for a personalized quote."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer 24/7 email support, live chat during business hours, and priority support for enterprise customers."
  },
  {
    question: "Is my data secure with Koby AI?",
    answer: "Absolutely. We use enterprise-grade encryption, comply with SOC 2 and GDPR standards, and never share your data with third parties."
  }
]

export default function ContactPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Get Google Sheets URL from environment variable
      const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '';

      if (!GOOGLE_SHEETS_URL) {
        setSubmitError('Contact form is not configured. Please try again later.')
        setIsSubmitting(false)
        return
      }

      // Parse the name to get first and last name
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Prepare submission data for Google Sheets
      const submissionData = {
        timestamp: new Date().toISOString(),
        type: formData.subject || 'contact',
        serviceType: formData.subject || 'general',
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        message: formData.message,
        integrations: 'None selected',
        preferredContact: 'email',
        newsletter: false
      }

      // Send data to Google Sheets
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
        mode: 'no-cors'
      })

      // With no-cors mode, we assume success if no exception was thrown

      // Success - reset form and show success message
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again or contact us directly.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />
      
      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-accent-500">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="text-center max-w-4xl mx-auto px-6 sm:px-8 mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about our AI solutions? Need help getting started? 
            We're here to help you succeed. Reach out to our team and let's 
            discuss how we can transform your business.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="max-w-7xl mx-auto px-6 sm:px-8 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl text-center"
              >
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-600 mb-4">{info.description}</p>
                <a 
                  href={info.action}
                  className="text-accent-500 font-semibold hover:text-accent-600"
                >
                  {info.contact}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form & Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="max-w-7xl mx-auto px-6 sm:px-8 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">
                Send us a Message
              </h2>
              
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Error submitting form</p>
                    <p className="text-sm text-red-600 mt-1">{submitError}</p>
                  </div>
                </motion.div>
              )}

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent  disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent  disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent  disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales Question</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="custom">Custom Solution</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent  resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    style={{ transform: "translateZ(0)", willChange: "transform" }}
                    className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-accent-500 mr-3" />
                    <span className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-accent-500 mr-3" />
                    <span className="text-gray-600">Saturday: 10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-accent-500 mr-3" />
                    <span className="text-gray-600">Sunday: Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Response</h3>
                <p className="text-gray-600 mb-4">
                  We typically respond to all inquiries within 24 hours. For urgent matters, 
                  please call us directly or use our live chat feature.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>24/7 Email Support</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Live Chat During Business Hours</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Priority Support for Enterprise</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to common questions about our AI solutions.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
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