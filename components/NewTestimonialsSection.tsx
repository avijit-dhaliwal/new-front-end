'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "TechFlow Inc.",
    avatar: "SC",
    rating: 5,
    text: "Koby AI has revolutionized our data analysis process. We've seen a 300% increase in efficiency and our team can now focus on strategic decisions rather than manual data processing.",
    highlight: "300% efficiency increase"
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Marketing",
    company: "GrowthCo",
    avatar: "MR",
    rating: 5,
    text: "The content generation suite is absolutely incredible. We've reduced our content creation time by 80% while maintaining the highest quality standards. Our engagement rates have never been higher.",
    highlight: "80% time saved"
  },
  {
    name: "Emily Watson",
    role: "Customer Success Director",
    company: "ServicePro",
    avatar: "EW",
    rating: 5,
    text: "Our customer support has been transformed. The AI chatbot handles 90% of inquiries instantly, and our customer satisfaction scores have improved dramatically. It's like having a superhuman support team.",
    highlight: "90% auto-resolution"
  },
  {
    name: "David Kim",
    role: "CEO",
    company: "InnovateLab",
    avatar: "DK",
    rating: 5,
    text: "The sales optimization suite helped us increase our conversion rates by 150%. The AI insights are incredibly accurate and have become essential to our sales strategy.",
    highlight: "150% conversion increase"
  },
  {
    name: "Lisa Thompson",
    role: "Operations Manager",
    company: "LogiFlow",
    avatar: "LT",
    rating: 5,
    text: "Koby AI's predictive analytics have saved us millions in operational costs. The accuracy of their forecasting models is remarkable, and the ROI has been immediate.",
    highlight: "$2M+ cost savings"
  },
  {
    name: "James Wilson",
    role: "Product Manager",
    company: "AppVenture",
    avatar: "JW",
    rating: 5,
    text: "The integration was seamless and the support team is outstanding. We went from concept to production in just 2 weeks. The AI capabilities have exceeded all our expectations.",
    highlight: "2 weeks time to production"
  }
]

const companies = [
  "Microsoft", "Google", "Amazon", "OpenAI", "Anthropic", "Tesla", "Meta", "Apple"
]

export default function NewTestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how companies worldwide are transforming their operations with Koby AI
          </p>
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="text-gray-400 font-semibold text-lg hover:text-accent-500 transition-colors duration-300"
            >
              {company}
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="bg-gray-50 rounded-2xl p-12 shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              {/* Quote Icon */}
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Quote className="w-8 h-8 text-accent-500" />
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-xl text-gray-700 leading-relaxed mb-8"
              >
                "{testimonials[currentIndex].text}"
              </motion.p>

              {/* Highlight */}
              <motion.div
                key={`highlight-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-accent-100 text-accent-700 px-6 py-3 rounded-full inline-block font-semibold mb-8"
              >
                {testimonials[currentIndex].highlight}
              </motion.div>

              {/* Author */}
              <motion.div
                key={`author-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-gray-800">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-600">{testimonials[currentIndex].role}</div>
                  <div className="text-accent-500 font-medium">{testimonials[currentIndex].company}</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 orange-glow"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-accent-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 orange-glow"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}