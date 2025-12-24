'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, CreditCard, Lock, CheckCircle, Shield, User, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const plans = [
  {
    id: 'ai-chatbot',
    name: "AI Chatbot",
    description: "Perfect for customer support and lead generation",
    price: 50,
    period: "month",
    features: [
      "24/7 AI chatbot availability",
      "Multi-language support", 
      "Calendar integration",
      "Lead qualification",
      "67% increase in sales",
      "Email support"
    ],
    icon: ""
  },
  {
    id: 'ai-phone-service',
    name: "AI Phone Service", 
    description: "Professional AI virtual receptionist",
    price: 400,
    period: "month",
    features: [
      "Unlimited calls handled",
      "24/7 availability",
      "Custom greeting setup", 
      "Calendar integration",
      "Instant message delivery",
      "Multi-call handling"
    ],
    icon: ""
  },
  {
    id: 'bundle-pack',
    name: "Bundle Pack",
    description: "AI Chatbot + Phone Service combined",
    price: 425,
    period: "month",
    features: [
      "Everything in AI Chatbot",
      "Everything in Phone Service", 
      "Unified dashboard",
      "Priority support",
      "Save $25/month",
      "Best value option"
    ],
    icon: ""
  },
  {
    id: 'custom-ai-suite',
    name: "Custom AI Suite",
    description: "Tailored solutions for your industry",
    price: "Custom",
    period: "consultation",
    features: [
      "Industry-specific features",
      "Custom integrations",
      "Dedicated support",
      "Flexible pricing",
      "White-label options",
      "Requires consultation"
    ],
    icon: ""
  }
]

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('ai-chatbot')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
    console.log('Payment data:', { selectedPlan, formData })
    
    setIsProcessing(false)
    // Redirect to scheduling page
    window.location.href = '/schedule-meeting'
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-8 relative overflow-hidden noise-overlay">
        {/* Background */}
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
            <Link href="/get-started" className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-2 font-display tracking-tight">Complete Your Purchase</h1>
            <p className="text-[var(--ink-muted)]">Secure checkout powered by industry-leading encryption</p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plan Selection */}
                <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                  <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[var(--accent)]" />
                    Select Your Plan
                  </h2>
                  <div className="grid gap-4">
                    {plans.map((plan) => (
                      <label key={plan.id} className="relative">
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={selectedPlan === plan.id}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-lg border-2 cursor-pointer ${
                          selectedPlan === plan.id
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                            : 'border-[var(--line)] hover:border-[var(--ink-muted)]'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h3 className="font-semibold text-[var(--ink)]">{plan.name}</h3>
                                <p className="text-sm text-[var(--ink-muted)]">{plan.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {plan.price === "Custom" ? (
                                <span className="text-lg font-bold text-[var(--ink)]">Custom</span>
                              ) : (
                                <span className="text-lg font-bold text-[var(--ink)]">${plan.price}<span className="text-sm font-normal text-[var(--ink-muted)]">/{plan.period}</span></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                  <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-[var(--accent)]" />
                    Contact Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
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
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                  <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[var(--accent)]" />
                    Billing Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--ink)] mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--ink)] mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--ink)] mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                  <h2 className="text-xl font-semibold text-[var(--ink)] mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[var(--accent)]" />
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--ink)] mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--ink)] mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)] placeholder-[var(--ink-muted)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--ink)] mb-2">Name on Card *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--paper-muted)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--ink)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full btn-primary ${
                    isProcessing
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="sticky top-24">
                <div className="bg-[var(--panel)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--line)]">
                  <h2 className="text-xl font-semibold text-[var(--ink)] mb-6">Order Summary</h2>
                  
                  {selectedPlanData && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-[var(--paper-muted)] rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--ink)]">{selectedPlanData.name}</h3>
                          <p className="text-sm text-[var(--ink-muted)]">{selectedPlanData.description}</p>
                        </div>
                        <div className="text-right">
                          {selectedPlanData.price === "Custom" ? (
                            <span className="text-lg font-bold text-[var(--ink)]">Custom</span>
                          ) : (
                            <span className="text-lg font-bold text-[var(--ink)]">${selectedPlanData.price}<span className="text-sm font-normal text-[var(--ink-muted)]">/{selectedPlanData.period}</span></span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-[var(--ink)]">What's included:</h4>
                        <ul className="space-y-1">
                          {selectedPlanData.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-[var(--ink-muted)]">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-[var(--line)] pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold text-[var(--ink)]">
                          <span>Total</span>
                          <span>
                            {selectedPlanData.price === "Custom" ? "Contact for Pricing" : `$${selectedPlanData.price}/${selectedPlanData.period}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Features */}
                <div className="mt-6 bg-[var(--accent-soft)] rounded-3xl p-6 border border-[var(--line)]">
                  <h3 className="font-semibold text-[var(--ink)] mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-[var(--accent)]" />
                    Secure Checkout
                  </h3>
                  <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
                      256-bit SSL encryption
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
                      PCI DSS compliant
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
                      No card data stored
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
                      Money-back guarantee
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
