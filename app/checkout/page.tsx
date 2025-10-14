'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, CreditCard, Lock, CheckCircle, Shield, User, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
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
  const [sameAsBilling, setSameAsBilling] = useState(true)

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
          <Link href="/get-started" className="inline-flex items-center text-gray-600 hover:text-accent-500 transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </Link>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 font-display">Complete Your Purchase</h1>
                <p className="text-gray-600">Secure checkout powered by industry-leading encryption</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Plan Selection */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-accent-500" />
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
                        <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.id 
                            ? 'border-accent-500 bg-accent-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                                <p className="text-sm text-gray-600">{plan.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {plan.price === "Custom" ? (
                                <span className="text-lg font-bold text-gray-800">Custom</span>
                              ) : (
                                <span className="text-lg font-bold text-gray-800">${plan.price}<span className="text-sm font-normal text-gray-500">/{plan.period}</span></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-accent-500" />
                    Contact Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-accent-500" />
                    Billing Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
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
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-accent-500" />
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-150 flex items-center justify-center ${
                    isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:shadow-lg'
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
                </motion.button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="sticky top-24">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                  
                  {selectedPlanData && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{selectedPlanData.name}</h3>
                          <p className="text-sm text-gray-600">{selectedPlanData.description}</p>
                        </div>
                        <div className="text-right">
                          {selectedPlanData.price === "Custom" ? (
                            <span className="text-lg font-bold text-gray-800">Custom</span>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">${selectedPlanData.price}<span className="text-sm font-normal text-gray-500">/{selectedPlanData.period}</span></span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">What's included:</h4>
                        <ul className="space-y-1">
                          {selectedPlanData.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
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
                <div className="mt-6 bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Secure Checkout
                  </h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      256-bit SSL encryption
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      PCI DSS compliant
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      No card data stored
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      Money-back guarantee
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
