"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Shield,
  Users,
  ArrowRight,
  CreditCard,
  MessageCircle,
  Phone,
  Crown,
  Check,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "AI Chatbot",
    description: "Perfect for customer support and lead generation",
    price: 50,
    period: "month",
    popular: false,
    features: [
      "24/7 AI chatbot availability",
      "Multi-language support",
      "Calendar integration",
      "Lead qualification",
      "67% increase in sales",
      "Email support",
    ],
    cta: "Contact Us",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    icon: MessageCircle,
  },
  {
    name: "AI Phone Service",
    description: "Professional AI virtual receptionist",
    price: 400,
    period: "month",
    popular: false,
    features: [
      "Unlimited calls handled",
      "24/7 availability",
      "Custom greeting setup",
      "Calendar integration",
      "Instant message delivery",
      "Multi-call handling",
    ],
    cta: "Contact Us",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    icon: Phone,
  },
  {
    name: "Bundle Pack",
    description: "AI Chatbot + Phone Service combined",
    price: 425,
    period: "month",
    popular: true,
    features: [
      "Everything in AI Chatbot",
      "Everything in Phone Service",
      "Unified dashboard",
      "Priority support",
      "Save $25/month",
      "Best value option",
    ],
    cta: "Contact Us",
    color: "from-accent-500 to-accent-600",
    bgColor: "bg-accent-50",
    textColor: "text-accent-600",
    icon: Crown,
  },
  {
    name: "Custom Automation",
    description: "Tailored solutions for your workflow",
    price: "Custom",
    period: "consultation",
    popular: false,
    features: [
      "Custom integrations",
      "Workflow automation",
      "Dedicated support",
      "Flexible pricing",
      "White-label options",
      "Requires consultation",
    ],
    cta: "Contact Us",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    icon: Crown,
  },
];

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your account in under 2 minutes with just your email address.",
    icon: Users,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    number: "02",
    title: "Choose Your Plan",
    description:
      "Select the plan that best fits your needs and complete your payment.",
    icon: CreditCard,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    number: "03",
    title: "Personal Meeting",
    description:
      "We work directly with you and your team to set up everything exactly how you want it.",
    icon: Users,
    color: "bg-accent-50",
    iconColor: "text-accent-600",
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and compliance with industry standards.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "24/7 Support",
    description:
      "Our team is here to help you succeed with round-the-clock support.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Star,
    title: "Proven Results",
    description: "Join 500+ businesses already using our AI solutions.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Get Started
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display tracking-tight"
            >
              Start Your{" "}
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                AI Journey
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Join hundreds of businesses already using our AI solutions to drive
              growth, efficiency, and innovation. Get started today and see the
              difference AI can make.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Why Choose Koby AI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make AI accessible, powerful, and easy to use for businesses
              of all sizes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Three Simple Steps
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with Koby AI is simple. Follow these three easy
              steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All plans include our
              core AI features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 border-2 flex flex-col ${
                  plan.popular
                    ? "border-accent-500"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Icon */}
                <div className="text-center mb-6">
                  <div
                    className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <plan.icon className={`w-6 h-6 ${plan.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 text-center">
                  {plan.price === "Custom" ? (
                    <span className="text-3xl font-bold text-gray-900 font-display">
                      {plan.price}
                    </span>
                  ) : (
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-gray-900 font-display">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">
                        /{plan.period}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href="/contact" className="block">
                  <button
                    className={`w-full py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
                      plan.popular
                        ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg"
                        : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-accent-100 text-lg mb-8 max-w-2xl mx-auto">
              Get started today and see how AI can help your business grow.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-accent-600 font-semibold py-3.5 px-7 rounded-full hover:bg-gray-100 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
