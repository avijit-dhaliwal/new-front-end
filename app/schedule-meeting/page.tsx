'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Clock, CheckCircle, ArrowLeft, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
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
      <main className="min-h-screen bg-[var(--paper)]">
        <NavBar />

        <section className="pt-28 lg:pt-36 pb-16 relative overflow-hidden noise-overlay">
          <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
          <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[var(--accent)]" />
              </div>

              <h1 className="text-4xl font-bold text-[var(--ink)] mb-4 font-display tracking-tight">
                Meeting Scheduled Successfully!
              </h1>

              <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-2xl mx-auto">
                Your meeting has been scheduled. We'll send you a confirmation email with all the details and a calendar invite.
              </p>

              <div className="bg-[var(--panel)] rounded-3xl p-8 shadow-[var(--shadow-soft)] border border-[var(--line)] mb-8">
                <h2 className="text-2xl font-semibold text-[var(--ink)] mb-6 font-display">Meeting Details</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-[var(--accent)] mr-3" />
                    <span className="text-[var(--ink-muted)]">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[var(--accent)] mr-3" />
                    <span className="text-[var(--ink-muted)]">{selectedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-[var(--accent)] mr-3" />
                    <span className="text-[var(--ink-muted)]">
                      {meetingTypes.find(type => type.id === selectedMeetingType)?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary">
                  Back to Home
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/portal" className="btn-secondary">
                  Access Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-8 relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 paper-texture fine-grid opacity-[0.55]" />
        <div className="absolute -top-28 right-[-5%] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              Schedule Meeting
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-4 font-display tracking-tight">
              Schedule Your Personal Meeting
            </h1>
            <p className="text-lg text-[var(--ink-muted)]">
              Let's work directly with you and your team to set up everything perfectly for your business needs.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Meeting Type Selection */}
              <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center font-display">
                  <User className="w-5 h-5 mr-2 text-[var(--accent)]" />
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
                      <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedMeetingType === type.id
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--line)] hover:border-[var(--ink-muted)]'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-[var(--ink)]">{type.name}</h3>
                            <p className="text-sm text-[var(--ink-muted)]">{type.description}</p>
                          </div>
                          <span className="text-sm font-medium text-[var(--ink-muted)]">{type.duration}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center font-display">
                  <Calendar className="w-5 h-5 mr-2 text-[var(--accent)]" />
                  Select Date
                </h2>
                
                {/* Calendar Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                </div>
                
                {/* Calendar Grid */}
                <div className="space-y-2">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-[var(--ink-muted)] py-2">
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
                              ? 'bg-[var(--accent)] text-white'
                              : isPast
                              ? 'text-[var(--line)] cursor-not-allowed'
                              : isCurrentMonth
                              ? 'text-[var(--ink)] hover:bg-[var(--paper-muted)]'
                              : 'text-[var(--ink-muted)] hover:bg-[var(--paper-muted)]'
                          } ${isToday && !isSelected ? 'ring-2 ring-[var(--accent-soft)]' : ''}`}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center font-display">
                  <Clock className="w-5 h-5 mr-2 text-[var(--accent)]" />
                  Select Time
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition-all duration-200 ${
                        selectedTime === slot.time
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                          : slot.available
                          ? 'border-[var(--line)] hover:border-[var(--ink-muted)] text-[var(--ink)]'
                          : 'border-[var(--line)] bg-[var(--paper-muted)] text-[var(--line)] cursor-not-allowed'
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                <h2 className="text-xl font-semibold text-[var(--ink)] mb-6 font-display">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink)] mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink)] mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink)] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink)] mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink)] mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)] resize-none"
                      placeholder="Any specific requirements or questions for the meeting..."
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Button */}
              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime || !selectedMeetingType || isScheduling}
                className={`w-full btn-primary ${
                  !selectedDate || !selectedTime || !selectedMeetingType || isScheduling
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
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
              </button>

              {/* Meeting Summary */}
              {selectedDate && selectedTime && selectedMeetingType && (
                <div className="bg-[var(--accent-soft)] rounded-3xl p-6 border border-[var(--line)]">
                  <h3 className="font-semibold text-[var(--ink)] mb-3">Meeting Summary</h3>
                  <div className="space-y-2 text-sm text-[var(--ink-muted)]">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[var(--accent)]" />
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[var(--accent)]" />
                      {selectedTime}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-[var(--accent)]" />
                      {meetingTypes.find(type => type.id === selectedMeetingType)?.name}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

      <Footer />
    </main>
  )
}
