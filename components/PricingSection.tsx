'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: "AI Chatbot",
    description: "Perfect for customer support and lead generation",
    price: 50,
    period: "month",
    icon: <Zap className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    popular: false,
    features: [
      "24/7 AI chatbot availability",
      "Multi-language support",
      "Calendar integration",
      "Lead qualification",
      "67% increase in sales",
      "Email support"
    ]
  },
  {
    name: "Phone Service",
    description: "Professional AI virtual receptionist",
    price: 400,
    period: "month",
    icon: <Star className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
    popular: false,
    features: [
      "Unlimited calls handled",
      "24/7 availability",
      "Custom greeting setup",
      "Calendar integration",
      "Instant message delivery",
      "Multi-call handling"
    ]
  },
  {
    name: "Bundle Pack",
    description: "AI Chatbot + Phone Service combined",
    price: 425,
    period: "month",
    icon: <Crown className="w-6 h-6" />,
    color: "from-accent-500 to-accent-600",
    bgColor: "from-accent-50 to-accent-100",
    popular: true,
    features: [
      "Everything in AI Chatbot",
      "Everything in Phone Service",
      "Unified dashboard",
      "Priority support",
      "Save $25/month",
      "Best value option"
    ]
  },
  {
    name: "Custom AI Suite",
    description: "Tailored solutions for your industry",
    price: "Custom",
    period: "consultation",
    icon: <Crown className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    popular: false,
    features: [
      "Industry-specific features",
      "Custom integrations",
      "Dedicated support",
      "Flexible pricing",
      "White-label options",
      "Requires consultation"
    ]
  }
]

export default function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the perfect plan for your business. All plans include our core AI features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-800' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-800' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-150 border-2 ${
                plan.popular 
                  ? 'border-accent-500 orange-glow' 
                  : 'border-gray-100 hover:border-accent-300'
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
              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                {plan.icon}
              </div>

              {/* Plan Name & Description */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2 font-display">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === "Custom" ? (
                  <span className="text-4xl font-bold text-gray-800 font-display">
                    {plan.price}
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-gray-800 font-display">
                      ${billingPeriod === 'yearly' ? Math.round(plan.price * 12 * 0.8) : plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingPeriod === 'yearly' ? 'year' : plan.period}
                    </span>
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-150 flex items-center justify-center ${
                  plan.price === "Custom"
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                }`}
              >
                {plan.price === "Custom" ? "Contact Us" : "Get Started"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}