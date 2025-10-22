/**
 * CHADIS Chat API - Cloudflare Worker
 * Handles Gemini AI integration for healthcare chat assistant
 */

export default {
  async fetch(request, env) {
    // Handle CORS
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
      const { message } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const context = `You are a healthcare assistant for CHADIS (Child Health and Development Interactive System), a pediatric healthcare screening platform. You help with:

      - Pediatric health screening questionnaires
      - Developmental assessments for children and adolescents
      - Early identification of ADHD, depression, anxiety, and other psychosocial concerns
      - Clinical documentation support
      - Patient engagement and family education
      - Healthcare provider decision support

      Key facts about CHADIS:
      - Automates 1,000+ screening and diagnostic questionnaires
      - Tailored to patient age and visit reason
      - Serves 15% of primary care pediatric market
      - 90% renewal rate with 10-20X ROI for practices
      - HIPAA compliant and clinically validated
      - Created by developmental-behavioral pediatricians

      Respond as a knowledgeable, caring healthcare assistant. Be professional, helpful, and focused on pediatric healthcare. If asked about specific medical advice, remind users to consult with their healthcare provider.

      Respond in a professional, conversational tone. Keep responses concise but informative, typically 2-4 sentences unless more detail is specifically requested.

      Format your responses clearly:
      - Use proper paragraph breaks for readability
      - If listing items, use clear bullet points with "•"
      - Avoid asterisks (*) - use bullet points (•) instead
      - Keep formatting clean and professional

      User question: ${message}`;

      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
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
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ response: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};