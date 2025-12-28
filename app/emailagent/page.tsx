'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
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

  const extractInvoiceDataRegex = (text: string) => {
    const supplierMatch = text.match(/(?:From:|Company:)\s*(.+?)(?:\n|$)/i) ||
                         text.match(/([A-Z][A-Za-z\s&]+(?:Supply|Materials|Co\.|Inc\.|LLC))/i)
    const supplier = supplierMatch ? supplierMatch[1].trim() : 'Not found'

    const invoiceNumMatch = text.match(/(?:Invoice\s*#|Invoice\s*Number:?)\s*([A-Z0-9-]+)/i)
    const invoiceNumber = invoiceNumMatch ? invoiceNumMatch[1].trim() : 'Not found'

    const projectMatch = text.match(/(?:Project:|Bill To:)\s*(.+?)(?:\n|$)/i) ||
                        text.match(/(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)(?:\s+[A-Za-z\s]+)?)/i)
    const project = projectMatch ? projectMatch[1].trim() : 'Not found'

    const totalMatch = text.match(/(?:TOTAL|Total Cost|Grand Total|Amount Due):\s*\$?([0-9,]+\.?\d*)/i)
    const subtotalMatch = text.match(/(?:Subtotal|Sub-total):\s*\$?([0-9,]+\.?\d*)/i)

    let materialCost = 0
    if (totalMatch) {
      materialCost = parseFloat(totalMatch[1].replace(/,/g, ''))
    } else if (subtotalMatch) {
      materialCost = parseFloat(subtotalMatch[1].replace(/,/g, ''))
    }

    return {
      supplier,
      invoiceNumber,
      project,
      materialCost
    }
  }

  const handleExtract = async () => {
    if (!invoiceText.trim()) {
      setError('Please paste an invoice or load the sample')
      return
    }

    const MAX_LENGTH = 100000
    if (invoiceText.length > MAX_LENGTH) {
      setError(`Input too large. Please limit to ${MAX_LENGTH.toLocaleString()} characters.`)
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Call server-side API proxy (no API keys exposed to browser)
      const response = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: invoiceText,
          mode: 'invoice'
        })
      })

      if (!response.ok) {
        throw new Error('AI extraction failed')
      }

      const result = await response.json()
      const textResponse = result.response || ''

      const jsonMatch = textResponse.match(/\{[\s\S]*?\}/)
      if (!jsonMatch) {
        throw new Error('Could not parse AI response')
      }

      const extractedData = JSON.parse(jsonMatch[0])

      if (extractedData.materialCost && typeof extractedData.materialCost === 'string') {
        extractedData.materialCost = parseFloat(extractedData.materialCost.replace(/[^0-9.]/g, ''))
      }

      setExtractedData(extractedData)
    } catch (err) {
      console.warn('AI extraction failed, falling back to regex:', err)
      const data = extractInvoiceDataRegex(invoiceText)
      setExtractedData(data)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
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
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Automation Demo
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Invoice Data{" "}
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                Extraction
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Automatically extract supplier information, invoice numbers, project details, and material costs from email invoices
            </p>
          </motion.div>
        </div>
      </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
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
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display tracking-tight">How It Works</h2>

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
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 lg:p-12 text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 font-display tracking-tight">
              Ready to Automate Your Workflow?
            </h2>
            <p className="text-accent-100 mb-6 max-w-2xl mx-auto">
              Stop manually copying invoice data into spreadsheets. Let AI handle it automatically.
            </p>
            <Link href="/get-started">
              <button className="inline-flex items-center justify-center bg-white text-accent-600 font-semibold py-3.5 px-7 rounded-full hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>

      <Footer />
    </main>
  )
}
