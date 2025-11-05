'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Send, X, User, Bot, Loader2 } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBotProps {
  onClose: () => void
}

export default function GenericChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your dental office assistant. I can help you with questions about scheduling appointments, dental services, insurance, and general oral health information. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const context = `You are a professional, friendly receptionist for a modern dental practice. You help patients with:

      GENERAL PRACTICE INFORMATION
      - We are a full-service dental office providing comprehensive dental care
      - We offer both general and specialized dental services
      - Our practice uses modern technology and follows the latest dental care standards
      - We prioritize patient comfort and quality care

      SERVICES OFFERED
      - General Dentistry: Routine exams, cleanings, fillings, X-rays
      - Preventive Care: Fluoride treatments, sealants, oral cancer screenings
      - Restorative Dentistry: Crowns, bridges, dental implants, root canals
      - Cosmetic Dentistry: Teeth whitening, veneers, bonding
      - Orthodontics: Braces and clear aligners (like Invisalign)
      - Emergency Dental Care: Same-day appointments for dental emergencies
      - Periodontal Care: Gum disease treatment and prevention
      - Pediatric Dentistry: Gentle care for children and teens

      SCHEDULING AND APPOINTMENTS
      - We accept new patients and welcome families
      - Appointments can be scheduled by phone or through our website
      - We offer flexible scheduling including early morning and evening appointments
      - Emergency appointments are available for urgent dental issues
      - We send appointment reminders via text and email

      INSURANCE AND PAYMENT
      - We accept most major dental insurance plans
      - We offer flexible payment plans for procedures not covered by insurance
      - We can verify your insurance benefits before treatment
      - Payment options include cash, credit cards, and healthcare financing

      PATIENT CARE APPROACH
      - We provide personalized treatment plans tailored to each patient
      - We explain all procedures and costs before treatment
      - We use gentle techniques and offer sedation options for anxious patients
      - We focus on preventive care to maintain long-term oral health

      IMPORTANT NOTES FOR RESPONSES
      - This is a demonstration of AI-powered dental receptionist capabilities
      - For actual appointments or specific medical advice, patients should contact their real dental office
      - You can be fully customized to match any dental practice's specific services, policies, and branding
      - Keep responses helpful, professional, and conversational (2-4 sentences unless more detail is requested)

      Format your responses clearly:
      - Use proper paragraph breaks for readability
      - If listing items, use clear bullet points with "•"
      - Avoid asterisks (*) - use bullet points (•) instead
      - Keep formatting clean and professional

      User question: ${userMessage.content}`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyCkOO-3BM2UHyjAIMS9oYMhPOx8xzGGoIQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context
            }]
          }]
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get response')
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.candidates[0].content.parts[0].text,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error generating response:', error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm currently experiencing technical difficulties. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dental Office Assistant</h3>
            <p className="text-sm text-gray-500">AI-Powered Chat Demo</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-200 mr-2'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about appointments, services, insurance, or general dental questions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="lg"
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </motion.div>
  )
}
