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
    
    // Check if user is Koby staff (can access without org)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publicMeta = authData.sessionClaims?.publicMetadata as Record<string, any> | undefined
    const isStaff = publicMeta?.kobyRole === 'staff'
    
    if (isStaff) {
      // Koby staff can access any route
      return NextResponse.next()
    }
    
    // For non-staff users, check if they have an organization
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
