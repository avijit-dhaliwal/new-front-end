import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/contact',
  '/articles(.*)',
  '/chatbot',
  '/phone-service',
  '/ai-suites',
  '/get-started',
  '/schedule-meeting',
  '/checkout',
  '/demo(.*)',
  '/chadis',
  '/pannudental',
  '/legalservices',
  '/emailagent',
])

const isProtectedRoute = createRouteMatcher(['/portal(.*)'])

/**
 * Middleware for portal access
 * 
 * - Public routes: accessible without sign-in
 * - /portal/*: requires Clerk authentication
 * - Authorization (org, roles) is handled by D1
 */
export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without any auth check
  if (isPublicRoute(req)) {
    return
  }
  
  // Protect portal routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
