"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Shield,
  Users,
  Heart,
  ArrowRight,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We push the boundaries of what's possible with AI, constantly exploring new technologies and methodologies.",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Security and reliability are at the core of everything we build. Your data and success are our top priorities.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We believe in the power of working together, both within our team and with our clients to achieve extraordinary results.",
  },
  {
    icon: Heart,
    title: "Empathy",
    description:
      "We understand the challenges businesses face and design solutions that truly make a difference in people's lives.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "50+", label: "Happy Clients" },
  { value: "24/7", label: "Support Available" },
  { value: "5/5", label: "Customer Rating" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden noise-overlay">
        {/* Background */}
        <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
        <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

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
              About Us
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--ink)] mb-6 font-display tracking-tight"
            >
              Transforming Business with{" "}
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] bg-clip-text text-transparent">
                AI Innovation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[var(--ink-muted)] leading-relaxed"
            >
              We're on a mission to democratize artificial intelligence and make
              it accessible to businesses of all sizes. Founded by AI researchers
              and engineers, we believe every company should have access to
              cutting-edge AI technology.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--paper-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-[var(--accent)] font-display mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--ink-muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-6 font-display tracking-tight">
                Empowering Businesses Through AI
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
                To empower businesses with intelligent AI solutions that drive
                growth, efficiency, and innovation. We believe that artificial
                intelligence should be a force for good, helping companies
                achieve their goals while creating better experiences for
                their customers.
              </p>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                Our platform combines the latest advances in machine learning
                with user-friendly interfaces, making it easy for any business
                to harness the power of AI without needing a team of data
                scientists.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-[var(--panel)] rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2 font-display">Our Vision</h3>
                <p className="text-sm text-[var(--ink-muted)]">AI-powered solutions for every business worldwide</p>
              </div>
              <div className="bg-[var(--panel)] rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)] mt-8">
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2 font-display">Our Promise</h3>
                <p className="text-sm text-[var(--ink-muted)]">Reliable, secure, and innovative AI that delivers results</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-[var(--paper-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-5 font-display tracking-tight">
              What Drives Us
            </h2>
            <p className="text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
              These core principles guide everything we do and shape how we
              build products and serve our customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--panel)] rounded-2xl p-6 lg:p-8 shadow-[var(--shadow-soft)] border border-[var(--line)] flex items-start gap-5 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-2 font-display">
                    {value.title}
                  </h3>
                  <p className="text-[var(--ink-muted)] leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--panel)] rounded-3xl p-10 lg:p-14 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-4 font-display tracking-tight">
              Ready to Join Our Journey?
            </h2>
            <p className="text-[var(--ink-muted)] text-lg mb-8 max-w-2xl mx-auto">
              Be part of the AI revolution. Let's build the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started"
                className="btn-primary"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="btn-secondary"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
