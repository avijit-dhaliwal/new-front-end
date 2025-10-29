"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

export default function LegalAIArticle() {
  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />

      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link
            href="/articles"
            className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Articles
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            The New Brief Partner: How AI is Changing Legal Practice
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
            <span className="flex items-center">
              <Scale className="w-5 h-5 mr-2" />
              Legal
            </span>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span>Published Oct 2025</span>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 mb-16"
        >
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                From weeks of research to minutes of results, AI-powered
                platforms are transforming the way legal professionals work.
              </h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Real-World Proof: Firms Already Seeing Gains
              </h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Smarter Contracts, Faster Drafts, Better Outcomes
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Contract Review
                  </h3>
                  <p className="text-gray-600">
                    AI reviews contracts with high accuracy, reducing review
                    time by half.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Drafting Automation
                  </h3>
                  <p className="text-gray-600">
                    Common documents such as NDAs, pleadings, or compliance
                    reports can be partially automated.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Consistent Quality
                  </h3>
                  <p className="text-gray-600">
                    Firms achieve faster turnaround and more consistent output
                    across attorneys.
                  </p>
                </div>
              </div>
            </div>

            {/* Opportunities Across the Firm */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Beyond the Courtroom: Opportunities Across the Firm
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Billing and Invoicing
                  </h3>
                  <p className="text-gray-600">
                    Automated systems ensure accuracy in client accounts and
                    free staff from manual entry.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Client Communication
                  </h3>
                  <p className="text-gray-600">
                    Virtual assistants handle scheduling and intake questions,
                    allowing attorneys to focus on billable work.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Knowledge Management
                  </h3>
                  <p className="text-gray-600">
                    AI mines past cases and contracts to create a searchable
                    knowledge base for attorneys.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Firm Leadership Insights
                  </h3>
                  <p className="text-gray-600">
                    Dashboards track caseloads, billable hours, and
                    profitability, giving partners real-time visibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Where We Fit In */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Where We Fit In
              </h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  While many firms purchase standalone tools for research or
                  contracts, Koby AI takes a broader view. We design custom AI
                  automations that align with your firm’s specific processes.
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Looking Ahead: The Future of Practice
              </h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
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
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
