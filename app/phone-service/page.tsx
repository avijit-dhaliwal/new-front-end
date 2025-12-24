'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Phone, ArrowRight, Check, Headphones, Zap, Users, Calendar, Globe, Shield } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const keyStats = [
  { number: "98%", label: "Call Answer Rate" },
  { number: "24/7", label: "Availability" },
  { number: "67%", label: "Cost Reduction" },
  { number: "4.8/5", label: "Customer Rating" }
]

const features = [
  {
    title: "Professional Call Handling",
    description: "Every call is answered professionally with a warm, human-like voice that represents your brand.",
    icon: Headphones
  },
  {
    title: "Intelligent Call Routing",
    description: "Smart call routing ensures each caller reaches the right department or person.",
    icon: Zap
  },
  {
    title: "Lead Qualification",
    description: "Automatically qualifies leads by asking the right questions and collecting information.",
    icon: Users
  },
  {
    title: "Appointment Scheduling",
    description: "Seamlessly schedules appointments directly into your calendar with real-time availability.",
    icon: Calendar
  },
  {
    title: "Multi-Language Support",
    description: "Communicates with callers in their preferred language for better experience.",
    icon: Globe
  },
  {
    title: "Secure & Compliant",
    description: "Enterprise-grade security and compliance with all major regulations.",
    icon: Shield
  }
]

const benefits = [
  {
    title: "Never Miss a Call",
    description: "Every call is answered within 3 rings, ensuring you never lose a potential customer.",
    stat: "98%"
  },
  {
    title: "Reduce Costs",
    description: "Cut receptionist costs by up to 67% while improving service quality.",
    stat: "67%"
  },
  {
    title: "24/7 Availability",
    description: "Your virtual receptionist works around the clock, even on weekends and holidays.",
    stat: "24/7"
  },
  {
    title: "Professional Image",
    description: "Maintain a professional image with consistent, high-quality call handling.",
    stat: "4.8/5"
  }
]

const includedFeatures = [
  "Unlimited calls handled",
  "24/7 availability",
  "Custom greeting setup",
  "Calendar integration",
  "Call transcriptions",
  "Voicemail management"
]

const workflowSteps = [
  {
    title: 'Answer',
    description: 'AI picks up every call with a professional, personalized greeting.',
  },
  {
    title: 'Route',
    description: 'Smart routing directs callers to the right person or handles requests directly.',
  },
  {
    title: 'Act',
    description: 'Schedules appointments, captures leads, and sends summaries to your team.',
  },
]

export default function PhoneServicePage() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden noise-overlay">
        {/* Background */}
        <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
        <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-[-5%] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

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

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]"
              >
                AI Phone Service
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[var(--ink)]"
              >
                Never Miss Another Call
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-base sm:text-lg text-[var(--ink-muted)] max-w-2xl"
              >
                Our AI virtual receptionist answers every call professionally,
                qualifies leads, and schedules appointments 24/7. Don't let missed calls cost you revenue.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-8 flex flex-col sm:flex-row items-center gap-4"
              >
                <Link href="/get-started" className="btn-primary">
                  Get Started Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/demo/voice" className="btn-secondary">
                  Try Live Demo
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex items-baseline gap-2"
              >
                <span className="text-sm text-[var(--ink-muted)]">Starting at</span>
                <span className="text-3xl font-semibold text-[var(--ink)]">$400</span>
                <span className="text-sm text-[var(--ink-muted)]">/month</span>
              </motion.div>
            </div>

            {/* Workflow Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative"
            >
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">How it works</p>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">3 steps</span>
                </div>

                <div className="mt-6 space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step.title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-[var(--ink)]">{step.title}</p>
                      </div>
                      <p className="mt-2 text-xs text-[var(--ink-muted)] pl-9">{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-[var(--ink)]">98%</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Answered</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-center">
                    <p className="text-lg font-semibold text-[var(--ink)]">24/7</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Coverage</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--paper-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {keyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-semibold text-[var(--ink)] font-display mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-[var(--ink-muted)]">{stat.label}</div>
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
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Features</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Powerful Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)] hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[var(--accent-strong)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 bg-[var(--paper-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Benefits</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Why Choose Our AI Phone Service?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)] hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl font-semibold text-[var(--accent-strong)] font-display mb-3">{benefit.stat}</div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">{benefit.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{benefit.description}</p>
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
            className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8 lg:p-12 shadow-[var(--shadow-soft)] text-center"
          >
            <div className="mx-auto h-12 w-12 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-[var(--accent-strong)]" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[var(--ink)] mb-2 font-display">
              AI Phone Service
            </h2>
            <p className="text-sm text-[var(--ink-muted)] mb-4">Virtual receptionist for your business</p>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-sm text-[var(--ink-muted)]">Starting at</span>
              <span className="text-4xl font-semibold text-[var(--ink)] font-display mx-2">$400</span>
              <span className="text-[var(--ink-muted)]">/month</span>
            </div>

            <ul className="space-y-3 mb-8 max-w-md mx-auto">
              {includedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center justify-start text-sm text-[var(--ink-muted)]">
                  <span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                    <Check className="h-3 w-3 text-[var(--accent-strong)]" />
                  </span>
                  {feature}
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

      {/* CTA Section - Clean neutral style */}
      <section className="py-20 lg:py-28 bg-[var(--paper-muted)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8 lg:p-12 shadow-[var(--shadow-soft)] text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--ink)] mb-4 font-display tracking-tight">
              Ready to Never Miss Another Call?
            </h2>
            <p className="text-[var(--ink-muted)] text-lg mb-8 max-w-2xl mx-auto">
              Get started with our AI phone service today and capture every opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="btn-primary">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/demo/voice" className="btn-secondary">
                Try Live Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
