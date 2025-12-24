import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/portal(.*)'])
const isOrgPickerRoute = createRouteMatcher(['/portal/select-org'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Require sign-in for all portal routes
    const authData = await auth.protect()
    
    // Skip org check for the org picker page itself
    if (isOrgPickerRoute(req)) {
      return NextResponse.next()
    }
    
    // Require an organization membership for all portal users
    const orgId = authData.orgId
    
    if (!orgId) {
      // Redirect to org picker if no org is selected
      const url = new URL('/portal/select-org', req.url)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}
