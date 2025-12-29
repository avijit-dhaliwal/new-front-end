import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/portal(.*)'])
const isPublicPortalRoute = createRouteMatcher(['/portal/select-org'])

/**
 * Middleware for portal access
 * 
 * Simple model:
 * - /portal/* requires Clerk authentication (sign-in)
 * - Authorization (which org, staff status) is handled by D1 in the portal worker
 * - Clerk is ONLY used for authentication, not organization management
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Just require sign-in for portal routes
    // All org/role logic is handled client-side via D1 API
    await auth.protect()
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)'
  ],
}
