'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Clock, CheckCircle, ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

const timeSlots = [
  { time: '9:00 AM', available: true },
  { time: '9:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: false },
  { time: '1:00 PM', available: true },
  { time: '1:30 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '2:30 PM', available: false },
  { time: '3:00 PM', available: true },
  { time: '3:30 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '4:30 PM', available: true },
  { time: '5:00 PM', available: false }
]

const meetingTypes = [
  {
    id: 'setup',
    name: 'Setup & Configuration',
    duration: '60 minutes',
    description: 'Initial setup and configuration of your AI solution'
  },
  {
    id: 'custom',
    name: 'Custom Consultation',
    duration: '120 minutes',
    description: 'Custom consultation for specific business needs'
  }
]

export default function ScheduleMeetingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !selectedMeetingType) return
    
    setIsScheduling(true)
    
    // Simulate scheduling process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsScheduling(false)
    setIsScheduled(true)
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Get first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()
    
    // Create calendar grid (6 weeks x 7 days = 42 days)
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day)
      days.push(date)
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day)
      days.push(date)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (isScheduled) {
    return (
      <main className="min-h-screen bg-gray-50">
        <AnimatedBackground />
        <NavBar />
        
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4 font-display">
                Meeting Scheduled Successfully!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Your meeting has been scheduled. We'll send you a confirmation email with all the details and a calendar invite.
              </p>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Meeting Details</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-accent-500 mr-3" />
                    <span className="text-gray-700">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-accent-500 mr-3" />
                    <span className="text-gray-700">{selectedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-accent-500 mr-3" />
                    <span className="text-gray-700">
                      {meetingTypes.find(type => type.id === selectedMeetingType)?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-150">
                  Back to Home
                </Link>
                <Link href="/get-started" className="bg-white text-accent-600 px-8 py-3 rounded-xl font-semibold border-2 border-accent-500 hover:bg-accent-50 transition-all duration-150">
                  View Plans
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
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
          <Link href="/checkout" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </Link>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-display">
              Schedule Your Personal Meeting
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's work directly with you and your team to set up everything perfectly for your business needs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Meeting Type Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-accent-500" />
                  Meeting Type
                </h2>
                <div className="space-y-3">
                  {meetingTypes.map((type) => (
                    <label key={type.id} className="relative">
                      <input
                        type="radio"
                        name="meetingType"
                        value={type.id}
                        checked={selectedMeetingType === type.id}
                        onChange={(e) => setSelectedMeetingType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedMeetingType === type.id 
                          ? 'border-accent-500 bg-accent-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-800">{type.name}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                          <span className="text-sm font-medium text-gray-500">{type.duration}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent-500" />
                  Select Date
                </h2>
                
                {/* Calendar Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                </div>
                
                {/* Calendar Grid */}
                <div className="space-y-2">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={index} className="h-10"></div>
                      }
                      
                      const isToday = date.toDateString() === today.toDateString()
                      const isSelected = selectedDate?.toDateString() === date.toDateString()
                      const isPast = date < today && !isToday
                      const isCurrentMonth = date.getMonth() === currentMonth
                      
                      return (
                        <button
                          key={index}
                          onClick={() => !isPast && setSelectedDate(date)}
                          disabled={isPast}
                          className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-accent-500 text-white'
                              : isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : isCurrentMonth
                              ? 'text-gray-700 hover:bg-gray-100'
                              : 'text-gray-400 hover:bg-gray-50'
                          } ${isToday && !isSelected ? 'ring-2 ring-accent-300' : ''}`}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-accent-500" />
                  Select Time
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                        selectedTime === slot.time
                          ? 'border-accent-500 bg-accent-50 text-accent-700'
                          : slot.available
                          ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Any specific requirements or questions for the meeting..."
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Button */}
              <motion.button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime || !selectedMeetingType || isScheduling}
                whileHover={{ scale: isScheduling ? 1 : 1.02 }}
                whileTap={{ scale: isScheduling ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-150 flex items-center justify-center ${
                  !selectedDate || !selectedTime || !selectedMeetingType || isScheduling
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:shadow-lg'
                }`}
              >
                {isScheduling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scheduling Meeting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Meeting
                  </>
                )}
              </motion.button>

              {/* Meeting Summary */}
              {selectedDate && selectedTime && selectedMeetingType && (
                <div className="bg-accent-50 rounded-xl p-6 border border-accent-200">
                  <h3 className="font-semibold text-accent-800 mb-3">Meeting Summary</h3>
                  <div className="space-y-2 text-sm text-accent-700">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedTime}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {meetingTypes.find(type => type.id === selectedMeetingType)?.name}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
