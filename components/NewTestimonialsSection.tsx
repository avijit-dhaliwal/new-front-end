'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechFlow Inc.",
    avatar: "SC",
    avatarColor: "from-blue-500 to-blue-600",
    text: "Koby AI has transformed how we handle customer support. Our response time dropped from hours to seconds, and customer satisfaction is at an all-time high.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Marketing, GrowthCo",
    avatar: "MR",
    avatarColor: "from-purple-500 to-purple-600",
    text: "The AI chatbot captures leads 24/7 while we sleep. We've seen a 300% increase in qualified leads since implementing Koby AI on our website.",
    rating: 5,
  },
  {
    name: "Dr. Emily Watson",
    role: "Practice Manager, WellCare Medical",
    avatar: "EW",
    avatarColor: "from-pink-500 to-pink-600",
    text: "The phone service handles appointment scheduling perfectly. Patients love the instant responses, and our staff can focus on actual patient care instead of answering phones.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "CEO, InnovateLab",
    avatar: "DK",
    avatarColor: "from-green-500 to-green-600",
    text: "We tried multiple chatbot solutions before Koby AI. The difference in quality is night and day. It actually understands context and provides helpful answers.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Real Estate Broker, Premier Properties",
    avatar: "LT",
    avatarColor: "from-amber-500 to-amber-600",
    text: "Every missed call used to be a missed opportunity. Now Koby AI handles inquiries instantly, qualifies leads, and books viewings while I'm showing properties.",
    rating: 5,
  },
  {
    name: "James Park",
    role: "Owner, Park's Dental Care",
    avatar: "JP",
    avatarColor: "from-indigo-500 to-indigo-600",
    text: "The AI phone service has been a game-changer for our practice. It handles after-hours calls, appointment reminders, and even insurance questions automatically.",
    rating: 5,
  },
  {
    name: "Amanda Foster",
    role: "Operations Director, ServicePro",
    avatar: "AF",
    avatarColor: "from-cyan-500 to-cyan-600",
    text: "Implementation was incredibly smooth. The Koby AI team walked us through everything, and we were up and running within a week. The ROI was immediate.",
    rating: 5,
  },
  {
    name: "Robert Martinez",
    role: "Partner, Martinez Law Firm",
    avatar: "RM",
    avatarColor: "from-rose-500 to-rose-600",
    text: "Client intake used to be our biggest bottleneck. Now potential clients can get their questions answered and schedule consultations any time of day.",
    rating: 5,
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
        {/* Rating */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        {/* Text */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center text-white text-sm font-semibold`}>
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
            <div className="text-gray-500 text-xs">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function NewTestimonialsSection() {
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-amber-600 text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Loved by Businesses
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-300">
            Across Industries
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="break-inside-avoid">
              <TestimonialCard testimonial={testimonial} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            Join 500+ businesses already using Koby AI
          </p>
        </motion.div>
      </div>
    </section>
  )
}
