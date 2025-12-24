'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  RefreshCw,
  Database,
  Users,
  FileText,
  ShoppingCart,
  Calendar,
  Mail,
  CheckCircle,
  Link2
} from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const benefits = [
  {
    title: 'Eliminate Manual Work',
    description: 'Stop wasting hours on repetitive data entry. Our automations handle the busywork so your team can focus on what matters.',
    icon: Zap
  },
  {
    title: 'No More Multiple Entry',
    description: 'Enter data once and watch it flow everywhere it needs to go. No more copying and pasting between systems.',
    icon: RefreshCw
  },
  {
    title: 'Reduce Human Error',
    description: "Automated processes don't make typos or forget steps. Get accurate data every time, automatically.",
    icon: CheckCircle
  },
  {
    title: 'Keep Everyone in Sync',
    description: 'All your data syncs across systems in real-time. Everyone on your team sees the same up-to-date information.',
    icon: Users
  }
]

const automationExamples = [
  {
    title: 'Invoice Automation',
    description: 'Automatically extract invoice data, update your accounting software, and notify your team when payments are due.',
    icon: FileText,
    flow: ['Invoice received', 'Data extracted', 'QuickBooks updated', 'Team notified']
  },
  {
    title: 'CRM Updating',
    description: 'New leads from your website, emails, or forms automatically create contacts and update your CRM with all relevant details.',
    icon: Database,
    flow: ['Lead captured', 'Contact created', 'Tags applied', 'Follow-up scheduled']
  },
  {
    title: 'Order Processing',
    description: 'When a customer places an order, automatically update inventory, create shipping labels, and send confirmation emails.',
    icon: ShoppingCart,
    flow: ['Order placed', 'Inventory updated', 'Shipping created', 'Customer notified']
  },
  {
    title: 'Appointment Scheduling',
    description: 'Sync calendars across platforms, send reminders, update your CRM, and prepare meeting notes automatically.',
    icon: Calendar,
    flow: ['Booking made', 'Calendars synced', 'Reminders sent', 'CRM updated']
  },
  {
    title: 'Email & Communication',
    description: 'Route emails to the right team members, create tasks from messages, and keep your communication organized.',
    icon: Mail,
    flow: ['Email received', 'Categorized', 'Task created', 'Team assigned']
  },
  {
    title: 'Data Synchronization',
    description: 'Keep all your databases, spreadsheets, and apps in perfect sync. Changes in one place update everywhere.',
    icon: Link2,
    flow: ['Data changed', 'Systems detected', 'Updates pushed', 'All synced']
  }
]

const integrations = [
  'QuickBooks', 'Salesforce', 'HubSpot', 'Slack', 'Workspace',
  'Microsoft 365', 'Shopify', 'Stripe', 'Calendly', 'Mailchimp',
  'Notion', 'Airtable', 'And many more...'
]

const processSteps = [
  {
    step: '1',
    title: 'Tell Us Your Process',
    description: 'Share how you currently work'
  },
  {
    step: '2',
    title: 'We Design the Automation',
    description: 'Custom-built for your needs'
  },
  {
    step: '3',
    title: 'Watch It Work',
    description: 'Sit back while tasks complete automatically'
  }
]

export default function AutomationsPage() {
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
                Automations
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[var(--ink)]"
              >
                Connect Your Software, Eliminate Manual Work
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-base sm:text-lg text-[var(--ink-muted)] max-w-2xl"
              >
                We connect all your business software so data flows automatically between systems.
                No more manual entry, no more errors, no more wasted time. Everything stays in sync.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-8 flex flex-col sm:flex-row items-center gap-4"
              >
                <Link href="/contact" className="btn-primary">
                  Get a Custom Automation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/get-started" className="btn-secondary">
                  View Pricing
                </Link>
              </motion.div>
            </div>

            {/* Process Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative"
            >
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">How it works</p>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">Custom built</span>
                </div>

                <div className="mt-6 space-y-4">
                  {processSteps.map((step) => (
                    <div key={step.step} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                          {step.step}
                        </span>
                        <p className="text-sm font-semibold text-[var(--ink)]">{step.title}</p>
                      </div>
                      <p className="mt-2 text-xs text-[var(--ink-muted)] pl-9">{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {['Voice AI', 'Chat AI', 'Automations', 'Knowledge'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--ink-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
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
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Why Automate</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-semibold tracking-tight text-[var(--ink)]">
              Work Smarter, Not Harder
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
              Stop wasting time on tasks that should happen automatically.
              Let your systems do the work while you focus on growing your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)] hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[var(--accent-strong)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">{benefit.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Examples */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Examples</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-semibold tracking-tight text-[var(--ink)]">
              What We Can Automate
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
              Here are just a few examples of how we can connect your systems and automate your workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)] hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                  <example.icon className="w-6 h-6 text-[var(--accent-strong)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 font-display">{example.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">{example.description}</p>

                {/* Flow visualization */}
                <div className="flex flex-wrap items-center gap-2">
                  {example.flow.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center">
                      <span className="text-xs bg-[var(--paper-muted)] text-[var(--ink-muted)] px-2 py-1 rounded-full">
                        {step}
                      </span>
                      {stepIndex < example.flow.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-[var(--ink-muted)] mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-[var(--paper-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h3 className="text-xl font-semibold text-[var(--ink)] mb-2 font-display">
              Connect With Your Favorite Tools
            </h3>
            <p className="text-sm text-[var(--ink-muted)]">
              We integrate with hundreds of apps and services
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {integrations.map((integration, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[var(--panel)] rounded-full text-sm text-[var(--ink-muted)] border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {integration}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Custom Suite CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8 lg:p-12 shadow-[var(--shadow-soft)] text-center"
          >
            <div className="w-14 h-14 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-7 h-7 text-[var(--accent-strong)]" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-semibold text-[var(--ink)] mb-4 font-display tracking-tight">
              Every Business is Different
            </h2>

            <p className="text-[var(--ink-muted)] mb-8 max-w-2xl mx-auto">
              We don't believe in one-size-fits-all solutions. Tell us about your workflow,
              and we'll design a custom automation that fits exactly how your business operates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-[var(--accent-strong)] text-xl font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] text-sm mb-1">Tell Us Your Process</h3>
                <p className="text-xs text-[var(--ink-muted)]">Share how you currently work</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-[var(--accent-strong)] text-xl font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] text-sm mb-1">We Design the Automation</h3>
                <p className="text-xs text-[var(--ink-muted)]">Custom-built for your needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-[var(--accent-strong)] text-xl font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] text-sm mb-1">Watch It Work</h3>
                <p className="text-xs text-[var(--ink-muted)]">Sit back while tasks complete automatically</p>
              </div>
            </div>

            <Link href="/contact" className="btn-primary inline-flex">
              Contact Us for Custom Automation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA - Clean neutral style */}
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
              Ready to Automate Your Business?
            </h2>
            <p className="text-[var(--ink-muted)] text-lg mb-8 max-w-2xl mx-auto">
              Stop doing things manually. Let us connect your systems and put your workflows on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/get-started" className="btn-secondary">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
