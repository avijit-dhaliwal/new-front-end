'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import ChatBot from '@/components/chadis/ChatBot'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Loader2, Heart, Brain, Shield, Users, X } from 'lucide-react'

interface VoiceMessage {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
  isVoice?: boolean
}

export default function ChadisDemo() {
  const [showVoiceChat, setShowVoiceChat] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      disconnectVoiceChat()
    }
  }, [])

  const startVoiceChat = async () => {
    setShowVoiceChat(true)
    await connectToElevenLabs()
  }

  const connectToElevenLabs = async () => {
    try {
      setConnectionStatus('connecting')

      // Get user media for microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      })

      streamRef.current = stream

      // Initialize audio context for better audio handling
      audioContextRef.current = new AudioContext({ sampleRate: 16000 })

      setConnectionStatus('connected')
      setIsConnected(true)
      setIsListening(true)
      setConversationId('active') // Simple conversation state

      // Start continuous voice recognition
      startContinuousListening()

      // Play welcome message
      await synthesizeAndPlaySpeech('Hello! I\'m your CHADIS healthcare assistant. How can I help you today?')

    } catch (error) {
      console.error('Error connecting to voice services:', error)
      setConnectionStatus('disconnected')
    }
  }

  const startContinuousListening = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim()
        if (transcript) {
          await processVoiceInput(transcript)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        // Restart recognition on error
        setTimeout(() => {
          if (connectionStatus === 'connected') {
            recognition.start()
          }
        }, 1000)
      }

      recognition.onend = () => {
        // Automatically restart recognition for continuous listening
        if (connectionStatus === 'connected') {
          setTimeout(() => {
            recognition.start()
          }, 100)
        }
      }

      recognition.start()
      recognitionRef.current = recognition
    }
  }

  const processVoiceInput = async (transcript: string) => {
    if (!transcript || isSpeaking || !conversationId) return

    setIsListening(false)
    setIsSpeaking(true)

    try {
      // Get AI response from Gemini (enhanced for healthcare context)
      const chatResponse = await fetch('https://chadis-chat.voidinfrastructuretechnologies.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcript }),
      })

      const chatData = await chatResponse.json()

      if (chatResponse.ok) {
        // Convert response to speech using ElevenLabs premium voice
        await synthesizeAndPlaySpeech(chatData.response)
      }

    } catch (error) {
      console.error('Error processing voice input:', error)
    } finally {
      setIsSpeaking(false)
      setIsListening(true)
    }
  }

  const synthesizeAndPlaySpeech = async (text: string) => {
    if (isMuted) return

    try {
      // Use ElevenLabs API via our working Cloudflare Worker
      const voiceResponse = await fetch('https://chadis-voice-test.voidinfrastructuretechnologies.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const voiceData = await voiceResponse.json()

      if (voiceResponse.ok && voiceData.audioBase64) {
        // Convert base64 audio to blob and play
        const audioBlob = new Blob([
          Uint8Array.from(atob(voiceData.audioBase64), c => c.charCodeAt(0))
        ], { type: voiceData.mimeType })

        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.volume = volume

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
      } else {
        throw new Error('ElevenLabs TTS failed')
      }

    } catch (error) {
      console.error('Error with ElevenLabs voice synthesis:', error)
    }
  }

  const disconnectVoiceChat = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setConnectionStatus('disconnected')
    setIsConnected(false)
    setIsListening(false)
    setIsSpeaking(false)
    setConversationId(null)
  }

  const closeVoiceChat = () => {
    disconnectVoiceChat()
    setShowVoiceChat(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NavBar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              CHADIS AI Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced AI for pediatric healthcare screening and patient engagement.
              Start a conversation to experience intelligent clinical support.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <Heart className="w-8 h-8 text-red-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Health Screening</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <Brain className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">AI Insights</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">HIPAA Compliant</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <Users className="w-8 h-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Patient Engagement</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Chat Bot */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ChatBot onClose={() => {}} />
              </motion.div>
            </div>

            {/* Right Side - Information + Voice Chat Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Voice Chat Button */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 shadow-lg cursor-pointer"
                  onClick={startVoiceChat}
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-8 h-8 text-blue-600" />
                    </div>
                    {isConnected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Voice Assistant</h3>
                  <p className="text-blue-100 text-sm">
                    Tap to start voice conversation
                  </p>
                </motion.div>
              </div>

              {/* About Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About CHADIS</h3>
                <p className="text-gray-600 mb-4">
                  CHADIS (Child Health and Development Interactive System) automates over 1,000
                  screening and diagnostic questionnaires, providing tailored decision support
                  for clinicians and educational resources for families.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Automated questionnaire management and scoring</li>
                  <li>• Early identification of ADHD, depression, and anxiety</li>
                  <li>• 90% renewal rate with 10-20X ROI for practices</li>
                  <li>• Serves 15% of primary care pediatric market</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Voice Chat Popup */}
      <AnimatePresence>
        {showVoiceChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
            >
              {/* Voice Chat Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: connectionStatus === 'connecting' ? [1, 1.1, 1] :
                                isListening ? [1, 1.1, 1] :
                                isSpeaking ? [1, 1.05, 1] : 1,
                          backgroundColor: connectionStatus === 'connecting' ? ['#f59e0b', '#f97316', '#f59e0b'] :
                                         isListening ? ['#3b82f6', '#10b981', '#3b82f6'] :
                                         isSpeaking ? ['#10b981', '#06b6d4', '#10b981'] : '#3b82f6'
                        }}
                        transition={{
                          duration: connectionStatus === 'connecting' || isListening || isSpeaking ? 1.5 : 0.3,
                          repeat: connectionStatus === 'connecting' || isListening || isSpeaking ? Infinity : 0
                        }}
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                      >
                        {connectionStatus === 'connecting' ? (
                          <Loader2 className="w-10 h-10 text-white animate-spin" />
                        ) : isListening ? (
                          <Mic className="w-10 h-10 text-white" />
                        ) : isSpeaking ? (
                          <Volume2 className="w-10 h-10 text-white" />
                        ) : (
                          <Phone className="w-10 h-10 text-white" />
                        )}
                      </motion.div>
                      {isConnected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">CHADIS Healthcare AI</h3>
                      <p className="text-sm text-slate-400">
                        {connectionStatus === 'connecting' ? 'Connecting...' :
                         connectionStatus === 'connected' && isListening ? 'Listening to you...' :
                         connectionStatus === 'connected' && isSpeaking ? 'Speaking...' :
                         connectionStatus === 'connected' ? 'Ready for conversation' :
                         'Disconnected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeVoiceChat}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Main Voice Interface - No Text */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: isListening ? [1, 1.1, 1] : isSpeaking ? [1, 1.05, 1] : 1,
                      boxShadow: isListening ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0.7)'] :
                                isSpeaking ? ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 10px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0.7)'] :
                                '0 0 0 0 rgba(59, 130, 246, 0)'
                    }}
                    transition={{
                      duration: isListening || isSpeaking ? 2 : 0.3,
                      repeat: isListening || isSpeaking ? Infinity : 0
                    }}
                    className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mb-6 mx-auto"
                  >
                    {connectionStatus === 'connecting' ? (
                      <Loader2 className="w-16 h-16 text-white animate-spin" />
                    ) : isListening ? (
                      <Mic className="w-16 h-16 text-white" />
                    ) : isSpeaking ? (
                      <Volume2 className="w-16 h-16 text-white" />
                    ) : (
                      <Phone className="w-16 h-16 text-white" />
                    )}
                  </motion.div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {connectionStatus === 'connecting' ? 'Connecting to Healthcare AI...' :
                     connectionStatus === 'connected' && isListening ? 'I\'m listening' :
                     connectionStatus === 'connected' && isSpeaking ? 'Speaking...' :
                     connectionStatus === 'connected' ? 'Voice conversation active' :
                     'Connection lost'}
                  </h3>

                  <p className="text-slate-400 text-sm mb-6">
                    {connectionStatus === 'connected' ? 'Speak naturally - I\'ll respond with voice' :
                     connectionStatus === 'connecting' ? 'Setting up voice connection...' :
                     'Tap to reconnect'}
                  </p>

                  {connectionStatus === 'disconnected' && (
                    <Button
                      onClick={connectToElevenLabs}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Reconnect
                    </Button>
                  )}
                </div>
              </div>

              {/* Voice Controls */}
              <div className="p-6 border-t border-slate-700">
                <div className="flex items-center justify-center space-x-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-white w-12 h-12"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>

                  {connectionStatus === 'connected' && (
                    <Button
                      onClick={disconnectVoiceChat}
                      className="bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full"
                    >
                      <PhoneOff className="w-6 h-6 text-white" />
                    </Button>
                  )}

                  {!isMuted && (
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 accent-blue-500"
                      />
                      <span className="text-xs text-slate-400">{Math.round(volume * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}