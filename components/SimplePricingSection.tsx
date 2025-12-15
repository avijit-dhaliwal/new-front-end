"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Check, MessageCircle, Phone, Crown, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "AI Chatbot",
    price: "50",
    description: "24/7 customer support & lead generation",
    icon: MessageCircle,
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "24/7 AI chatbot availability",
      "Multi-language support",
      "Calendar integration",
      "Lead qualification",
      "Custom responses",
      "Analytics dashboard"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Bundle Pack",
    price: "425",
    description: "AI Chatbot + Phone Service combined",
    icon: Crown,
    color: "from-accent-500 to-accent-600",
    iconBg: "bg-accent-50",
    iconColor: "text-accent-600",
    features: [
      "Everything in Chatbot",
      "Everything in Phone Service",
      "Unified dashboard",
      "Priority support",
      "Save $25/month",
      "Custom integrations"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "AI Phone Service",
    price: "400",
    description: "AI virtual receptionist for your business",
    icon: Phone,
    color: "from-green-500 to-green-600",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    features: [
      "Unlimited calls handled",
      "24/7 availability",
      "Custom greeting setup",
      "Calendar integration",
      "Call transcriptions",
      "Voicemail management"
    ],
    cta: "Get Started",
    popular: false
  }
];

export default function SimplePricingSection() {
  const ref = useRef(null);

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 font-display tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your business needs. All plans include setup assistance and ongoing support.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group hover:-translate-y-1.5 transition-transform duration-300 ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Best Value
                  </span>
                </div>
              )}

              <div className={`bg-white rounded-2xl p-6 lg:p-8 h-full border ${
                plan.popular
                  ? 'border-accent-200 shadow-glow-orange'
                  : 'border-gray-100 shadow-soft'
              } hover:shadow-soft-lg transition-all duration-300`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className={`w-14 h-14 ${plan.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <plan.icon className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-display mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-sm text-gray-500">Starting at</span>
                    <span className="text-4xl font-bold text-gray-900 font-display mx-2">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/contact" className="block">
                  <button className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center group/btn ${
                    plan.popular
                      ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Solution CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="text-gray-600 mb-4">
            Need a custom AI solution for your industry?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-accent-600 font-semibold hover:text-accent-700 transition-colors group"
          >
            Contact us for enterprise pricing
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
