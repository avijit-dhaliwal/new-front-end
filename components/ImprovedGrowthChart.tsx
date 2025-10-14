'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Users, DollarSign } from 'lucide-react'

const growthData = [
  { month: "Jan", users: 35000, revenue: 120000, growth: 5.2 },
  { month: "Feb", users: 38000, revenue: 135000, growth: 8.6 },
  { month: "Mar", users: 42000, revenue: 150000, growth: 10.5 },
  { month: "Apr", users: 45000, revenue: 165000, growth: 7.1 },
  { month: "May", users: 48000, revenue: 180000, growth: 9.1 },
  { month: "Jun", users: 50000, revenue: 195000, growth: 8.3 }
]

// Calculate proper scale for better visibility
const maxUsers = Math.max(...growthData.map(d => d.users))
const maxRevenue = Math.max(...growthData.map(d => d.revenue))
const minUsers = Math.min(...growthData.map(d => d.users))
const minRevenue = Math.min(...growthData.map(d => d.revenue))

// Add some padding to the scale
const userScale = maxUsers - minUsers
const revenueScale = maxRevenue - minRevenue
const userPadding = userScale * 0.1
const revenuePadding = revenueScale * 0.1

const userMax = maxUsers + userPadding
const userMin = Math.max(0, minUsers - userPadding)
const revenueMax = maxRevenue + revenuePadding
const revenueMin = Math.max(0, minRevenue - revenuePadding)

export default function ImprovedGrowthChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 font-display">
            Proven Growth Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI solutions have delivered measurable results for businesses worldwide
          </p>
        </motion.div>

        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-50 rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800 font-display">
              Monthly Growth Overview
            </h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-accent-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 font-medium">Users (K)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 font-medium">Revenue ($K)</span>
              </div>
            </div>
          </div>

          <div className="h-80 flex items-end justify-between space-x-2 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4">
              <span>{Math.round(userMax / 1000)}K</span>
              <span>{Math.round((userMax * 0.8) / 1000)}K</span>
              <span>{Math.round((userMax * 0.6) / 1000)}K</span>
              <span>{Math.round((userMax * 0.4) / 1000)}K</span>
              <span>{Math.round((userMax * 0.2) / 1000)}K</span>
              <span>{Math.round(userMin / 1000)}K</span>
            </div>

            {/* Grid lines */}
            <div className="absolute left-12 right-0 top-0 h-full">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-gray-200"
                  style={{ top: `${(i / 5) * 100}%` }}
                />
              ))}
            </div>

            {/* Chart bars */}
            <div className="flex items-end justify-between space-x-2 w-full ml-12 relative z-10">
              {growthData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  transition={{ duration: 1, delay: 0.1 * index }}
                  className="flex flex-col items-center flex-1 group"
                >
                  <div className="flex flex-col items-center space-y-2 w-full">
                    {/* Revenue Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: ((data.revenue - revenueMin) / (revenueMax - revenueMin)) * 100 + "%" }}
                      transition={{ duration: 1, delay: 0.1 * index + 0.5 }}
                      className="w-full bg-primary-500 rounded-t-lg relative group-hover:bg-primary-600 transition-colors duration-300"
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        ${(data.revenue / 1000).toFixed(0)}K
                      </div>
                    </motion.div>
                    
                    {/* Users Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: ((data.users - userMin) / (userMax - userMin)) * 100 + "%" }}
                      transition={{ duration: 1, delay: 0.1 * index + 0.7 }}
                      className="w-full bg-accent-500 rounded-b-lg relative group-hover:bg-accent-600 transition-colors duration-300"
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {(data.users / 1000).toFixed(0)}K
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Month label */}
                  <div className="text-xs text-gray-600 mt-2 font-medium">
                    {data.month}
                  </div>
                  
                  {/* Growth percentage */}
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    +{data.growth}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chart Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 font-display">
                42.9%
              </div>
              <div className="text-sm text-gray-600">6-Month User Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 font-display">
                62.5%
              </div>
              <div className="text-sm text-gray-600">6-Month Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 font-display">
                8.6%
              </div>
              <div className="text-sm text-gray-600">Avg Monthly Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 font-display">
                195K
              </div>
              <div className="text-sm text-gray-600">Current Revenue ($K)</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}