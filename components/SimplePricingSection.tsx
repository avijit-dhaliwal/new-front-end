"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { CheckCircle, Zap, Phone, Crown, MessageCircle } from "lucide-react";

export default function SimplePricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your business needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* AI Chatbot Plan */}
          <motion.div
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl flex flex-col"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI Chatbot
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                $50<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm">
                Customer support & lead generation
              </p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                24/7 AI chatbot availability
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Multi-language support
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Calendar integration
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Lead qualification
              </li>
            </ul>
            <Link href="/contact">
              <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-150">
                Contact Us
              </button>
            </Link>
          </motion.div>

          {/* AI Phone Service Plan */}
          <motion.div
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl flex flex-col"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI Phone Service
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                $400<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm">
                Professional AI virtual receptionist
              </p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Unlimited calls handled
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                24/7 availability
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Custom greeting setup
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Calendar integration
              </li>
            </ul>
            <Link href="/contact">
              <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-150">
                Contact Us
              </button>
            </Link>
          </motion.div>

          {/* Bundle Pack Plan */}
          <motion.div
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-accent-500 orange-glow relative flex flex-col"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Best Value
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Bundle Pack
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                $425<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI Chatbot + Phone Service
              </p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Everything in AI Chatbot
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Everything in Phone Service
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Unified dashboard
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Save $25/month
              </li>
            </ul>
            <Link href="/contact">
              <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-150">
                Contact Us
              </button>
            </Link>
          </motion.div>

          {/* Custom AI Suite Plan */}
          <motion.div
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl flex flex-col"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Custom AI Suite
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                Custom
              </div>
              <p className="text-gray-600 text-sm">
                Tailored solutions for your industry
              </p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Industry-specific features
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Custom integrations
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Dedicated support
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Requires consultation
              </li>
            </ul>
            <Link href="/contact">
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-150">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
