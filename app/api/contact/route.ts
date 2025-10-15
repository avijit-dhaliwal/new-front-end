import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get Google Sheets URL from environment variable
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '';

    if (!GOOGLE_SHEETS_URL) {
      console.warn('Google Sheets URL not configured');
      // Still return success even if Google Sheets is not configured
      // This allows the form to work during development
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully (Google Sheets not configured)'
      });
    }

    // Parse the name to get first and last name
    const nameParts = body.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare submission data for Google Sheets
    const submissionData = {
      timestamp: new Date().toISOString(),
      type: body.subject || 'contact',
      serviceType: body.subject || 'general',
      firstName: firstName,
      lastName: lastName,
      email: body.email,
      phone: body.phone || 'Not provided',
      company: body.company || 'Not provided',
      message: body.message,
      integrations: body.integrations || 'None selected',
      preferredContact: body.preferredContact || 'email',
      newsletter: body.newsletter || false
    };

    // Send data to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
      // Important: Use no-cors mode to avoid CORS issues with Google Apps Script
      mode: 'no-cors' as RequestMode
    });

    // Note: With no-cors mode, we can't read the response
    // We assume success if no exception was thrown
    console.log('Form submission sent to Google Sheets');

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Contact API endpoint is working',
    method: 'Use POST to submit form data'
  });
}