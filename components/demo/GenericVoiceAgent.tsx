'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export default function GenericVoiceAgent() {
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis

      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setTranscript(finalTranscript.trim())
            handleUserSpeech(finalTranscript.trim())
          } else {
            setTranscript(interimTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'not-allowed') {
            setError('Microphone access denied. Please allow microphone access to use voice features.')
          } else if (event.error === 'no-speech') {
            // Restart recognition if no speech detected
            if (isActive && recognitionRef.current) {
              recognitionRef.current.start()
            }
          }
        }

        recognitionRef.current.onend = () => {
          // Restart recognition if still active
          if (isActive && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              console.error('Error restarting recognition:', e)
            }
          }
        }
      } else {
        setError('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.')
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        // Welcome message
        speakText("Hello! I'm your dental office assistant. How can I help you today?")
      } catch (e) {
        console.error('Error starting recognition:', e)
      }
    } else if (!isActive && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [isActive])

  const handleUserSpeech = async (text: string) => {
    if (!text.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)
    setTranscript('')

    // Temporarily stop listening while processing
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    try {
      const context = `You are a professional, friendly dental office receptionist speaking with a patient over the phone. Keep your responses conversational, natural, and concise (1-3 sentences max for most responses).

      PRACTICE INFORMATION
      - We are a modern dental practice offering comprehensive dental care
      - We provide general dentistry, cosmetic procedures, orthodontics, and emergency care
      - We accept most insurance plans and offer flexible payment options
      - New patients are welcome, and we offer same-day emergency appointments

      SERVICES
      - Routine cleanings, exams, and preventive care
      - Fillings, crowns, bridges, and root canals
      - Teeth whitening, veneers, and cosmetic dentistry
      - Braces and clear aligners
      - Dental implants and dentures
      - Emergency dental care

      SCHEDULING
      - We have morning, afternoon, and evening appointments available
      - New patient exams typically take about an hour
      - We send reminders via text and email
      - Emergency patients can often be seen the same day

      IMPORTANT
      - This is a demonstration of AI voice assistant capabilities
      - Speak naturally and conversationally as if on a phone call
      - Be helpful and professional but keep responses brief
      - For actual appointments, direct patients to contact their real dental office
      - This system can be fully customized for any dental practice

      Patient said: ${text}

      Respond naturally and conversationally:`;

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

      const agentText = data.candidates[0].content.parts[0].text

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: agentText,
        sender: 'agent',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])

      // Speak the response
      if (!isMuted) {
        speakText(agentText)
      }

    } catch (error) {
      console.error('Error processing speech:', error)
      const errorText = "I'm sorry, I'm having trouble processing that. Could you please repeat?"

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'agent',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])

      if (!isMuted) {
        speakText(errorText)
      }
    } finally {
      setIsProcessing(false)

      // Resume listening after response is spoken
      setTimeout(() => {
        if (isActive && recognitionRef.current && !isSpeaking) {
          try {
            recognitionRef.current.start()
            setIsListening(true)
          } catch (e) {
            console.error('Error restarting recognition:', e)
          }
        }
      }, 500)
    }
  }

  const speakText = (text: string) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to use a natural-sounding voice
    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Google') ||
      voice.name.includes('Natural') ||
      voice.name.includes('Enhanced') ||
      voice.lang.startsWith('en')
    )

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
      }
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      // Resume listening after speaking
      if (isActive && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start()
            setIsListening(true)
          } catch (e) {
            console.error('Error restarting recognition after speech:', e)
          }
        }, 300)
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setIsSpeaking(false)
    }

    utteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }

  const toggleCall = () => {
    setIsActive(!isActive)
    setMessages([])
    setTranscript('')
    setError(null)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (synthRef.current && isMuted === false) {
      synthRef.current.cancel()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice Assistant Demo</h2>
        <p className="text-gray-600">Click the button below to start a voice conversation</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        {/* Main Call Button */}
        <div className="relative">
          <Button
            onClick={toggleCall}
            size="lg"
            className={`w-24 h-24 rounded-full ${
              isActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } transition-all duration-300`}
          >
            {isActive ? (
              <PhoneOff className="w-10 h-10" />
            ) : (
              <Phone className="w-10 h-10" />
            )}
          </Button>

          {/* Pulsing animation when active */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full bg-green-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {isActive ? 'Call Active' : 'Start Call'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isActive
              ? isListening
                ? 'Listening...'
                : isSpeaking
                ? 'Speaking...'
                : isProcessing
                ? 'Processing...'
                : 'Ready'
              : 'Click to begin'}
          </p>
        </div>

        {/* Status Indicators */}
        {isActive && (
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span className="text-sm font-medium">
                {isListening ? 'Mic On' : 'Mic Off'}
              </span>
            </div>

            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>
          </div>
        )}

        {/* Live Transcript */}
        {isActive && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-900">
              <span className="font-semibold">You're saying: </span>
              {transcript}
            </p>
          </motion.div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-600"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing your request...</span>
          </motion.div>
        )}

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="w-full max-h-64 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Conversation:</h3>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Information Footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          This is a demonstration of AI-powered voice assistant capabilities. The system uses your browser's built-in speech recognition and synthesis.
          This technology can be fully customized to match your practice's specific needs, services, and branding.
        </p>
      </div>
    </motion.div>
  )
}
