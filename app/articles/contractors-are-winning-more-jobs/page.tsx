"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
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
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

export default function AIHomeServicesArticle() {
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
            AI for Home Services: How Contractors Are Winning More Jobs and
            Serving Customers Better
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
            <span className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Home Services & AI
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
              The home services industry has traditionally relied on word of
              mouth and hard work. In 2025, artificial intelligence is helping
              contractors win more business, serve customers faster, and
              streamline operations, from plumbers and electricians to HVAC,
              roofing, cleaning, and pest control companies.
            </p>
          </div>

          {/* Changing Expectations */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            The Changing Expectations of Homeowners
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Instant Responses
                </h3>
              </div>
              <p className="text-gray-600">
                Homeowners expect the speed and convenience of big tech
                platforms, wanting instant replies for quotes, real-time updates
                on appointments, and transparent communication. AI assistants
                handle inquiries 24/7, ensuring no jobs are lost due to missed
                calls.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Reliable 24/7 Service
                </h3>
              </div>
              <p className="text-gray-600">
                Whether it’s an emergency plumber at 2 a.m. or a routine pest
                control service, AI systems gather job details, schedule
                appointments instantly, and maintain consistent communication
                with customers.
              </p>
            </div>
          </div>

          {/* Smarter Scheduling and Dispatch */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Smarter Scheduling and Dispatch
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Optimized Routes
                </h3>
              </div>
              <p className="text-gray-600">
                AI analyzes requests, technician availability, and traffic data
                to optimize daily routes. Plumbing, HVAC, and other contractors
                can reduce wasted drive time and prioritize urgent jobs
                automatically.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Higher Job Completion
                </h3>
              </div>
              <p className="text-gray-600">
                Efficient scheduling increases the number of jobs completed per
                day while improving customer satisfaction through minimized
                delays and faster service.
              </p>
            </div>
          </div>

          {/* Automating Estimates and Invoices */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Automating Estimates and Invoices
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <DollarSign className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Instant Documentation
                </h3>
              </div>
              <p className="text-gray-600">
                AI generates estimates and invoices automatically from job
                details. Roofers can create itemized quotes from photos, while
                cleaning services can send invoices immediately after a job with
                payment links included.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Reduced Admin Burden
                </h3>
              </div>
              <p className="text-gray-600">
                By reducing paperwork, contractors free up hours each week to
                focus on revenue-generating work, improving efficiency and cash
                flow.
              </p>
            </div>
          </div>

          {/* Predictive Maintenance */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Predictive Maintenance and Upselling
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Wrench className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Proactive Service
                </h3>
              </div>
              <p className="text-gray-600">
                AI predicts when equipment may fail or need servicing, allowing
                contractors to contact customers proactively. This builds
                loyalty and opens new revenue streams for HVAC, roofing, and
                pest control services.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Upselling Opportunities
                </h3>
              </div>
              <p className="text-gray-600">
                AI insights help contractors anticipate customer needs, offering
                timely upgrades, seasonal services, or preventive maintenance
                before problems occur.
              </p>
            </div>
          </div>

          {/* Real Examples in the Field */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Real Examples in the Field
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-gray-600">
                Contractors using AI assistants report higher booking rates,
                optimized routes, fewer billing errors, faster payments, and
                improved cash flow.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-gray-600">
                Predictive maintenance programs drive new revenue streams from
                proactive service calls, turning reactive businesses into
                proactive partners.
              </p>
            </div>
          </div>

          {/* Koby AI */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Where Koby AI Fits In
          </h2>
          <p className="text-gray-600 mb-8">
            Generic tools provide automation, but every contractor’s workflow is
            different. Koby AI builds custom automations for your business, from
            AI assistants gathering trade-specific details to scheduling tools
            integrated with calendars and dispatch systems.
          </p>
          <p className="text-gray-600 mb-8">
            AI solutions reduce missed calls, paperwork, and coordination
            problems without disrupting daily operations. Small businesses free
            up owners from admin tasks, while larger firms scale efficiently
            without added overhead.
          </p>

          {/* Future of Trades */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            The Future of Trades Runs on AI
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Skilled tradespeople remain irreplaceable, but AI ensures they can
              focus on their craft instead of distractions. Contractors using AI
              book jobs faster, optimize routes, predict needs, and maintain
              steady cash flow.
            </p>
            <p className="text-gray-600">
              AI enhances the human element in home services, helping
              tradespeople do more of what they do best while meeting modern
              customer expectations.
            </p>
            <p className="text-gray-600">
              Contractors embracing AI today are positioning themselves to lead
              their markets tomorrow, staying ahead of competitors and
              delivering superior service.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
