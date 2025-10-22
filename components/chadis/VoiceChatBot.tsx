'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, MicOff, X, Volume2, VolumeX, Send, Loader2, Phone, PhoneOff } from 'lucide-react'

interface VoiceChatBotProps {
  onClose: () => void
}

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
  isVoice?: boolean
}

export default function VoiceChatBot({ onClose }: VoiceChatBotProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hello! I'm your CHADIS healthcare assistant. You can type or speak to me naturally, and I'll respond with voice like a real conversation. How can I help you today?",
      timestamp: new Date(),
      isVoice: false
    }
  ])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [textInput, setTextInput] = useState('')
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event) => {
          let transcript = ''
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setCurrentTranscript(transcript)

          // If we have a final result, process it
          if (event.results[event.results.length - 1].isFinal) {
            processInput(transcript, true)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setIsConnected(true)
      setCurrentTranscript('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      setIsConnected(false)
      recognitionRef.current.stop()
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      processInput(textInput.trim(), false)
      setTextInput('')
    }
  }

  const processInput = async (input: string, isVoice: boolean) => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date(),
      isVoice
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentTranscript('')
    setIsProcessing(true)

    try {
      // Get AI response from Gemini via Cloudflare Worker
      const chatResponse = await fetch('https://chadis-chat.voidinfrastructuretechnologies.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      const chatData = await chatResponse.json()

      if (!chatResponse.ok) {
        throw new Error(chatData.error || 'Failed to get chat response')
      }

      const responseText = chatData.response

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: responseText,
        timestamp: new Date(),
        isVoice: true
      }

      setMessages(prev => [...prev, botMessage])

      // Always convert response to speech for conversational experience
      if (!isMuted) {
        await synthesizeAndPlaySpeech(responseText)
      }

    } catch (error) {
      console.error('Error processing input:', error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: "I'm currently experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        isVoice: false
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const synthesizeAndPlaySpeech = async (text: string) => {
    try {
      setIsPlaying(true)

      // Call ElevenLabs API via Cloudflare Worker
      const voiceResponse = await fetch('https://chadis-voice-test.voidinfrastructuretechnologies.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const voiceData = await voiceResponse.json()

      if (!voiceResponse.ok) {
        throw new Error(voiceData.error || 'Failed to generate speech')
      }

      // Convert base64 audio to blob and play
      const audioBlob = new Blob([
        Uint8Array.from(atob(voiceData.audioBase64), c => c.charCodeAt(0))
      ], { type: voiceData.mimeType })

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.volume = volume

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        setAudioLevel(0)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        setAudioLevel(0)
        URL.revokeObjectURL(audioUrl)
      }

      // Simulate audio level for visual feedback
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)

      audio.onended = () => {
        clearInterval(interval)
        setIsPlaying(false)
        setAudioLevel(0)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()

    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error)
      setIsPlaying(false)
      setAudioLevel(0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl mx-auto h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">CHADIS Voice Assistant</h3>
            <p className="text-sm text-gray-500">
              {isConnected ? '🟢 Connected' : isPlaying ? '🔊 Speaking' : '⚪ Ready'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-br-md p-4'
                  : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md p-4'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.isVoice && message.type === 'user' && (
                    <Mic className="w-4 h-4 mt-0.5 opacity-70" />
                  )}
                  {message.type === 'bot' && (
                    <div className="w-4 h-4 mt-0.5">
                      {isPlaying && message.id === messages[messages.length - 1]?.id ? (
                        <div className="flex items-center space-x-0.5">
                          <div className="w-1 h-3 bg-green-500 rounded animate-pulse"></div>
                          <div className="w-1 h-2 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl rounded-bl-md p-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status */}
      {(isListening || currentTranscript) && (
        <div className="px-6 py-2 border-t border-gray-100 bg-blue-50">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
            >
              <Mic className="w-4 h-4 text-white" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                {isListening ? 'Listening...' : 'Voice input received'}
              </p>
              {currentTranscript && (
                <p className="text-sm text-blue-700">"{currentTranscript}"</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleTextSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message or hold to speak..."
              className="pr-12 py-3 text-sm"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              disabled={!textInput.trim() || isProcessing}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <Button
            type="button"
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onMouseLeave={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            className={`w-12 h-12 rounded-full transition-all ${
              isListening
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={isProcessing}
          >
            {isListening ? (
              <PhoneOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </Button>
        </form>

        {!isMuted && (
          <div className="flex items-center justify-center space-x-3 mt-3">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-500">{Math.round(volume * 100)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}