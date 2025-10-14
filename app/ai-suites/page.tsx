'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowLeft, CheckCircle, Star, Users, Zap, Cpu, MessageCircle, Building2, ShoppingBag, Heart } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const suites = [
  {
    id: 1,
    title: "Marketing Suite",
    description: "Complete AI-powered marketing automation for agencies and businesses. Create campaigns, manage social media, and optimize conversions with intelligent insights.",
    features: ["Campaign Creation", "Social Media Management", "Email Marketing", "SEO Optimization", "Content Generation", "Analytics & Reporting"],
    icon: "📈",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    stats: {
      accuracy: 95,
      speed: 80,
      languages: 25,
      templates: 1000
    },
    pricing: "From $79/month",
    users: "15,000+",
    included: [
      "Unlimited campaign creation",
      "Multi-platform social media posting",
      "Email sequence automation",
      "SEO content optimization",
      "Brand voice consistency",
      "Real-time performance analytics"
    ],
    notIncluded: [
      "Custom AI model training",
      "White-label solutions",
      "Advanced attribution modeling",
      "Priority support",
      "Custom integrations"
    ]
  },
  {
    id: 2,
    title: "Real Estate Suite",
    description: "Specialized AI tools for real estate professionals. Generate property descriptions, qualify leads, schedule showings, and manage client communications.",
    features: ["Property Descriptions", "Lead Qualification", "Appointment Scheduling", "Market Analysis", "Client Communication", "Document Generation"],
    icon: "🏠",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
    stats: {
      accuracy: 98,
      speed: 90,
      languages: 15,
      templates: 500
    },
    pricing: "From $59/month",
    users: "8,500+",
    included: [
      "Automated property descriptions",
      "Lead scoring and qualification",
      "Calendar integration for showings",
      "Market trend analysis",
      "Client follow-up automation",
      "Listing optimization tools"
    ],
    notIncluded: [
      "Custom MLS integrations",
      "Advanced market predictions",
      "White-label solutions",
      "Dedicated support",
      "Custom CRM development"
    ]
  },
  {
    id: 3,
    title: "Boutique Shop Suite",
    description: "Perfect for small retail businesses. Manage inventory, create product descriptions, handle customer service, and optimize your online presence.",
    features: ["Product Descriptions", "Inventory Management", "Customer Service", "Social Media", "Email Marketing", "Sales Analytics"],
    icon: "🛍️",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    stats: {
      accuracy: 92,
      speed: 85,
      languages: 20,
      templates: 750
    },
    pricing: "From $39/month",
    users: "12,000+",
    included: [
      "Automated product descriptions",
      "Inventory level monitoring",
      "24/7 customer support chatbot",
      "Social media content creation",
      "Email marketing campaigns",
      "Sales performance tracking"
    ],
    notIncluded: [
      "Custom e-commerce platform",
      "Advanced inventory forecasting",
      "White-label solutions",
      "Priority support",
      "Custom integrations"
    ]
  },
  {
    id: 4,
    title: "Healthcare Suite",
    description: "HIPAA-compliant AI tools for healthcare providers. Manage appointments, handle patient inquiries, generate reports, and streamline administrative tasks.",
    features: ["Appointment Scheduling", "Patient Communication", "Document Generation", "Insurance Verification", "Follow-up Care", "Compliance Monitoring"],
    icon: "🏥",
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100",
    stats: {
      accuracy: 96,
      speed: 75,
      languages: 30,
      templates: 1200
    },
    pricing: "From $99/month",
    users: "6,500+",
    included: [
      "HIPAA-compliant patient communication",
      "Automated appointment scheduling",
      "Insurance verification assistance",
      "Medical document generation",
      "Patient follow-up automation",
      "Compliance reporting tools"
    ],
    notIncluded: [
      "Custom EMR integrations",
      "Advanced medical AI models",
      "White-label solutions",
      "Priority support",
      "Custom integrations"
    ]
  }
]

export default function AISuitesPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [expandedSuites, setExpandedSuites] = useState<Set<number>>(new Set())

  const toggleExpanded = (suiteId: number) => {
    setExpandedSuites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(suiteId)) {
        newSet.delete(suiteId)
      } else {
        newSet.add(suiteId)
      }
      return newSet
    })
  }

  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />
      
      <div className="pt-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-100">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto px-6 sm:px-8 mb-16 relative">
          {/* Fixed Glow Background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.3))',
              filter: 'blur(60px)',
              WebkitFilter: 'blur(60px)',
              zIndex: -1
            }}
          ></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center orange-glow">
                <Cpu className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
              Industry AI Suites
            </h1>
          </motion.div>
          
          <p className="text-xl text-gray-600 leading-relaxed relative z-10">
            Specialized AI solutions tailored for your industry. From marketing agencies to healthcare providers, 
            we have the perfect suite to accelerate your business growth.
          </p>
        </div>

        {/* Suites Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 sm:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {suites.map((suite, index) => (
              <motion.div
                key={suite.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-150 border border-gray-100 overflow-hidden group orange-glow"
              >
                {/* Subtle background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${suite.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-150`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${suite.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-150`}>
                    <span className="text-3xl">{suite.icon}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 font-display">{suite.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {suite.description}
                  </p>

                  {/* Included Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">What's Included:</h4>
                    <div className="space-y-2">
                      {suite.included.slice(0, 4).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                      {expandedSuites.has(suite.id) && suite.included.slice(4).map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex + 4}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center text-gray-700"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </motion.div>
                      ))}
                      {suite.included.length > 4 && (
                        <button
                          onClick={() => toggleExpanded(suite.id)}
                          className="text-xs text-accent-500 hover:text-accent-600 ml-5 font-medium transition-colors duration-100"
                        >
                          {expandedSuites.has(suite.id) 
                            ? 'Show less' 
                            : `+${suite.included.length - 4} more features`
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-accent-500 font-display">
                        {suite.stats.accuracy}%
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Accuracy</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-accent-500 font-display">
                        {suite.stats.speed}%
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Speed</div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <div className="text-gray-600">
                      <span className="font-semibold text-gray-800">{suite.users}</span> users
                    </div>
                    <div className="text-gray-600">
                      {suite.pricing}
                    </div>
                  </div>

                  {/* Not Included Notice */}
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      <strong>Need more?</strong> Custom features, integrations, and enterprise solutions available. 
                      <span className="text-accent-600 font-semibold"> Contact us for a quote.</span>
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2">
                    <Link href="/get-started">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`w-full bg-gradient-to-r ${suite.color} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 group-hover:shadow-2xl`}
                      >
                        Get Started
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                      className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-xl hover:bg-gray-200 transition-all duration-150 text-sm"
                    >
                      Contact for Custom Quote
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Suite Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Don't See What You're Looking For?
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                We understand every business is unique. Our team can create a custom AI suite 
                tailored specifically to your industry, workflow, and business needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Custom Features</h3>
                  <p className="text-sm text-gray-600">Tailored AI tools for your specific use cases</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Industry Integration</h3>
                  <p className="text-sm text-gray-600">Seamless integration with your existing systems</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Dedicated Support</h3>
                  <p className="text-sm text-gray-600">Personalized onboarding and ongoing assistance</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="bg-accent-500 text-white font-semibold py-3 px-8 rounded-xl hover:bg-accent-600 transition-all duration-150"
                >
                  Contact Us for Custom Suite
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-600 mb-8">
            Get started with our AI suites today and see the difference AI can make.
          </p>
          <div className="flex justify-center">
            <Link href="/get-started">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="btn-primary"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}