import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { invoiceText } = await request.json()

    if (!invoiceText) {
      return NextResponse.json({ error: 'Invoice text is required' }, { status: 400 })
    }

    const supplierMatch = invoiceText.match(/(?:From:|Company:)\s*(.+?)(?:\n|$)/i) ||
                         invoiceText.match(/([A-Z][A-Za-z\s&]+(?:Supply|Materials|Co\.|Inc\.|LLC))/i)
    const supplier = supplierMatch ? supplierMatch[1].trim() : 'Not found'

    const invoiceNumMatch = invoiceText.match(/(?:Invoice\s*#|Invoice\s*Number:?)\s*([A-Z0-9-]+)/i)
    const invoiceNumber = invoiceNumMatch ? invoiceNumMatch[1].trim() : 'Not found'

    const projectMatch = invoiceText.match(/(?:Project:|Bill To:)\s*(.+?)(?:\n|$)/i) ||
                        invoiceText.match(/(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)(?:\s+[A-Za-z\s]+)?)/i)
    const project = projectMatch ? projectMatch[1].trim() : 'Not found'

    const totalMatch = invoiceText.match(/(?:TOTAL|Total Cost|Grand Total|Amount Due):\s*\$?([0-9,]+\.?\d*)/i)
    const subtotalMatch = invoiceText.match(/(?:Subtotal|Sub-total):\s*\$?([0-9,]+\.?\d*)/i)

    let materialCost = 0
    if (totalMatch) {
      materialCost = parseFloat(totalMatch[1].replace(/,/g, ''))
    } else if (subtotalMatch) {
      materialCost = parseFloat(subtotalMatch[1].replace(/,/g, ''))
    }

    const extractedData = {
      supplier,
      invoiceNumber,
      project,
      materialCost
    }

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('Error extracting invoice:', error)
    return NextResponse.json({ error: 'Failed to process invoice' }, { status: 500 })
  }
}
