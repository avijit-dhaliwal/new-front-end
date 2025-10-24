export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const data = await request.json();

      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const submissionData = {
        timestamp: data.timestamp,
        type: data.subject || 'contact',
        serviceType: data.subject || 'general',
        firstName: firstName,
        lastName: lastName,
        email: data.email,
        phone: 'Not provided',
        company: data.company || 'Not provided',
        message: data.message,
        integrations: 'None selected',
        preferredContact: 'email',
        newsletter: false
      };

      const googleSheetsUrl = env.GOOGLE_SHEETS_URL;
      if (!googleSheetsUrl) {
        return new Response(JSON.stringify({ error: 'Service not configured' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to submit form' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}
