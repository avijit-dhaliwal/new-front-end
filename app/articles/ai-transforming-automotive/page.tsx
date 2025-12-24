"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Calendar,
  CreditCard,
  Clipboard,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

import Footer from "@/components/Footer";
import article_image_16 from "../images/article_16.jpg";

export default function AIAutomotiveArticle() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      
      <NavBar />

      <div className="pt-20 max-w-4xl mx-auto px-6 sm:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8"
        >
          <Link
            href="/articles"
            className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors duration-100"
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-6 font-display">
            Driving Smarter Service: How AI Is Transforming Automotive Sales and
            Repair
          </h1>
          <div className="flex items-center justify-center space-x-6 text-[var(--ink-muted)] mb-8">
            <span className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Automotive & AI
            </span>
            <span>•</span>
            <span>7 min read</span>
            <span>•</span>
            <span>Published Oct 2025</span>
          </div>
        </motion.div>

        <img src={article_image_16.src} alt="image_16" className="pb-6" />

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
            <p className="text-xl text-[var(--ink-muted)] leading-relaxed mb-4">
              Customers expect speed, transparency, and reliable communication
              when buying cars or booking service appointments. AI is helping
              dealerships and service centers serve customers faster while
              reducing strain on staff.
            </p>
          </div>

          {/* Always Answering the Phone */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Always Answering the Phone
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Phone className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  AI Receptionists
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI answers calls instantly, handles FAQs, and books appointments
                directly into the system. Leads and service inquiries are never
                lost, increasing bookings and customer satisfaction.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Faster Customer Capture
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                From test drives to service bookings, AI ensures all inquiries
                are captured and processed efficiently, eliminating missed
                opportunities.
              </p>
            </div>
          </div>

          {/* Smarter Scheduling and Service Booking */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Smarter Scheduling and Service Booking
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Automated Appointments
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI manages calendars, sends confirmations and reminders, and
                allows rescheduling or cancellations automatically.
                Multi-location franchises route inquiries efficiently.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Smooth Shop Operations
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                By reducing back-and-forth, AI ensures smoother shop workflows
                and better customer experiences.
              </p>
            </div>
          </div>

          {/* Personalized Follow Ups and Marketing */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Personalized Follow Ups and Marketing
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <CreditCard className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Tailored Campaigns
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                Dealerships and service centers can send automated, personalized
                follow ups—financing options, maintenance reminders, or service
                suggestions—building trust and repeat business.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Location & Vehicle Specific
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                Multi-location groups can target customers by location and
                vehicle service history, creating precise and effective
                campaigns without manual effort.
              </p>
            </div>
          </div>

          {/* Reducing Back Office Bottlenecks */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Reducing Back Office Bottlenecks
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Automated Paperwork
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI processes invoices, service reports, warranty, and insurance
                claims faster and with fewer errors. Managers get clear
                dashboards on sales and service activity.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Focus on Customers
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                By freeing staff from admin work, AI allows teams to spend more
                time serving customers and increasing satisfaction.
              </p>
            </div>
          </div>

          {/* Where Koby AI Fits In */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Where Koby AI Fits In
          </h2>
          <p className="text-[var(--ink-muted)] mb-6">
            Koby AI delivers practical, customized solutions for automotive
            businesses, including:
          </p>
          <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
            <ul className="list-disc list-inside text-[var(--ink-muted)] mb-8 space-y-2">
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[var(--accent)] mr-3" />
                24/7 AI receptionists answering calls, chats, and booking
                appointments.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[var(--accent)] mr-3" />
                Automated scheduling systems with confirmations and reminders.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[var(--accent)] mr-3" />
                Personalized follow up campaigns for sales and service.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[var(--accent)] mr-3" />
                Back office automations processing invoices, reports, and
                warranty claims.
              </li>
            </ul>
          </div>

          {/* Road Ahead */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            The Road Ahead
          </h2>
          <div className="space-y-4">
            <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
              <p className="text-[var(--ink-muted)]">
                AI is no longer optional in automotive sales and service.
                Businesses adopting AI save staff time, build stronger customer
                relationships, and capture revenue that would otherwise slip
                away.
              </p>
              <p className="text-[var(--ink-muted)]">
                The future of the industry is smarter operations powered by AI
                and delivered with a human touch. Every call answered, every
                appointment confirmed, and every interaction seamless.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
