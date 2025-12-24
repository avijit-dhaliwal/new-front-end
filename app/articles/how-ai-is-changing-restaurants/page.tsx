"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Zap,
  CheckCircle,
  Calendar,
  Coffee,
  ShoppingCart,
  ChefHat,
  Clipboard,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

import Footer from "@/components/Footer";
import article_image_13 from "../images/article_13.jpg";

export default function AIRestaurantsArticle() {
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
            Smarter Dining, Seamless Service: How AI Is Changing Restaurants and
            Food Service
          </h1>
          <div className="flex items-center justify-center space-x-6 text-[var(--ink-muted)] mb-8">
            <span className="flex items-center">
              <Coffee className="w-5 h-5 mr-2" />
              Restaurants & AI
            </span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>Published Oct 2025</span>
          </div>
        </motion.div>

        <img src={article_image_13.src} alt="image_13" className="pb-6" />

        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
            <p className="text-xl text-[var(--ink-muted)] leading-relaxed mb-4">
              In 2025, AI is no longer a back office tool in restaurants. It
              acts as the maître d’, prep cook, receptionist, and operations
              manager all in one. From fine dining to fast casual, from boutique
              catering to hospitality venues, AI streamlines operations,
              delights guests, and improves profitability.
            </p>
          </div>

          {/* Front of House */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Front of House: A Better Guest Experience
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  AI Receptionists
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI ensures no call or message is missed. Guests can make
                reservations, confirm catering, or ask menu questions at any
                time, freeing staff to focus on in-person hospitality.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Smart Reservations
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                Intelligent systems balance bookings to optimize table turnover,
                predict no-shows, and manage larger events. Guests enjoy a
                seamless experience, and restaurants reduce lost revenue.
              </p>
            </div>
          </div>

          {/* Back of House */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Back of House: Precision and Predictability
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <ChefHat className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Inventory Forecasting
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI predicts ingredient demand, reduces waste, and ensures
                consistent supply. From daily seafood orders to beverage spikes
                during hot weekends, kitchens stay stocked efficiently.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Catering Precision
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI analyzes guest counts, historical events, and menu choices to
                guide prep timelines. Smart kitchen sensors detect equipment
                issues before they disrupt service, acting as an invisible sous
                chef.
              </p>
            </div>
          </div>

          {/* Staff Scheduling */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Staff Scheduling and Labor Efficiency
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Optimized Schedules
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI analyzes sales, local events, weather, and seasonal trends to
                generate fair schedules that avoid overstaffing or shortages,
                benefiting both managers and employees.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Multi-Location Oversight
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI scales across multiple locations for chains and fast casual
                groups, giving corporate leaders real-time visibility into labor
                costs and productivity.
              </p>
            </div>
          </div>

          {/* Data Driven Upselling */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Data Driven Upselling and Personalized Marketing
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <ShoppingCart className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Smart Upsells
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI analyzes customer history to recommend menu items, combo
                meals, or add-ons. Personalized suggestions at the right moment
                boost ticket sizes and guest satisfaction.
              </p>
            </div>

            <div className="bg-[var(--panel)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-soft)]">
              <div className="flex items-center mb-4">
                <Clipboard className="w-8 h-8 text-[var(--accent)] mr-3" />
                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Targeted Marketing
                </h3>
              </div>
              <p className="text-[var(--ink-muted)]">
                AI generates personalized email campaigns and promotional offers
                based on guest preferences and history, helping retain customers
                and increase loyalty.
              </p>
            </div>
          </div>

          {/* Where Koby AI Fits In */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            Where Koby AI Fits In
          </h2>
          <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
            <p className="text-[var(--ink-muted)] mb-8">
              Many restaurants and catering companies need AI solutions tailored
              to their workflows. Koby AI provides custom phone reception,
              chatbots, and back-end automations for scheduling, inventory, and
              reporting. This reduces manual work while enhancing service
              quality.
            </p>
            <p className="text-[var(--ink-muted)] mb-8">
              Koby tailors AI tools to fine dining venues, fast casual chains,
              and catering companies, ensuring technology feels like part of the
              team, not a burden.
            </p>
          </div>

          {/* Future of Dining */}
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-8">
            The Future of Dining Is Smarter
          </h2>
          <div className="bg-[var(--panel)] rounded-2xl p-8 mb-8 border border-[var(--line)]">
            <div className="space-y-4">
              <p className="text-[var(--ink-muted)]">
                Restaurants adopting AI today gain a competitive edge, meeting
                guest expectations for instant answers, seamless service, and
                personalized experiences.
              </p>
              <p className="text-[var(--ink-muted)]">
                AI frees staff from repetitive tasks and provides data-driven
                insights, allowing them to focus on creating memorable dining
                experiences.
              </p>
              <p className="text-[var(--ink-muted)]">
                Hospitality leaders embracing AI now will set the standard for
                restaurants and catering in the future.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
