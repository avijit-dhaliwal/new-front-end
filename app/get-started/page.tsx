"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CreditCard,
  MessageCircle,
  Phone,
  Crown,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";
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
    icon: <MessageCircle className="w-6 h-6 text-white" />,
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
    icon: <Phone className="w-6 h-6 text-white" />,
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
    icon: <Crown className="w-6 h-6 text-white" />,
  },
  {
    name: "Custom AI Suite",
    description: "Tailored solutions for your industry",
    price: "Custom",
    period: "consultation",
    popular: false,
    features: [
      "Industry-specific features",
      "Custom integrations",
      "Dedicated support",
      "Flexible pricing",
      "White-label options",
      "Requires consultation",
    ],
    cta: "Contact Us",
    color: "from-purple-500 to-purple-600",
    icon: <Crown className="w-6 h-6 text-white" />,
  },
];

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your account in under 2 minutes with just your email address.",
    icon: <Users className="w-8 h-8 text-accent-500" />,
  },
  {
    number: "02",
    title: "Choose Your Plan & Pay",
    description:
      "Select the plan that best fits your needs and complete your payment.",
    icon: <CreditCard className="w-8 h-8 text-accent-500" />,
  },
  {
    number: "03",
    title: "Personal Meeting",
    description:
      "We work directly with you and your team to set up everything exactly how you want it.",
    icon: <Users className="w-8 h-8 text-accent-500" />,
  },
];

const benefits = [
  {
    icon: <Shield className="w-6 h-6 text-accent-500" />,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and compliance with industry standards.",
  },
  {
    icon: <Users className="w-6 h-6 text-accent-500" />,
    title: "24/7 Support",
    description:
      "Our team is here to help you succeed with round-the-clock support.",
  },
  {
    icon: <Star className="w-6 h-6 text-accent-500" />,
    title: "Proven Results",
    description: "Join 50,000+ businesses already using our AI solutions.",
  },
];

export default function GetStartedPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [selectedPlan, setSelectedPlan] = useState("professional");

  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />

      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-accent-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="text-center max-w-4xl mx-auto px-6 sm:px-8 mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
            Get Started with Koby AI
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Join thousands of businesses already using our AI solutions to drive
            growth, efficiency, and innovation. Get started today and see the
            difference AI can make.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Why Choose Koby AI?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We make AI accessible, powerful, and easy to use for businesses
                of all sizes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                  className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                How It Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting started with Koby AI is simple. Follow these three easy
                steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                  className="text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the plan that best fits your needs. All plans include our
                core AI features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 17 },
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * index,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 flex flex-col ${
                    plan.popular
                      ? "border-accent-500 orange-glow"
                      : "border-gray-100 hover:border-accent-300"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Icon */}
                  <div className="text-center mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-display">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 text-center">
                    {plan.price === "Custom" ? (
                      <span className="text-4xl font-bold text-gray-800 font-display">
                        {plan.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-800 font-display">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600 ml-2">
                          /{plan.period}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                      whileTap={{ scale: 0.95 }}
                      style={{ transform: "translateZ(0)", willChange: "transform" }}
                      className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center ${
                        plan.popular
                          ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg"
                          : plan.price === "Custom"
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg"
                          : "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
