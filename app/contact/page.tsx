'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Mail, Phone, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "admin@kobyai.com",
    action: "mailto:admin@kobyai.com",
    color: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team during business hours",
    contact: "(559) 960-9723",
    action: "tel:+15599609723",
    color: "bg-green-50 dark:bg-green-900/30",
    iconColor: "text-green-600"
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
      const submissionData = {
        name: formData.name,
        email: formData.email,
        company: formData.company || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden noise-overlay">
        {/* Background */}
        <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
        <div className="absolute -top-28 left-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

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
              className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Contact Us
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--ink)] mb-6 font-display tracking-tight"
            >
              Get in Touch
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[var(--ink-muted)] leading-relaxed"
            >
              Have questions about our AI solutions? Need help getting started?
              We're here to help you succeed. Reach out to our team and let's
              discuss how we can transform your business.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-[var(--paper-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--panel)] rounded-2xl p-6 lg:p-8 shadow-[var(--shadow-soft)] border border-[var(--line)] flex items-center gap-5 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className={`w-7 h-7 ${info.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-1 font-display">
                    {info.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-muted)] mb-2">{info.description}</p>
                  <span className="text-[var(--accent)] font-semibold">{info.contact}</span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[var(--panel)] rounded-3xl p-8 lg:p-10 shadow-[var(--shadow-soft)] border border-[var(--line)]"
            >
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-6 font-display">
                Send us a Message
              </h2>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-2 font-display">Message Sent!</h3>
                  <p className="text-[var(--ink-muted)]">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--ink)] mb-2">
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
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent focus:bg-[var(--panel)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[var(--ink)] placeholder-[var(--ink-muted)]"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[var(--ink)] mb-2">
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
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent focus:bg-[var(--panel)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[var(--ink)] placeholder-[var(--ink-muted)]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-[var(--ink)] mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent focus:bg-[var(--panel)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[var(--ink)] placeholder-[var(--ink-muted)]"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--ink)] mb-2">
                      Subject *
                    </label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="w-full h-12 bg-[var(--paper-muted)] border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)]">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="sales">Sales Question</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="custom">Custom Solution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--ink)] mb-2">
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
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent focus:bg-[var(--panel)] transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[var(--ink)] placeholder-[var(--ink-muted)]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-[var(--paper-muted)] rounded-2xl p-6 lg:p-8">
                <h3 className="text-lg font-bold text-[var(--ink)] mb-4 font-display">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[var(--accent)] mr-3" />
                    <span className="text-[var(--ink-muted)] text-sm">Monday - Friday: 9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[var(--accent)] mr-3" />
                    <span className="text-[var(--ink-muted)] text-sm">Saturday: 10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[var(--accent)] mr-3" />
                    <span className="text-[var(--ink-muted)] text-sm">Sunday: Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 lg:p-8 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                <h3 className="text-lg font-bold text-[var(--ink)] mb-4 font-display">Quick Response</h3>
                <p className="text-[var(--ink-muted)] text-sm mb-4">
                  We typically respond to all inquiries within 24 hours. For urgent matters,
                  please call us directly.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-[var(--ink-muted)]">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>24/7 Email Support</span>
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-muted)]">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Live Chat During Business Hours</span>
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-muted)]">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Priority Support for Enterprise</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-[var(--paper-muted)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-4 font-display tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--ink-muted)]">
              Quick answers to common questions about our AI solutions.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--panel)] rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]"
              >
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">{faq.question}</h3>
                <p className="text-[var(--ink-muted)] text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
