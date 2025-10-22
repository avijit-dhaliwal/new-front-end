# CHADIS Demo Setup Guide

## 🚀 Quick Start

Your CHADIS demo is ready! To get the real AI APIs working, follow these steps:

### 1. Get Your API Keys

#### Gemini AI (for Chat Bot)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

#### ElevenLabs (for Voice Bot)
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for a free account (gives you 10,000 characters/month)
3. Go to your [Profile Settings](https://elevenlabs.io/speech-synthesis)
4. Copy your API key from the "API Key" section

### 2. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ELEVENLABS_API_KEY=your_actual_elevenlabs_api_key_here
   ```

### 3. Restart Your Dev Server

```bash
npm run dev
```

### 4. Test the Demo

Visit `http://localhost:3000/chadis` and test both:

#### Chat Bot
- Click "Try Chat Bot"
- Ask questions like:
  - "What is CHADIS?"
  - "How does pediatric health screening work?"
  - "Tell me about developmental assessments"

#### Voice Bot
- Click "Try Voice Bot"
- Click the microphone and speak naturally
- The bot will respond with AI-generated speech using ElevenLabs

## 🔧 Technical Details

### Chat Bot Features
- ✅ Real Gemini AI integration
- ✅ CHADIS healthcare context
- ✅ Professional medical guidance
- ✅ Secure server-side API calls

### Voice Bot Features
- ✅ Speech-to-text (Web Speech API)
- ✅ Real Gemini AI responses
- ✅ Text-to-speech (ElevenLabs)
- ✅ Professional voice (Rachel)
- ✅ Volume controls
- ✅ Conversation history

### Security
- API keys are stored server-side only
- No client-side exposure of sensitive credentials
- Secure API routes with error handling

## 💡 Customization

### Change Voice Settings
Edit `/app/api/chadis/voice/route.ts`:
- `voiceId`: Change to different ElevenLabs voice
- `stability`: Adjust voice consistency (0.0-1.0)
- `similarity_boost`: Adjust voice similarity (0.0-1.0)

### Modify AI Context
Edit `/app/api/chadis/chat/route.ts`:
- Update the system prompt for different responses
- Add more CHADIS-specific information
- Adjust response length and tone

## 🎯 Available Voices (ElevenLabs)

- Rachel (default): `21m00Tcm4TlvDq8ikWAM` - Professional female
- Adam: `pNInz6obpgDQGcFmaJgB` - Professional male
- Bella: `EXAVITQu4vr4xnSDxMaL` - Young female
- Antoni: `ErXwobaYiN019PkySvjV` - Young male

## 🔍 Troubleshooting

### Chat Bot Issues
- Check that `GEMINI_API_KEY` is set correctly
- Verify API key is valid at [Google AI Studio](https://aistudio.google.com/)
- Check browser console for error messages

### Voice Bot Issues
- Check that `ELEVENLABS_API_KEY` is set correctly
- Ensure microphone permissions are granted
- Check ElevenLabs quota at [elevenlabs.io](https://elevenlabs.io/)
- Browser speech recognition may need HTTPS in production

### API Rate Limits
- **Gemini**: Usually generous for testing
- **ElevenLabs**: 10,000 characters/month on free tier
- Consider upgrading plans for production use

## 📊 API Costs (Approximate)

### Gemini AI
- Free tier: 15 requests/minute
- Paid: $0.000125 per 1K characters

### ElevenLabs
- Free: 10,000 characters/month
- Creator: $5/month for 30,000 characters
- Pro: $22/month for 100,000 characters

Your CHADIS demo is now ready with real AI integration! 🎉