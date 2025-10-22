/**
 * Simplified CHADIS Voice Test Worker
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
      const { text } = await request.json();

      if (!text) {
        return new Response(JSON.stringify({ error: 'Text is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const apiKey = env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({
          error: 'Service temporarily unavailable',
          debug: 'No API key found'
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Test the API key first
      const testResponse = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': apiKey
        }
      });

      if (!testResponse.ok) {
        return new Response(JSON.stringify({
          error: 'Service temporarily unavailable',
          debug: `API key test failed: ${testResponse.status}`
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // If API key works, try the actual TTS request
      const voiceId = '21m00Tcm4TlvDq8ikWAM';
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.85,        // Higher stability for professional consistency
            similarity_boost: 0.90, // Higher similarity for authentic voice
            style: 0.25,           // Moderate style for natural expression
            use_speaker_boost: true // Enhance voice clarity
          }
        })
      });

      if (!response.ok) {
        return new Response(JSON.stringify({
          error: 'Service temporarily unavailable',
          debug: `TTS request failed: ${response.status} - ${response.statusText}`
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Convert response to base64
      const audioArrayBuffer = await response.arrayBuffer();
      const audioUint8Array = new Uint8Array(audioArrayBuffer);

      let binary = '';
      for (let i = 0; i < audioUint8Array.byteLength; i++) {
        binary += String.fromCharCode(audioUint8Array[i]);
      }
      const base64Audio = btoa(binary);

      return new Response(JSON.stringify({
        audioBase64: base64Audio,
        mimeType: 'audio/mpeg',
        debug: 'Success'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

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