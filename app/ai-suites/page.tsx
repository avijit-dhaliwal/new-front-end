"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const benefits = [
  {
    title: "Eliminate Manual Work",
    description: "Stop wasting hours on repetitive data entry. Our automations handle the busywork so your team can focus on what matters.",
    icon: Zap,
    color: "bg-amber-50",
    iconColor: "text-amber-600"
  },
  {
    title: "No More Multiple Entry",
    description: "Enter data once and watch it flow everywhere it needs to go. No more copying and pasting between systems.",
    icon: RefreshCw,
    color: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Reduce Human Error",
    description: "Automated processes don't make typos or forget steps. Get accurate data every time, automatically.",
    icon: CheckCircle,
    color: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Keep Everyone in Sync",
    description: "All your data syncs across systems in real-time. Everyone on your team sees the same up-to-date information.",
    icon: Users,
    color: "bg-purple-50",
    iconColor: "text-purple-600"
  }
];

const automationExamples = [
  {
    title: "Invoice Automation",
    description: "Automatically extract invoice data, update your accounting software, and notify your team when payments are due.",
    icon: FileText,
    flow: ["Invoice received", "Data extracted", "QuickBooks updated", "Team notified"]
  },
  {
    title: "CRM Updating",
    description: "New leads from your website, emails, or forms automatically create contacts and update your CRM with all relevant details.",
    icon: Database,
    flow: ["Lead captured", "Contact created", "Tags applied", "Follow-up scheduled"]
  },
  {
    title: "Order Processing",
    description: "When a customer places an order, automatically update inventory, create shipping labels, and send confirmation emails.",
    icon: ShoppingCart,
    flow: ["Order placed", "Inventory updated", "Shipping created", "Customer notified"]
  },
  {
    title: "Appointment Scheduling",
    description: "Sync calendars across platforms, send reminders, update your CRM, and prepare meeting notes automatically.",
    icon: Calendar,
    flow: ["Booking made", "Calendars synced", "Reminders sent", "CRM updated"]
  },
  {
    title: "Email & Communication",
    description: "Route emails to the right team members, create tasks from messages, and keep your communication organized.",
    icon: Mail,
    flow: ["Email received", "Categorized", "Task created", "Team assigned"]
  },
  {
    title: "Data Synchronization",
    description: "Keep all your databases, spreadsheets, and apps in perfect sync. Changes in one place update everywhere.",
    icon: Link2,
    flow: ["Data changed", "Systems detected", "Updates pushed", "All synced"]
  }
];

const integrations = [
  "QuickBooks", "Salesforce", "HubSpot", "Slack", "Google Workspace",
  "Microsoft 365", "Shopify", "Stripe", "Calendly", "Mailchimp",
  "Notion", "Airtable", "Zapier", "Make", "And many more..."
];

export default function AutomationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-200/15 rounded-full blur-3xl" />

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
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow-orange">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Automations
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display tracking-tight"
            >
              Connect Your Software,{" "}
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                Eliminate Manual Work
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed mb-8"
            >
              We connect all your business software so data flows automatically between systems.
              No more manual entry, no more errors, no more wasted time. Everything stays in sync,
              and it all happens automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/contact" className="btn-primary">
                Get a Custom Automation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Why Automate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 font-display tracking-tight">
              Work Smarter, Not Harder
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
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
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Examples
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 font-display tracking-tight">
              What We Can Automate
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are just a few examples of how we can connect your systems and automate your workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mb-4">
                  <example.icon className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{example.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{example.description}</p>

                {/* Flow visualization */}
                <div className="flex flex-wrap items-center gap-2">
                  {example.flow.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {step}
                      </span>
                      {stepIndex < example.flow.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-gray-400 mx-1" />
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
              Connect With Your Favorite Tools
            </h3>
            <p className="text-sm text-gray-600">
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
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 border border-gray-200 hover:border-accent-300 hover:text-accent-600 transition-colors"
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
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft border border-gray-100 text-center"
          >
            <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-7 h-7 text-accent-600" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Every Business is Different
            </h2>

            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We don't believe in one-size-fits-all solutions. Tell us about your workflow,
              and we'll design a custom automation that fits exactly how your business operates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Tell Us Your Process</h3>
                <p className="text-xs text-gray-500">Share how you currently work</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">We Design the Automation</h3>
                <p className="text-xs text-gray-500">Custom-built for your needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Watch It Work</h3>
                <p className="text-xs text-gray-500">Sit back while tasks complete automatically</p>
              </div>
            </div>

            <Link href="/contact">
              <button className="btn-primary">
                Contact Us for Custom Automation
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
              Ready to Automate Your Business?
            </h2>
            <p className="text-accent-100 text-lg mb-8 max-w-2xl mx-auto">
              Stop doing things manually. Let us connect your systems and put your workflows on autopilot.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-accent-600 font-semibold py-3.5 px-7 rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
