'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, X, Volume2, VolumeX, Play, Square, Loader2 } from 'lucide-react'

interface VoiceBotProps {
  onClose: () => void
}

interface ConversationItem {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
  audioUrl?: string
}

export default function VoiceBot({ onClose }: VoiceBotProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [conversation, setConversation] = useState<ConversationItem[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hello! I'm your CHADIS voice assistant. I can help you with questions about pediatric health screening and patient care. You can speak to me naturally, and I'll respond with voice. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
            processVoiceInput(transcript)
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
      setCurrentTranscript('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  const processVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return

    const userMessage: ConversationItem = {
      id: Date.now().toString(),
      type: 'user',
      text: transcript.trim(),
      timestamp: new Date()
    }

    setConversation(prev => [...prev, userMessage])
    setCurrentTranscript('')
    setIsProcessing(true)

    try {
      // Step 1: Get AI response from Gemini via Cloudflare Worker
      const chatResponse = await fetch('https://chadis-chat.voidinfrastructuretechnologies.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcript.trim() }),
      })

      const chatData = await chatResponse.json()

      if (!chatResponse.ok) {
        throw new Error(chatData.error || 'Failed to get chat response')
      }

      const responseText = chatData.response

      const botMessage: ConversationItem = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: responseText,
        timestamp: new Date()
      }

      setConversation(prev => [...prev, botMessage])

      // Step 2: Convert response to speech using ElevenLabs and auto-play
      await synthesizeAndPlaySpeech(responseText)

    } catch (error) {
      console.error('Error processing voice input:', error)

      const errorMessage: ConversationItem = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: "I'm currently experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      }

      setConversation(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const synthesizeAndPlaySpeech = async (text: string) => {
    // Skip if muted
    if (isMuted) return

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
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()

    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error)
      setIsPlaying(false)
    }
  }

  const playLastBotMessage = () => {
    const lastBotMessage = [...conversation].reverse().find(item => item.type === 'bot')
    if (lastBotMessage) {
      synthesizeAndPlaySpeech(lastBotMessage.text)
    }
  }

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">CHADIS Voice Assistant</h3>
            <p className="text-sm text-gray-500">Healthcare AI Assistant</p>
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

      {/* Voice Interface */}
      <div className="p-6">
        {/* Voice Controls */}
        <div className="text-center mb-6">
          <div className="relative">
            <motion.div
              animate={{
                scale: isListening ? [1, 1.1, 1] : 1,
                backgroundColor: isListening ? ['#16a34a', '#22c55e', '#16a34a'] : '#16a34a'
              }}
              transition={{
                duration: isListening ? 1 : 0.3,
                repeat: isListening ? Infinity : 0
              }}
              className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4 cursor-pointer"
              onClick={isListening ? stopListening : startListening}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </motion.div>

            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -inset-4 rounded-full border-2 border-green-300 animate-ping"
              />
            )}
          </div>

          <p className="text-lg font-medium text-gray-900 mb-2">
            {isProcessing ? 'Processing your request...' :
             isListening ? 'Listening... (Click to stop)' :
             'Click to start speaking'}
          </p>

          {currentTranscript && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4"
            >
              "{currentTranscript}"
            </motion.p>
          )}

          {/* Audio Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={playLastBotMessage}
              disabled={isPlaying || conversation.filter(c => c.type === 'bot').length === 0}
            >
              {isPlaying ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Stop' : 'Replay Last Response'}
            </Button>
          </div>

          {/* Volume Control */}
          {!isMuted && (
            <div className="flex items-center justify-center space-x-3">
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

        {/* Voice Interaction Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Voice Interaction Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Questions Asked:</span>
              <span className="font-medium">{conversation.filter(c => c.type === 'user').length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Responses Given:</span>
              <span className="font-medium">{conversation.filter(c => c.type === 'bot').length}</span>
            </div>
            {conversation.length > 1 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last interaction: {conversation[conversation.length - 1]?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  )
}