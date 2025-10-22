/**
 * CHADIS ElevenLabs Conversation API Worker
 * Full conversation support with LLM + TTS + real-time audio
 */

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
      const { action, conversationId, message } = await request.json();
      const apiKey = env.ELEVENLABS_API_KEY;

      if (!apiKey) {
        return new Response(JSON.stringify({
          error: 'Service temporarily unavailable'
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Handle different conversation actions
      switch (action) {
        case 'create_conversation':
          return await createConversation(apiKey, corsHeaders);

        case 'send_message':
          return await sendMessage(apiKey, conversationId, message, corsHeaders);

        case 'get_audio':
          return await getAudioChunk(apiKey, conversationId, corsHeaders);

        default:
          return new Response(JSON.stringify({
            error: 'Invalid action'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        error: 'Service temporarily unavailable',
        debug: error.message
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function createConversation(apiKey, corsHeaders) {
  const agentConfig = {
    agent_id: "chadis_healthcare_agent",
    name: "CHADIS Healthcare Assistant",
    prompt: `You are a professional healthcare assistant for CHADIS (Child Health and Development Interactive System).

CHADIS is a pediatric screening platform that:
- Automates 1,000+ evidence-based questionnaires
- Screens for ADHD, depression, anxiety, autism, and developmental delays
- Serves healthcare providers, schools, and families
- Provides immediate scoring and clinical decision support

Your role:
- Answer questions about CHADIS features and capabilities
- Explain how CHADIS improves pediatric care workflows
- Discuss screening benefits for early intervention
- Be professional, knowledgeable, and empathetic
- Keep responses concise and focused on CHADIS value

Speak naturally and conversationally. This is a voice conversation, so avoid bullet points or lists - speak in flowing sentences.`,

    language: "en",

    llm: {
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 150
    },

    tts: {
      voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
      model: "eleven_multilingual_v2",
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true
    }
  };

  const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(agentConfig)
  });

  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.status} - ${response.statusText}`);
  }

  const conversationData = await response.json();

  return new Response(JSON.stringify(conversationData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function sendMessage(apiKey, conversationId, message, corsHeaders) {
  const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      mode: "text_to_speech"
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status} - ${response.statusText}`);
  }

  const messageData = await response.json();

  return new Response(JSON.stringify(messageData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getAudioChunk(apiKey, conversationId, corsHeaders) {
  const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}/audio`, {
    headers: {
      'xi-api-key': apiKey,
      'Accept': 'audio/mpeg'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get audio: ${response.status} - ${response.statusText}`);
  }

  // Stream the audio directly back to the client
  return new Response(response.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked'
    }
  });
}