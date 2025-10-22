/**
 * CHADIS Voice API - Cloudflare Worker
 * Handles ElevenLabs TTS integration for healthcare voice assistant
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
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Professional female voice (Rachel)
      const voiceId = '21m00Tcm4TlvDq8ikWAM';

      // Call ElevenLabs API
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
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Get audio data as array buffer
      const audioArrayBuffer = await response.arrayBuffer();
      const audioUint8Array = new Uint8Array(audioArrayBuffer);

      // Convert to base64
      let binary = '';
      for (let i = 0; i < audioUint8Array.byteLength; i++) {
        binary += String.fromCharCode(audioUint8Array[i]);
      }
      const base64Audio = btoa(binary);

      return new Response(JSON.stringify({
        audioBase64: base64Audio,
        mimeType: 'audio/mpeg'
      }), {
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