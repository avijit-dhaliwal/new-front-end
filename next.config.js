/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  env: {
    // Clerk Authentication (public - bundled into client JS)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_Y29tbXVuYWwtZGFzc2llLTQwLmNsZXJrLmFjY291bnRzLmRldiQ',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/portal',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/portal',
    // Portal Configuration
    NEXT_PUBLIC_PORTAL_WORKER_URL: 'https://koby-portal.voidinfrastructuretechnologies.workers.dev',
    NEXT_PUBLIC_KOBY_INTERNAL_ORG_ID: 'org_koby_internal',
  }
}

module.exports = nextConfig