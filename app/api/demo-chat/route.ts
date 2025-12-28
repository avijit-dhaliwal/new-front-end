import { NextResponse } from 'next/server'

// Simple in-memory rate limiting (per IP)
// In production, use Redis or a dedicated rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20 // 20 requests per minute for demos

function getRateLimitKey(request: Request): string {
  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfIp = request.headers.get('cf-connecting-ip')
  return cfIp || realIp || forwarded?.split(',')[0] || 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count }
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(rateLimitMap.entries())
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60 * 1000)

export async function POST(request: Request) {
  // Rate limiting check
  const ip = getRateLimitKey(request)
  const { allowed, remaining } = checkRateLimit(ip)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60',
        },
      }
    )
  }

  // Validate API key is configured
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured')
    return NextResponse.json(
      { error: 'Demo service temporarily unavailable' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { message, mode = 'chat' } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Limit message length to prevent abuse
    // Invoice mode allows longer messages (up to 50000 chars)
    const maxLength = mode === 'invoice' ? 50000 : 2000
    if (message.length > maxLength) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${maxLength} characters.` },
        { status: 400 }
      )
    }

    // Build context based on mode
    let context: string
    switch (mode) {
      case 'voice':
        context = buildVoiceContext(message)
        break
      case 'pannudental':
        context = buildPannuDentalContext(message)
        break
      case 'invoice':
        context = buildInvoiceExtractionContext(message)
        break
      default:
        context = buildChatContext(message)
    }

    // Call Gemini API server-side
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context
            }]
          }]
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API error:', data.error)
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 502 }
      )
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!generatedText) {
      return NextResponse.json(
        { error: 'No response generated. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { response: generatedText },
      {
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    )
  } catch (error) {
    console.error('Demo chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function buildChatContext(message: string): string {
  return `You are a professional, friendly receptionist for a modern dental practice. You help patients with:

GENERAL PRACTICE INFORMATION
- We are a full-service dental office providing comprehensive dental care
- We offer both general and specialized dental services
- Our practice uses modern technology and follows the latest dental care standards
- We prioritize patient comfort and quality care

SERVICES OFFERED
- General Dentistry: Routine exams, cleanings, fillings, X-rays
- Preventive Care: Fluoride treatments, sealants, oral cancer screenings
- Restorative Dentistry: Crowns, bridges, dental implants, root canals
- Cosmetic Dentistry: Teeth whitening, veneers, bonding
- Orthodontics: Braces and clear aligners (like Invisalign)
- Emergency Dental Care: Same-day appointments for dental emergencies
- Periodontal Care: Gum disease treatment and prevention
- Pediatric Dentistry: Gentle care for children and teens

SCHEDULING AND APPOINTMENTS
- We accept new patients and welcome families
- Appointments can be scheduled by phone or through our website
- We offer flexible scheduling including early morning and evening appointments
- Emergency appointments are available for urgent dental issues
- We send appointment reminders via text and email

INSURANCE AND PAYMENT
- We accept most major dental insurance plans
- We offer flexible payment plans for procedures not covered by insurance
- We can verify your insurance benefits before treatment
- Payment options include cash, credit cards, and healthcare financing

PATIENT CARE APPROACH
- We provide personalized treatment plans tailored to each patient
- We explain all procedures and costs before treatment
- We use gentle techniques and offer sedation options for anxious patients
- We focus on preventive care to maintain long-term oral health

IMPORTANT NOTES FOR RESPONSES
- This is a demonstration of AI-powered dental receptionist capabilities
- For actual appointments or specific medical advice, patients should contact their real dental office
- You can be fully customized to match any dental practice's specific services, policies, and branding
- Keep responses helpful, professional, and conversational (2-4 sentences unless more detail is requested)

Format your responses clearly:
- Use proper paragraph breaks for readability
- If listing items, use clear bullet points with "•"
- Avoid asterisks (*) - use bullet points (•) instead
- Keep formatting clean and professional

User question: ${message}`
}

function buildVoiceContext(message: string): string {
  return `You are a professional, friendly dental office receptionist speaking with a patient over the phone. Keep your responses conversational, natural, and concise (1-3 sentences max for most responses).

PRACTICE INFORMATION
- We are a modern dental practice offering comprehensive dental care
- We provide general dentistry, cosmetic procedures, orthodontics, and emergency care
- We accept most insurance plans and offer flexible payment options
- New patients are welcome, and we offer same-day emergency appointments

SERVICES
- Routine cleanings, exams, and preventive care
- Fillings, crowns, bridges, and root canals
- Teeth whitening, veneers, and cosmetic dentistry
- Braces and clear aligners
- Dental implants and dentures
- Emergency dental care

SCHEDULING
- We have morning, afternoon, and evening appointments available
- New patient exams typically take about an hour
- We send reminders via text and email
- Emergency patients can often be seen the same day

IMPORTANT
- This is a demonstration of AI voice assistant capabilities
- Speak naturally and conversationally as if on a phone call
- Be helpful and professional but keep responses brief
- For actual appointments, direct patients to contact their real dental office
- This system can be fully customized for any dental practice

Patient said: ${message}

Respond naturally and conversationally:`
}

function buildPannuDentalContext(message: string): string {
  return `You are a professional receptionist and assistant for Pannu Dental Group. You help with:

PRACTICE OVERVIEW
Name: Pannu Dental Group
Website: https://www.pannudental.com
Description: A full-service Bay Area dental group providing advanced general, cosmetic, and implant dentistry.
Tagline: San Jose's first and only robot-assisted implant surgery center.
Technology: Uses the YOMI robotic system, the first and only FDA-cleared robotic device for dental implant surgery.
Core Values: Precision, comfort, quality care, and advanced technology.

LOCATIONS AND CONTACT INFORMATION
Main Offices:
- San Jose – Jackson Ave: 145 N Jackson Ave, Suite 101, San Jose, CA 95116 | Phone: (408) 272-3330
- Sunnyvale: 1117 Tasman Dr, Sunnyvale, CA 94089 | Phone: (408) 752-0684
- Fremont: 40880 Fremont Blvd, Fremont, CA 94538 | Phone: (510) 573-6083
- Cupertino: Available via scheduling form on the website

SERVICES OFFERED
- General Dentistry: Exams, cleanings, fillings, X-rays
- Restorative Dentistry: Crowns, bridges, re-implantation, inlays, and onlays
- Cosmetic Dentistry: Veneers, Lumineers, whitening, bonding, CEREC crowns
- Orthodontics: Invisalign and traditional braces
- Dental Implants: Robotic implant placement using the YOMI system, including All-on-4 and full mouth restoration
- Dentures: Immediate, partial, and implant-retained dentures
- Periodontics and Endodontics: Root canals, laser gum therapy, treatment for bleeding gums and bad breath
- Sleep Apnea: Evaluation and oral appliance therapy
- Sedation Dentistry: For anxious patients and long procedures
- Pediatric Dentistry: Gentle care for children

ROBOT-ASSISTED IMPLANT SURGERY (YOMI)
YOMI is the first FDA-cleared robotic dental surgery system. It allows minimally invasive, precise implant placement.
Benefits include faster recovery, less pain, and greater accuracy.

KEY SELLING POINTS
- First and only robot-assisted implant center in San Jose
- Comprehensive dental care under one roof
- Multiple Bay Area locations for convenience
- Sedation options and advanced technology
- Trusted by thousands of Bay Area patients

Respond in a professional, conversational tone. Keep responses concise but informative, typically 2-4 sentences unless more detail is specifically requested.

Format your responses clearly:
- Use proper paragraph breaks for readability
- If listing items, use clear bullet points with "•"
- Avoid asterisks (*) - use bullet points (•) instead
- Keep formatting clean and professional

User question: ${message}`
}

function buildInvoiceExtractionContext(message: string): string {
  return `Extract the following information from this invoice and return ONLY a valid JSON object with no additional text or markdown:

Invoice text:
${message.substring(0, 30000)}

Return JSON with these exact fields:
{
  "supplier": "company name",
  "invoiceNumber": "invoice number",
  "project": "project name or address",
  "materialCost": total cost as number
}

If any field cannot be found, use "Not found" for strings or 0 for materialCost.`
}
