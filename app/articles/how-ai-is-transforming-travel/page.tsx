"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Calendar,
  CreditCard,
  Clipboard,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

export default function AITravelArticle() {
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
            Seamless Journeys, Smarter Service: How AI Is Transforming Travel
            and Hospitality
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Travel & AI
            </span>
            <span>•</span>
            <span>9 min read</span>
            <span>•</span>
            <span>Published Oct 2025</span>
          </div>
        </motion.div>

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              Guests expect fast booking, seamless communication, and
              personalized service across flights, hotels, and tours. AI is
              helping travel and hospitality businesses meet these expectations
              while freeing staff to focus on delivering memorable experiences.
            </p>
          </div>

          {/* Always Available for Guests */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Always Available for Guests
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
                Guests can check reservations, request upgrades, or ask
                questions anytime. Airlines, hotels, and tour operators resolve
                thousands of calls automatically, providing professional support
                without adding staff.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Instant Support for All Guests
                </h3>
              </div>
              <p className="text-gray-600">
                Boutique hotels and smaller operators can offer the same
                responsive, professional support as major brands, ensuring guest
                satisfaction even with limited staff.
              </p>
            </div>
          </div>

          {/* Smarter Reservations and Booking */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Smarter Reservations and Booking
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Automated Reservation Management
                </h3>
              </div>
              <p className="text-gray-600">
                AI assistants handle bookings, confirmations, cancellations, and
                modifications automatically. Car rentals, hotels, and travel
                agencies reduce friction and improve guest experiences.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Simplified Guest Interactions
                </h3>
              </div>
              <p className="text-gray-600">
                AI collects traveler details for agents to handle only complex
                itineraries, saving time while guests enjoy seamless booking and
                rebooking.
              </p>
            </div>
          </div>

          {/* Personalized Guest Experiences */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Personalized Guest Experiences
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <CreditCard className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Tailored Recommendations
                </h3>
              </div>
              <p className="text-gray-600">
                Hotels, airlines, cruise lines, and tour operators can send
                automated pre-arrival messages, upsell seat upgrades or
                excursions, and follow up with guests to enhance their journey
                and generate revenue.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Scalable Personalization
                </h3>
              </div>
              <p className="text-gray-600">
                AI makes personalization scalable without extra staff effort,
                ensuring travelers feel valued while businesses increase upsell
                opportunities.
              </p>
            </div>
          </div>

          {/* Streamlined Back Office Operations */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Streamlined Back Office Operations
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Automated Invoices & Payments
                </h3>
              </div>
              <p className="text-gray-600">
                AI ensures accurate billing, processes refunds and insurance
                claims, and generates reports on occupancy and revenue
                automatically, saving time and reducing errors.
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
                AI forecasts staffing needs for peak and off-peak seasons,
                ensuring proper coverage without overstaffing, keeping
                operations smooth while focusing on guests.
              </p>
            </div>
          </div>

          {/* Where Koby AI Fits In */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Where Koby AI Fits In
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <p className="text-gray-600 mb-6">
              Koby AI builds custom solutions for travel and hospitality brands
              of all sizes, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                24/7 AI receptionists managing calls, chats, and booking
                inquiries.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                Automated reservation management with confirmations,
                cancellations, or modifications.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                Personalized marketing campaigns re-engaging past guests or
                upselling add-ons.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                Back office automations for invoicing, reporting, and refunds.
              </li>
            </ul>
          </div>

          {/* Future of Travel */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            The Future of Travel and Hospitality
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <div className="space-y-4">
              <p className="text-gray-600">
                AI frees staff from repetitive tasks, letting them focus on
                welcoming guests, solving problems, and delivering memorable
                experiences.
              </p>
              <p className="text-gray-600">
                Travel and hospitality businesses that adopt AI today operate
                more efficiently, engage guests personally, and turn inquiries
                into bookings faster.
              </p>
              <p className="text-gray-600">
                With Koby AI, organizations can implement practical, secure, and
                workflow-aligned AI, creating seamless journeys powered by
                technology and delivered with a human touch.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
