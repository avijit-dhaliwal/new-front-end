# CHADIS Cloudflare Workers Deployment

## Setup Instructions

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Deploy Chat Worker
```bash
cd cloudflare-workers
wrangler deploy chadis-chat-worker.js --name chadis-chat
```

### 4. Deploy Voice Worker
```bash
wrangler deploy chadis-voice-worker.js --name chadis-voice
```

### 5. Set Environment Variables

#### For Chat Worker:
```bash
wrangler secret put GEMINI_API_KEY --name chadis-chat
# Enter your Gemini API key when prompted
```

#### For Voice Worker:
```bash
wrangler secret put ELEVENLABS_API_KEY --name chadis-voice
# Enter your ElevenLabs API key when prompted
```

### 6. Get Worker URLs

After deployment, Cloudflare will provide URLs like:
- Chat: `https://chadis-chat.your-subdomain.workers.dev`
- Voice: `https://chadis-voice.your-subdomain.workers.dev`

### 7. Update Frontend

Update your frontend API calls to use these URLs instead of `/api/chadis/chat` and `/api/chadis/voice`.

## Testing Workers

### Test Chat Worker:
```bash
curl -X POST https://chadis-chat.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message": "What is CHADIS?"}'
```

### Test Voice Worker:
```bash
curl -X POST https://chadis-voice.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test of the CHADIS voice system."}'
```

## Benefits of Cloudflare Workers

1. **Global Edge Network**: Low latency worldwide
2. **Serverless**: No server management required
3. **Scalable**: Handles traffic spikes automatically
4. **Secure**: API keys stored as encrypted secrets
5. **Fast Cold Starts**: Near-instant response times
6. **Cost Effective**: Pay only for what you use

## Monitoring

Access logs and analytics at:
- [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
- Navigate to Workers & Pages → Your Workers
- View real-time metrics and logs