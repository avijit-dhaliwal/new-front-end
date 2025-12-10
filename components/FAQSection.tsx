'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "How does the AI chatbot work?",
    answer: "Our AI chatbot uses advanced natural language processing to understand customer inquiries and provide helpful, human-like responses. It integrates with your website and can be customized to match your brand voice, answer frequently asked questions, qualify leads, and even book appointments directly into your calendar."
  },
  {
    question: "What's included in the AI Phone Service?",
    answer: "The AI Phone Service includes a virtual receptionist that answers calls 24/7, handles common inquiries, schedules appointments, and can route urgent calls to the right person. You get unlimited calls, custom greetings, call transcriptions, and a dashboard to review all interactions."
  },
  {
    question: "How long does it take to get set up?",
    answer: "Most businesses are up and running within 24-48 hours for the chatbot and 1-2 weeks for the full phone service. Our team handles all the technical setup and provides personalized onboarding to ensure everything works perfectly for your specific needs."
  },
  {
    question: "Can I customize the AI responses?",
    answer: "Absolutely! You can customize greetings, responses, and the overall personality of your AI assistant. We work with you to train the AI on your specific services, FAQs, and business processes so it represents your brand accurately."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve a wide range of industries including healthcare, real estate, legal, retail, hospitality, and professional services. Our AI Suites offer industry-specific solutions with pre-built workflows and compliance features tailored to each sector."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, security is our top priority. We use bank-level encryption for all data in transit and at rest. We're SOC 2 Type II compliant and HIPAA ready for healthcare clients. All conversations are stored securely and you maintain full ownership of your data."
  },
  {
    question: "What's the pricing model?",
    answer: "We offer transparent, straightforward pricing. The AI Chatbot starts at $50/month, AI Phone Service at $400/month, or get both with our Bundle Pack at $425/month (saving $25). All plans include setup assistance and ongoing support. Enterprise pricing is available for larger organizations."
  },
  {
    question: "Can I try before I buy?",
    answer: "Yes! We offer a free trial so you can experience the AI in action before committing. You can also schedule a personalized demo where we'll show you exactly how Koby AI can work for your specific business."
  },
]

function FAQItem({ faq, isOpen, onClick, index }: {
  faq: typeof faqs[0]
  isOpen: boolean
  onClick: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-gray-100 last:border-b-0"
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-start justify-between text-left group"
      >
        <span className="text-lg font-medium text-gray-900 pr-8 group-hover:text-gray-700 transition-colors">
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isOpen ? 'bg-orange-100' : 'bg-gray-100 group-hover:bg-gray-200'
        }`}>
          {isOpen ? (
            <Minus className="w-4 h-4 text-orange-600" />
          ) : (
            <Plus className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-gray-600 text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Frequently Asked
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-300">
            Questions
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 sm:p-4">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
          >
            Contact our team
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
