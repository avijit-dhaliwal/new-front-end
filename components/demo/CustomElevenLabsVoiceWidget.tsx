'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Loader2, Activity } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface CustomElevenLabsVoiceWidgetProps {
  agentId: string
}

export default function CustomElevenLabsVoiceWidget({ agentId }: CustomElevenLabsVoiceWidgetProps) {
  const [isActive, setIsActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [messages, setMessages] = useState<Message[]>([])

  const websocketRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioQueueRef = useRef<Uint8Array[]>([])
  const isPlayingRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play audio from queue
  const playAudioFromQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current) {
      return
    }

    isPlayingRef.current = true
    setIsSpeaking(true)

    try {
      const audioData = audioQueueRef.current.shift()
      if (!audioData) {
        isPlayingRef.current = false
        setIsSpeaking(false)
        return
      }

      const buffer = audioData.buffer as ArrayBuffer
      const audioBuffer = await audioContextRef.current.decodeAudioData(buffer.slice(0))
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)

      source.onended = () => {
        isPlayingRef.current = false
        setIsSpeaking(false)
        // Play next in queue
        setTimeout(() => playAudioFromQueue(), 0)
      }

      if (!isMuted) {
        source.start(0)
      } else {
        isPlayingRef.current = false
        setIsSpeaking(false)
        // Clear queue if muted
        audioQueueRef.current = []
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      isPlayingRef.current = false
      setIsSpeaking(false)
    }
  }, [isMuted])

  // Connect to ElevenLabs WebSocket
  const connectToElevenLabs = useCallback(async () => {
    try {
      setIsConnecting(true)
      setConnectionStatus('connecting')
      setError(null)

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })
      streamRef.current = stream

      // Get signed URL from our API
      const signedUrlResponse = await fetch(`/api/elevenlabs-signed-url?agent_id=${agentId}`)
      if (!signedUrlResponse.ok) {
        const errorData = await signedUrlResponse.json()
        throw new Error(errorData.error || 'Failed to get signed URL')
      }
      const { signed_url } = await signedUrlResponse.json()

      // Create WebSocket connection with signed URL
      const ws = new WebSocket(signed_url)
      websocketRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setConnectionStatus('connected')
        setIsConnecting(false)
        setIsListening(true)

        // Start recording
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        })

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            // Convert blob to base64 and send
            event.data.arrayBuffer().then((buffer) => {
              const uint8Array = new Uint8Array(buffer)
              let binary = ''
              for (let i = 0; i < uint8Array.byteLength; i++) {
                binary += String.fromCharCode(uint8Array[i])
              }
              const base64 = btoa(binary)

              ws.send(JSON.stringify({
                user_audio_chunk: base64
              }))
            })
          }
        }

        // Send audio chunks every 250ms as recommended
        mediaRecorder.start(250)
        mediaRecorderRef.current = mediaRecorder
      }

      ws.onmessage = async (event) => {
        try {
          const response = JSON.parse(event.data)

          // Handle different message types
          if (response.type === 'conversation_initiation_metadata') {
            console.log('Conversation initiated:', response)
            addMessage('agent', 'Hello! How can I help you today?')
          } else if (response.type === 'audio' && response.audio_event) {
            // Received audio chunk from agent
            const audioData = response.audio_event.audio_base_64
            if (audioData) {
              const binaryString = atob(audioData)
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              audioQueueRef.current.push(bytes)
              playAudioFromQueue()
            }

            // Get event ID for continuation
            if (response.audio_event.event_id) {
              console.log('Audio event ID:', response.audio_event.event_id)
            }
          } else if (response.type === 'interruption') {
            console.log('Agent interrupted')
            // Clear audio queue on interruption
            audioQueueRef.current = []
            isPlayingRef.current = false
            setIsSpeaking(false)
          } else if (response.type === 'agent_response') {
            // Agent text response
            if (response.agent_response_text) {
              addMessage('agent', response.agent_response_text)
            }
          } else if (response.type === 'user_transcript') {
            // User speech transcript
            if (response.user_transcription) {
              addMessage('user', response.user_transcription)
            }
          } else if (response.type === 'error') {
            console.error('ElevenLabs error:', response)
            setError('An error occurred during the conversation')
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('Connection error. Please try again.')
        setConnectionStatus('disconnected')
        setIsConnecting(false)
      }

      ws.onclose = () => {
        console.log('WebSocket closed')
        setConnectionStatus('disconnected')
        setIsListening(false)
        cleanup()
      }
    } catch (error) {
      console.error('Error connecting:', error)
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access to use voice features.')
      } else {
        setError('Failed to connect. Please check your internet connection and try again.')
      }
      setIsConnecting(false)
      setConnectionStatus('disconnected')
    }
  }, [agentId, isMuted, playAudioFromQueue])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }

    audioQueueRef.current = []
    isPlayingRef.current = false
    setIsSpeaking(false)
    setIsListening(false)
  }, [])

  // Handle call toggle
  const toggleCall = useCallback(() => {
    if (isActive) {
      // End call
      cleanup()
      setIsActive(false)
      setMessages([])
    } else {
      // Start call
      setIsActive(true)
      connectToElevenLabs()
    }
  }, [isActive, cleanup, connectToElevenLabs])

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      // Muting - clear audio queue
      audioQueueRef.current = []
      isPlayingRef.current = false
      setIsSpeaking(false)
    }
  }, [isMuted])

  // Add message to conversation
  const addMessage = (sender: 'user' | 'agent', text: string) => {
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice Assistant</h2>
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
            disabled={isConnecting}
            size="lg"
            className={`w-24 h-24 rounded-full ${
              isActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } transition-all duration-300 disabled:opacity-50`}
          >
            {isConnecting ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : isActive ? (
              <PhoneOff className="w-10 h-10" />
            ) : (
              <Phone className="w-10 h-10" />
            )}
          </Button>

          {/* Pulsing animation when active */}
          {isActive && connectionStatus === 'connected' && (
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
            {isConnecting ? 'Connecting...' : isActive ? 'Call Active' : 'Start Call'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isConnecting
              ? 'Please wait...'
              : connectionStatus === 'connected'
              ? isListening && isSpeaking
                ? 'Agent speaking...'
                : isListening
                ? 'Listening...'
                : 'Ready'
              : 'Click to begin'}
          </p>
        </div>

        {/* Status Indicators */}
        {isActive && connectionStatus === 'connected' && (
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isListening && !isSpeaking ? 'text-green-600' : 'text-gray-400'}`}>
              {isListening && !isSpeaking ? (
                <>
                  <Mic className="w-5 h-5" />
                  <Activity className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <MicOff className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {isListening && !isSpeaking ? 'Listening' : 'Standby'}
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

        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-blue-600"
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-sm font-medium">Agent speaking...</span>
            <div className="flex space-x-1">
              <motion.div
                className="w-1.5 h-4 bg-blue-600 rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.div
                className="w-1.5 h-4 bg-blue-600 rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1.5 h-4 bg-blue-600 rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
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
          Powered by advanced voice AI technology. This assistant can answer questions about dental services,
          appointments, and general inquiries. Speak naturally as if you're calling the office.
        </p>
      </div>
    </motion.div>
  )
}
