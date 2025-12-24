"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import article_image_2 from "../images/article_2.jpg";

export default function CybersecurityArticle() {
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
              AI Security
            </span>
            <div className="flex flex-wrap items-center text-[var(--ink-muted)] text-sm gap-4">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                Security AI Expert
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                Sep 2025
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                10 min read
              </span>
            </div>
          </motion.div>

          {/* Article Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-6 font-display leading-tight tracking-tight"
          >
            AI-Enhanced Cybersecurity: Best Practices for Small Business
            Protection
          </motion.h1>

          {/* Article Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[var(--ink-muted)] leading-relaxed"
          >
            Discover how AI-powered security solutions can protect your small
            business from cyber threats. Learn essential best practices,
            implementation strategies, and cost-effective security measures that
            scale with your growth.
          </motion.p>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <img src={article_image_2.src} alt="AI-Enhanced Cybersecurity" className="w-full rounded-2xl mb-12" />

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[var(--ink-muted)] mb-6">
              In today's digital landscape, small businesses face an
              unprecedented number of cyber threats. With 43% of cyber attacks
              targeting small businesses and 60% of small companies going out of
              business within six months of a cyber attack, implementing robust
              cybersecurity measures is no longer optional—it's essential for
              survival.
            </p>

            <p className="text-lg text-[var(--ink-muted)] mb-8">
              Artificial Intelligence is revolutionizing cybersecurity, offering
              small businesses powerful, cost-effective protection that was
              previously only available to large enterprises.
            </p>

            {/* Critical Statistics Section */}
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border-l-4 border-[var(--accent)] shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-6 font-display">
                Critical Statistics Every Business Owner Should Know
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-[var(--ink)]">
                      43% of cyber attacks target small businesses
                    </strong>
                    <p className="text-[var(--ink-muted)] mt-1">
                      Small businesses are increasingly becoming the primary
                      target for cybercriminals due to their typically weaker
                      security infrastructure.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-[var(--ink)]">
                      60% of small companies fail within 6 months of a cyber
                      attack
                    </strong>
                    <p className="text-[var(--ink-muted)] mt-1">
                      The financial and reputational damage from cyber attacks
                      can be devastating for small businesses without proper
                      recovery plans.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-[var(--ink)]">
                      AI can detect 99.9% of known threats and 95% of unknown
                      threats
                    </strong>
                    <p className="text-[var(--ink-muted)] mt-1">
                      Modern AI security solutions provide comprehensive
                      protection against both known and emerging threats.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Core Security Fundamentals */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
              Core Security Fundamentals for Small Businesses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Multi-Factor Authentication (MFA)
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)] mb-4">
                  Implement MFA across all business accounts and systems. This
                  simple step can prevent 99.9% of automated attacks.
                </p>
                <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Enable MFA for email accounts
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Protect banking and financial systems
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Secure cloud storage and backup systems
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Regular Software Updates
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)] mb-4">
                  Keep all software, operating systems, and applications updated
                  to patch security vulnerabilities.
                </p>
                <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Enable automatic updates where possible
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Regularly update web browsers and plugins
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Monitor for security patches and apply immediately
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Strong Password Policies
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)] mb-4">
                  Implement and enforce strong password requirements across all
                  business systems and accounts.
                </p>
                <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Use unique passwords for each account
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Require minimum 12 characters with complexity
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Consider using a password manager
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">
                    Regular Data Backups
                  </h3>
                </div>
                <p className="text-[var(--ink-muted)] mb-4">
                  Maintain secure, regular backups of all critical business data
                  to ensure quick recovery from attacks.
                </p>
                <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Implement 3-2-1 backup strategy
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Test backup restoration regularly
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                    Store backups in secure, off-site locations
                  </li>
                </ul>
              </div>
            </div>

            {/* Employee Security Training */}
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-6 font-display">
              Employee Security Training
            </h2>

            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border-l-4 border-[var(--accent)] shadow-[var(--shadow-soft)]">
              <h3 className="text-2xl font-semibold text-[var(--ink)] mb-6 font-display">
                Building a Security-Aware Culture
              </h3>
              <p className="text-[var(--ink-muted)] mb-6">
                Your employees are your first line of defense against cyber
                threats. Regular training and awareness programs are essential
                for maintaining a secure business environment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Essential Training Topics
                  </h4>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Phishing email recognition and reporting
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Safe internet browsing practices
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Password security and management
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Social engineering awareness
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--ink)] mb-3">
                    Training Implementation
                  </h4>
                  <ul className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Conduct monthly security briefings
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Simulate phishing attacks for practice
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Provide clear incident reporting procedures
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></span>
                      Reward security-conscious behavior
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-4 font-display">
                Protecting Your Business Future
              </h2>
              <p className="text-lg text-[var(--ink-muted)] mb-4">
                Cybersecurity is not a one-time implementation but an ongoing
                commitment to protecting your business, your customers, and your
                future. By implementing these AI-enhanced security measures,
                you're not just preventing attacks—you're building a foundation
                of trust and reliability that will support your business growth
                for years to come.
              </p>
              <p className="text-lg text-[var(--ink-muted)]">
                Remember, the cost of prevention is always less than the cost of
                recovery. Start with the fundamentals, gradually implement more
                advanced AI-powered solutions, and always stay vigilant.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-[var(--panel)] rounded-3xl p-10 lg:p-14 shadow-[var(--shadow-soft)] border border-[var(--line)] text-center">
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-4 font-display">
              Ready to Secure Your Business?
            </h3>
            <p className="text-[var(--ink-muted)] mb-8 max-w-xl mx-auto">
              Get expert guidance on AI-powered cybersecurity solutions tailored to
              your business needs.
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
