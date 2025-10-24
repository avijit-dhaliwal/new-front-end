'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'

interface InvoiceData {
  supplier: string
  invoiceNumber: string
  materialCost: number
  project: string
}

export default function EmailAgentPage() {
  const [invoiceText, setInvoiceText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null)
  const [error, setError] = useState('')

  const sampleInvoice = `From: supplies@abcmaterials.com
Subject: Invoice #INV-2024-1847

ABC Materials Supply Co.
Invoice #INV-2024-1847
Date: October 24, 2024

Bill To: MAG Construction
Project: 425 Oak Street Renovation

Items:
- Lumber (2x4 Douglas Fir) - $850.00
- Drywall sheets (50 units) - $625.00
- Paint (Premium Interior) - $340.00
- Electrical supplies - $280.00
- Plumbing fixtures - $445.00

Subtotal: $2,540.00
Tax (8%): $203.20
TOTAL: $2,743.20

Payment due within 30 days.`

  const handleLoadSample = () => {
    setInvoiceText(sampleInvoice)
    setExtractedData(null)
    setError('')
  }

  const handleExtract = async () => {
    if (!invoiceText.trim()) {
      setError('Please paste an invoice or load the sample')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/extract-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceText })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setExtractedData(data)
      }
    } catch (err) {
      setError('Failed to extract data. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <AnimatedBackground />
      <NavBar />

      <div className="pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 py-8"
        >
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-accent-500">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 font-display">
              Invoice Data Extraction
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Automatically extract supplier information, invoice numbers, project details, and material costs from email invoices
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Invoice Email</h2>
                  <button
                    onClick={handleLoadSample}
                    className="text-sm text-accent-600 hover:text-accent-700 font-medium"
                  >
                    Load Sample
                  </button>
                </div>

                <textarea
                  value={invoiceText}
                  onChange={(e) => setInvoiceText(e.target.value)}
                  placeholder="Paste your invoice email here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-500"
                />

                <button
                  onClick={handleExtract}
                  disabled={isProcessing}
                  className="w-full mt-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Extracting Data...' : 'Extract Invoice Data'}
                </button>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Extracted Data</h2>
                  <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                </div>

                {!extractedData ? (
                  <div className="h-96 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Extracted data will appear here</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</label>
                          <div className="mt-1 text-lg font-semibold text-gray-800">{extractedData.supplier}</div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice Number</label>
                          <div className="mt-1 text-lg font-mono text-gray-800">{extractedData.invoiceNumber}</div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</label>
                          <div className="mt-1 text-lg text-gray-800">{extractedData.project}</div>
                        </div>

                        <div className="pt-4 border-t border-gray-300">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Material Cost</label>
                          <div className="mt-1 text-3xl font-bold text-accent-600">
                            ${extractedData.materialCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Ready for Google Sheets</h3>
                      <p className="text-sm text-green-800">
                        This data would automatically populate your spreadsheet organized by project
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Field</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Value</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          <tr className="border-t border-gray-100">
                            <td className="px-4 py-2 text-sm text-gray-600">Supplier</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-800">{extractedData.supplier}</td>
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="px-4 py-2 text-sm text-gray-600">Invoice #</td>
                            <td className="px-4 py-2 text-sm font-mono text-gray-800">{extractedData.invoiceNumber}</td>
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="px-4 py-2 text-sm text-gray-600">Project</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{extractedData.project}</td>
                          </tr>
                          <tr className="border-t border-gray-100 bg-accent-50">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">Material Cost</td>
                            <td className="px-4 py-2 text-sm font-bold text-accent-700">
                              ${extractedData.materialCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Arrives</h3>
                <p className="text-sm text-gray-600">
                  Supplier sends invoice to your email inbox
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Extracts Data</h3>
                <p className="text-sm text-gray-600">
                  Automatically reads and extracts key information
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Updates Sheet</h3>
                <p className="text-sm text-gray-600">
                  Data flows into Google Sheets by project
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3 font-display">
              Ready to Automate Your Workflow?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Stop manually copying invoice data into spreadsheets. Let AI handle it automatically.
            </p>
            <Link href="/get-started">
              <button className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
