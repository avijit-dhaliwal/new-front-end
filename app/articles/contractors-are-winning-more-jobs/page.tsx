"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Zap,
  CheckCircle,
  Calendar,
  DollarSign,
  Target,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import article_image_12 from "../images/article_12.jpg";

export default function AIHomeServicesArticle() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
        <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/articles"
              className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </motion.div>

          {/* Article Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span className="bg-[var(--accent-soft)] text-[var(--accent)] px-3 py-1 rounded-full text-sm font-semibold">
              Home Services & AI
            </span>
            <div className="flex items-center text-[var(--ink-muted)] text-sm gap-4">
              <span className="flex items-center">
                <Wrench className="w-4 h-4 mr-1.5" />
                9 min read
              </span>
              <span>Published Oct 2025</span>
            </div>
          </motion.div>

          {/* Article Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-6 font-display leading-tight tracking-tight"
          >
            AI for Home Services: How Contractors Are Winning More Jobs and
            Serving Customers Better
          </motion.h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <img src={article_image_12.src} alt="AI for Home Services" className="w-full rounded-2xl mb-12" />

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-[var(--panel)] rounded-3xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                The home services industry has traditionally relied on word of
                mouth and hard work. In 2025, artificial intelligence is helping
                contractors win more business, serve customers faster, and
                streamline operations, from plumbers and electricians to HVAC,
                roofing, cleaning, and pest control companies.
              </p>
            </div>

            {/* Changing Expectations */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              The Changing Expectations of Homeowners
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Instant Responses
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  Homeowners expect the speed and convenience of big tech
                  platforms, wanting instant replies for quotes, real-time updates
                  on appointments, and transparent communication. AI assistants
                  handle inquiries 24/7, ensuring no jobs are lost due to missed
                  calls.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Reliable 24/7 Service
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  Whether it's an emergency plumber at 2 a.m. or a routine pest
                  control service, AI systems gather job details, schedule
                  appointments instantly, and maintain consistent communication
                  with customers.
                </p>
              </div>
            </div>

            {/* Smarter Scheduling and Dispatch */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Smarter Scheduling and Dispatch
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Optimized Routes
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI analyzes requests, technician availability, and traffic data
                  to optimize daily routes. Plumbing, HVAC, and other contractors
                  can reduce wasted drive time and prioritize urgent jobs
                  automatically.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Higher Job Completion
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  Efficient scheduling increases the number of jobs completed per
                  day while improving customer satisfaction through minimized
                  delays and faster service.
                </p>
              </div>
            </div>

            {/* Automating Estimates and Invoices */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Automating Estimates and Invoices
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Instant Documentation
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI generates estimates and invoices automatically from job
                  details. Roofers can create itemized quotes from photos, while
                  cleaning services can send invoices immediately after a job with
                  payment links included.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Reduced Admin Burden
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  By reducing paperwork, contractors free up hours each week to
                  focus on revenue-generating work, improving efficiency and cash
                  flow.
                </p>
              </div>
            </div>

            {/* Predictive Maintenance */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Predictive Maintenance and Upselling
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Wrench className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Proactive Service
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI predicts when equipment may fail or need servicing, allowing
                  contractors to contact customers proactively. This builds
                  loyalty and opens new revenue streams for HVAC, roofing, and
                  pest control services.
                </p>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Upselling Opportunities
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)]">
                  AI insights help contractors anticipate customer needs, offering
                  timely upgrades, seasonal services, or preventive maintenance
                  before problems occur.
                </p>
              </div>
            </div>

            {/* Real Examples in the Field */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Real Examples in the Field
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <p className="text-[var(--ink-muted)]">
                  Contractors using AI assistants report higher booking rates,
                  optimized routes, fewer billing errors, faster payments, and
                  improved cash flow.
                </p>
              </div>
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="w-10 h-10 bg-[var(--accent-soft)] rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <p className="text-[var(--ink-muted)]">
                  Predictive maintenance programs drive new revenue streams from
                  proactive service calls, turning reactive businesses into
                  proactive partners.
                </p>
              </div>
            </div>

            {/* Koby AI */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              Where Koby AI Fits In
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-[var(--ink-muted)] mb-4">
                Generic tools provide automation, but every contractor's workflow
                is different. Koby AI builds custom automations for your business,
                from AI assistants gathering trade-specific details to scheduling
                tools integrated with calendars and dispatch systems.
              </p>
              <p className="text-[var(--ink-muted)]">
                AI solutions reduce missed calls, paperwork, and coordination
                problems without disrupting daily operations. Small businesses
                free up owners from admin tasks, while larger firms scale
                efficiently without added overhead.
              </p>
            </div>

            {/* Future of Trades */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-8 font-display">
              The Future of Trades Runs on AI
            </h2>
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="space-y-4">
                <p className="text-[var(--ink-muted)]">
                  Skilled tradespeople remain irreplaceable, but AI ensures they
                  can focus on their craft instead of distractions. Contractors
                  using AI book jobs faster, optimize routes, predict needs, and
                  maintain steady cash flow.
                </p>
                <p className="text-[var(--ink-muted)]">
                  AI enhances the human element in home services, helping
                  tradespeople do more of what they do best while meeting modern
                  customer expectations.
                </p>
                <p className="text-[var(--ink-muted)]">
                  Contractors embracing AI today are positioning themselves to
                  lead their markets tomorrow, staying ahead of competitors and
                  delivering superior service.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-[var(--panel)] rounded-3xl p-10 lg:p-14 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center">
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-4 font-display">
              Ready to Transform Your Contracting Business?
            </h3>
            <p className="text-[var(--ink-muted)] mb-8 max-w-xl mx-auto">
              Get expert guidance on AI-powered solutions tailored to
              your trade business needs.
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
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
