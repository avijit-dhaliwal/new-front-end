"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Users,
  Calendar,
  Zap,
  Clipboard,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

export default function AIRetailArticle() {
  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Smarter Shopping, Stronger Businesses: How AI Is Transforming Retail
            and E-Commerce
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
            <span className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Retail & AI
            </span>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span>Published Oct 2025</span>
          </div>
        </motion.div>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              Customers now expect instant answers, seamless transactions, and
              personalized experiences whether shopping online or in-store. AI
              is helping retail chains and e-commerce brands deliver this
              experience while streamlining operations behind the scenes.
            </p>
          </div>

          {/* Always On Customer Service */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Always On Customer Service
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  AI Receptionists & Chatbots
                </h3>
              </div>
              <p className="text-gray-600">
                AI can handle customer inquiries 24/7, answering questions about
                order status, product availability, return policies, or
                appointment bookings instantly. No missed calls, no long wait
                times.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <ShoppingCart className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Seamless Customer Experience
                </h3>
              </div>
              <p className="text-gray-600">
                For growing e-commerce stores or retail chains, AI ensures
                round-the-clock support, leveling the playing field with the
                largest players and keeping every shopper feeling valued.
              </p>
            </div>
          </div>

          {/* Smarter Scheduling */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Smarter Scheduling and Appointments
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Automated Appointments
                </h3>
              </div>
              <p className="text-gray-600">
                AI assistants can book appointments, confirm reservations, and
                send reminders automatically, providing a smoother experience
                for customers and employees alike.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Optimized Staffing
                </h3>
              </div>
              <p className="text-gray-600">
                AI analyzes store traffic and sales patterns to recommend
                staffing levels, preventing overstaffing or shortages during
                peak hours.
              </p>
            </div>
          </div>

          {/* Personalized Marketing */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Personalized Marketing That Scales
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Tailored Campaigns
                </h3>
              </div>
              <p className="text-gray-600">
                AI segments customers by behavior to generate campaigns tailored
                to preferences. From personalized discount codes to product
                reminders, marketing becomes more effective without extra staff
                effort.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <CreditCard className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  E-Commerce Upsells
                </h3>
              </div>
              <p className="text-gray-600">
                AI can automatically suggest products, bundles, or promotions
                based on purchase history, helping businesses increase revenue
                and deepen customer relationships.
              </p>
            </div>
          </div>

          {/* Streamlined Back Office */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Streamlined Back Office Work
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Automated Invoicing
                </h3>
              </div>
              <p className="text-gray-600">
                AI automates repetitive tasks like invoice processing,
                reporting, and returns handling. This reduces errors, saves
                hours, and lets staff focus on higher-value work.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Real-Time Dashboards
                </h3>
              </div>
              <p className="text-gray-600">
                Reporting tools pull data from sales and inventory systems
                automatically, producing real-time insights for faster decision
                making.
              </p>
            </div>
          </div>

          {/* Where Koby AI Fits In */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Where Koby AI Fits In
          </h2>
          <p className="text-gray-600 mb-6">
            Koby AI designs custom automations that fit each business workflow.
            This can include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
            <li>
              24/7 AI receptionists handling calls, chats, or website messages
              instantly.
            </li>
            <li>
              Intelligent booking assistants that manage reservations and
              appointments automatically.
            </li>
            <li>
              Automated marketing campaigns tailored to customer behavior.
            </li>
            <li>
              Back office automations for invoices, reporting, and returns with
              minimal oversight.
            </li>
          </ul>

          {/* Future of Retail */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            The Future of Retail and E-Commerce
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              AI amplifies the human touch, letting staff focus on creativity,
              strategy, and personal service while automating repetitive tasks.
            </p>
            <p className="text-gray-600">
              Companies adopting AI today respond faster, market more
              effectively, and operate efficiently, gaining a competitive edge.
            </p>
            <p className="text-gray-600">
              With the right partner, AI becomes not just a tool for efficiency
              but a driver of growth and stronger customer relationships.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
