'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowLeft, Bot, MessageCircle, Sparkles, CheckCircle, Zap, Star, Users, X, Send } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const performanceMetrics = [
  { number: 67, suffix: "%", label: "Increase in Sales", icon: <CheckCircle className="w-6 h-6" /> },
  { number: 23, suffix: "%", label: "Higher Conversion Rates", icon: <Zap className="w-6 h-6" /> },
  { number: 35, suffix: "%", label: "Consumers Buy from Suggestions", icon: <Star className="w-6 h-6" /> },
  { number: 30, suffix: "%", label: "Cost Savings in Support", icon: <Users className="w-6 h-6" /> }
]

const features = [
  {
    title: "24/7 Availability",
    description: "No missed opportunities - ever. Your AI chatbot never sleeps, ensuring you capture every opportunity",
    icon: <Zap className="w-8 h-8 text-accent-500" />
  },
  {
    title: "Multi-Language Support",
    description: "Speaks multiple languages for international customers",
    icon: <MessageCircle className="w-8 h-8 text-accent-500" />
  },
  {
    title: "Calendar Integration",
    description: "Books appointments directly into your calendar",
    icon: <Bot className="w-8 h-8 text-accent-500" />
  },
  {
    title: "Lead Qualification",
    description: "Collects customer information and qualifies leads automatically",
    icon: <Sparkles className="w-8 h-8 text-accent-500" />
  }
]

const useCases = [
  {
    title: "Restaurants",
    description: "Take reservations, answer menu questions",
    icon: "🍽️"
  },
  {
    title: "Medical Offices",
    description: "Schedule appointments, answer insurance questions",
    icon: "🏥"
  },
  {
    title: "Real Estate",
    description: "Qualify leads, schedule showings",
    icon: "🏠"
  },
  {
    title: "E-commerce",
    description: "Product recommendations, order tracking",
    icon: "🛒"
  }
]

export default function ChatbotPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Koby AI, your intelligent assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Chatbot response logic
  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('pricing') || message.includes('cost') || message.includes('price')) {
      return "Our AI Chatbot starts at just $50/month! This includes 24/7 availability, multi-language support, calendar integration, and lead qualification. Would you like to know more about our pricing plans?"
    }
    
    if (message.includes('features') || message.includes('what can you do') || message.includes('capabilities')) {
      return "I can help with: 24/7 customer support, booking appointments directly into your calendar, qualifying leads automatically, speaking multiple languages, and providing product recommendations. I've helped businesses increase sales by 67%!"
    }
    
    if (message.includes('sales') || message.includes('increase') || message.includes('conversion')) {
      return "Great question! Businesses using our AI chatbot see a 67% increase in sales, 23% higher conversion rates, and 35% of consumers make purchases based on chatbot suggestions. I can help you achieve similar results!"
    }
    
    if (message.includes('demo') || message.includes('try') || message.includes('test')) {
      return "You're already experiencing our demo! I'm here to answer your questions and show you how our AI chatbot can help your business. What specific aspect would you like to know more about?"
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm excited to help you learn about our AI chatbot services. We can increase your sales by 67% and provide 24/7 customer support. What would you like to know?"
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! I can answer questions about our AI chatbot features, pricing ($50/month), how it increases sales by 67%, and how it works for different industries like restaurants, medical offices, real estate, and e-commerce. What would you like to know?"
    }
    
    return "That's interesting! Our AI chatbot can help your business in many ways - from increasing sales by 67% to providing 24/7 customer support. Would you like to know more about our features or pricing?"
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-200">
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
              background: 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
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
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center orange-glow">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6 font-display">
              AI Chatbot
            </h1>
          </motion.div>
          
          <div className="mb-6 relative z-10">
            <div className="text-3xl font-bold text-accent-500 mb-2">Starting at $50/month</div>
            <div className="text-lg text-gray-600">67% increase in sales reported after chatbot adoption</div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 relative z-10">
            Convert More Customers, 24/7 - Businesses with chatbots see a 67% increase in sales and 23% higher conversion rates. Your AI chatbot never sleeps, ensuring you capture every opportunity.
          </p>
        </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-center mb-2">
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800 font-display">
                  {metric.number}{metric.suffix}
                </div>
                <div className="text-sm text-gray-600 text-center">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI chatbot comes equipped with advanced capabilities to handle any customer interaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
              What it does for you:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
            >
              <div className="text-3xl font-bold text-accent-500 mb-2">67%</div>
              <p className="text-gray-600">increase in sales reported after chatbot adoption</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
            >
              <div className="text-3xl font-bold text-accent-500 mb-2">23%</div>
              <p className="text-gray-600">higher conversion rates on sites with chatbots</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
            >
              <div className="text-3xl font-bold text-accent-500 mb-2">35%</div>
              <p className="text-gray-600">of consumers make purchases based on chatbot suggestions</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
            >
              <div className="text-3xl font-bold text-accent-500 mb-2">30%</div>
              <p className="text-gray-600">cost savings in customer support by automating routine inquiries</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
            >
              <div className="text-3xl font-bold text-accent-500 mb-2">24/7</div>
              <p className="text-gray-600">availability means no missed opportunities - ever</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-150"
            >
              <div className="text-3xl font-bold text-accent-500 mb-2">∞</div>
              <p className="text-gray-600">Books appointments directly into your calendar</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Perfect for:
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Restaurants, Medical offices, Real estate, E-commerce and more
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-150 text-center"
                >
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto px-6 sm:px-8 py-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-display">
                Try Our Chatbot
              </h2>
              <p className="text-gray-600">
                Experience the power of our AI chatbot with a live demo
              </p>
            </div>

            {/* Chat Interface Demo */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-800">Koby AI Assistant</span>
                <span className="ml-auto text-sm text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                    <p className="text-sm">Hello! I'm Koby AI, your intelligent assistant. How can I help you today?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary-500 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">I'd like to know more about your AI services</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                    <p className="text-sm">Great! We offer AI suites for content generation, data analytics, sales optimization, and customer support. Which area interests you most?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChatbotOpen(true)}
                className="btn-primary"
              >
                Start Chatting Now
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Chatbot Interface */}
      {isChatbotOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col"
          >
            {/* Chatbot Header */}
            <div className="bg-accent-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Koby AI Assistant</h3>
                  <p className="text-sm text-accent-100">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-accent-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 max-w-xs px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-accent-500 text-white p-2 rounded-lg hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  )
}