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

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Pannu Dental assistant. I can help you with questions about dental services, appointments, oral health, and general inquiries. What would you like to know?",
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
      const context = `You are a professional receptionist and assistant for Pannu Dental Group. You help with:

      PRACTICE OVERVIEW
      Name: Pannu Dental Group
      Website: https://www.pannudental.com
      Description: A full-service Bay Area dental group providing advanced general, cosmetic, and implant dentistry.
      Tagline: San Jose's first and only robot-assisted implant surgery center.
      Technology: Uses the YOMI robotic system, the first and only FDA-cleared robotic device for dental implant surgery.
      Core Values: Precision, comfort, quality care, and advanced technology.

      LOCATIONS AND CONTACT INFORMATION
      Main Offices:
      - San Jose – Jackson Ave: 145 N Jackson Ave, Suite 101, San Jose, CA 95116 | Phone: (408) 272-3330
      - Sunnyvale: 1117 Tasman Dr, Sunnyvale, CA 94089 | Phone: (408) 752-0684
      - Fremont: 40880 Fremont Blvd, Fremont, CA 94538 | Phone: (510) 573-6083
      - Cupertino: Available via scheduling form on the website

      SERVICES OFFERED
      - General Dentistry: Exams, cleanings, fillings, X-rays
      - Restorative Dentistry: Crowns, bridges, re-implantation, inlays, and onlays
      - Cosmetic Dentistry: Veneers, Lumineers, whitening, bonding, CEREC crowns
      - Orthodontics: Invisalign and traditional braces
      - Dental Implants: Robotic implant placement using the YOMI system, including All-on-4 and full mouth restoration
      - Dentures: Immediate, partial, and implant-retained dentures
      - Periodontics and Endodontics: Root canals, laser gum therapy, treatment for bleeding gums and bad breath
      - Sleep Apnea: Evaluation and oral appliance therapy
      - Sedation Dentistry: For anxious patients and long procedures
      - Pediatric Dentistry: Gentle care for children

      ROBOT-ASSISTED IMPLANT SURGERY (YOMI)
      YOMI is the first FDA-cleared robotic dental surgery system. It allows minimally invasive, precise implant placement.
      Benefits include faster recovery, less pain, and greater accuracy.

      KEY SELLING POINTS
      - First and only robot-assisted implant center in San Jose
      - Comprehensive dental care under one roof
      - Multiple Bay Area locations for convenience
      - Sedation options and advanced technology
      - Trusted by thousands of Bay Area patients

      Respond in a professional, conversational tone. Keep responses concise but informative, typically 2-4 sentences unless more detail is specifically requested.

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
            <h3 className="text-lg font-semibold text-gray-900">Pannu Dental Chat Assistant</h3>
            <p className="text-sm text-gray-500">Dental AI Assistant</p>
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
              placeholder="Ask about dental services, appointments, oral health, or Pannu Dental..."
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
