/**
 * CHADIS Voice Conversation - Cloudflare Worker
 * Handles ElevenLabs conversation API integration for healthcare voice assistant
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
      const { action, data } = await request.json();

      const apiKey = env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'ElevenLabs API key not configured' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'create_conversation') {
        // Create a new conversation session
        const agentId = env.ELEVENLABS_AGENT_ID || 'your-agent-id-here';

        const conversationResponse = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
          method: 'POST',
          headers: {
            'Xi-Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_id: agentId,
            agent_override: {
              prompt: {
                prompt: `You are a healthcare assistant for CHADIS (Child Health and Development Interactive System), a pediatric healthcare screening platform. You help with:

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

Respond as a knowledgeable, caring healthcare assistant. Be professional, helpful, and focused on pediatric healthcare. Keep responses concise but informative. If asked about specific medical advice, remind users to consult with their healthcare provider.

Start the conversation by greeting the user and briefly explaining that you're here to help with CHADIS-related healthcare questions.`
              }
            }
          })
        });

        if (!conversationResponse.ok) {
          const errorText = await conversationResponse.text();
          console.error('ElevenLabs conversation creation failed:', errorText);
          return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
            status: conversationResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const conversationData = await conversationResponse.json();

        return new Response(JSON.stringify({
          conversation_id: conversationData.conversation_id,
          agent_id: agentId
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'get_conversation_token') {
        // Get a signed URL for WebSocket connection
        const { conversation_id } = data;

        const tokenResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}/get_signed_url`, {
          method: 'GET',
          headers: {
            'Xi-Api-Key': apiKey,
          }
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('ElevenLabs token generation failed:', errorText);
          return new Response(JSON.stringify({ error: 'Failed to get conversation token' }), {
            status: tokenResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const tokenData = await tokenResponse.json();

        return new Response(JSON.stringify({
          signed_url: tokenData.signed_url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
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