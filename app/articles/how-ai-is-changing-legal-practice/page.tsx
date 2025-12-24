"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import article_image_9 from "../images/article_9.jpg";

export default function LegalAIArticle() {
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
              Legal
            </span>
            <div className="flex items-center text-[var(--ink-muted)] text-sm gap-4">
              <span className="flex items-center">
                <Scale className="w-4 h-4 mr-1.5" />
                10 min read
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
            The New Brief Partner: How AI is Changing Legal Practice
          </motion.h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <img src={article_image_9.src} alt="AI Changing Legal Practice" className="w-full rounded-2xl mb-12" />

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-[var(--panel)] rounded-3xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                The legal world is built on precedent, precision, and
                credibility. Yet even the most skilled attorneys are constrained
                by the time it takes to review contracts, prepare documents, and
                track ever-shifting regulations. Today, a new partner is
                emerging in law firms across the country: artificial
                intelligence. Rather than replacing lawyers, AI is giving them
                sharper tools to serve clients, win cases, and scale their
                practices with greater efficiency.
              </p>
            </div>

            {/* Weeks of research */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
                From weeks of research to minutes of results
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                  One of the most immediate benefits of AI is speed.
                  Traditionally, legal research requires hours of combing
                  through case law, statutes, and commentary. Now, AI-powered
                  platforms can deliver relevant precedent in minutes. A
                  University of Colorado analysis found firms using AI cut
                  research time by nearly 30 percent, while also surfacing cases
                  attorneys may have otherwise missed. This shift allows
                  attorneys to devote more time to building arguments and less
                  to gathering raw material.
                </p>
              </div>
            </div>

            {/* Real-World Proof */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
                Real-World Proof: Firms Already Seeing Gains
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                  Case studies are proving that AI is not just theory, it is
                  practical. Rupp Pfalzgraf, a firm that integrated AI into its
                  workflow, increased caseload capacity by 10 percent without
                  hiring additional staff. Another firm highlighted in a recent
                  industry study reduced labor costs by up to 80 percent in
                  specific review processes by adopting contract analysis tools
                  that automatically flag risk clauses and anomalies. These are
                  not marginal gains. They represent a structural change in how
                  firms allocate attorney hours.
                </p>
              </div>
            </div>

            {/* Smarter Contracts */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
                Smarter Contracts, Faster Drafts, Better Outcomes
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)] text-center">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Contract Review
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    AI reviews contracts with high accuracy, reducing review
                    time by half.
                  </p>
                </div>
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)] text-center">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Drafting Automation
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    Common documents such as NDAs, pleadings, or compliance
                    reports can be partially automated.
                  </p>
                </div>
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)] text-center">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Consistent Quality
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    Firms achieve faster turnaround and more consistent output
                    across attorneys.
                  </p>
                </div>
              </div>
            </div>

            {/* Opportunities Across the Firm */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
                Beyond the Courtroom: Opportunities Across the Firm
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Billing and Invoicing
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    Automated systems ensure accuracy in client accounts and
                    free staff from manual entry.
                  </p>
                </div>
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Client Communication
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    Virtual assistants handle scheduling and intake questions,
                    allowing attorneys to focus on billable work.
                  </p>
                </div>
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Knowledge Management
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    AI mines past cases and contracts to create a searchable
                    knowledge base for attorneys.
                  </p>
                </div>
                <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                  <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                    Firm Leadership Insights
                  </h3>
                  <p className="text-[var(--ink-muted)]">
                    Dashboards track caseloads, billable hours, and
                    profitability, giving partners real-time visibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Where We Fit In */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
                Where We Fit In
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                  While many firms purchase standalone tools for research or
                  contracts, Koby AI takes a broader view. We design custom AI
                  automations that align with your firm's specific processes.
                  That could mean integrating AI into your existing document
                  management system, building a compliance monitoring workflow
                  that alerts partners when regulations change, or automating
                  onboarding for new clients. Our role is not to sell you a
                  single tool, but to act as a partner in modernizing the way
                  your firm operates.
                </p>
              </div>
            </div>

            {/* Looking Ahead */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
                Looking Ahead: The Future of Practice
              </h2>
              <div className="bg-[var(--panel)] rounded-2xl p-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-4">
                  The legal profession has weathered many shifts, from the
                  arrival of electronic research databases to the rise of
                  virtual hearings. AI is the next leap. Firms that adopt now
                  are not just improving efficiency, they are signaling to
                  clients that they are innovators, prepared for the future of
                  law. The takeaway is simple: AI is not experimental anymore.
                  It is working in law firms today, and with the right partner,
                  your firm can capture these benefits while keeping the focus
                  where it belongs, on serving clients and achieving outcomes.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-[var(--panel)] rounded-3xl p-10 lg:p-14 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center">
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-4 font-display">
              Ready to Transform Your Legal Practice?
            </h3>
            <p className="text-[var(--ink-muted)] mb-8 max-w-xl mx-auto">
              Get expert guidance on AI-powered legal solutions tailored to
              your firm's needs.
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
