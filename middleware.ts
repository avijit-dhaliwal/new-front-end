import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/portal(.*)'])

/**
 * Middleware for portal access
 * 
 * - All routes are public by default
 * - /portal/*: requires Clerk authentication
 * - Authorization (org, roles) is handled by D1
 */
export default clerkMiddleware(async (auth, req) => {
  // Only protect portal routes - everything else is public
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
