# Environment Variables Documentation
# 
# NEVER commit real API keys to this repository!
# Use .env.local for local development (copy from .env.example)

# Google Sheets Configuration
# Follow the instructions in GOOGLE_SHEETS_SETUP.md to get your URL
# The URL should look like: https://script.google.com/macros/s/.../exec
GOOGLE_SHEETS_URL=YOUR_GOOGLE_SHEETS_URL_HERE

# Gemini AI API Key (for chat bot)
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs API Key (for voice bot)
# Get your API key from: https://elevenlabs.io/speech-synthesis
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Clerk Authentication (required for portal)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe Billing (required for subscriptions)
# Use sk_test_ for testing, sk_live_ for production
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...