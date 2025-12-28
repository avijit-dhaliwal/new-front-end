import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/portal(.*)'])
const isOrgPickerRoute = createRouteMatcher(['/portal/select-org'])

/**
 * Middleware for invite-only portal access
 * 
 * Security model:
 * - /portal/* requires authentication + org membership (or Koby staff)
 * - ?orgId= parameter is staff-only for cross-org viewing
 * - Only Koby staff (publicMetadata.kobyRole === 'staff') can view other orgs
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Require sign-in for all portal routes
    const authData = await auth.protect()
    
    // Skip org check for the org picker page itself
    if (isOrgPickerRoute(req)) {
      return NextResponse.next()
    }
    
    // Check for cross-org access via ?orgId= parameter
    const viewingOrgId = req.nextUrl.searchParams.get('orgId')
    
    if (viewingOrgId) {
      // Only Koby staff can use ?orgId= to view other organizations
      // We need to check the user's publicMetadata.kobyRole
      const userId = authData.userId
      
      if (userId) {
        try {
          const clerk = await clerkClient()
          const user = await clerk.users.getUser(userId)
          const isKobyStaff = user?.publicMetadata?.kobyRole === 'staff'
          
          if (!isKobyStaff) {
            // Non-staff user trying to use ?orgId= - strip the parameter and redirect
            const cleanUrl = new URL(req.url)
            cleanUrl.searchParams.delete('orgId')
            return NextResponse.redirect(cleanUrl)
          }
        } catch (error) {
          // If we can't verify staff status, deny cross-org access
          const cleanUrl = new URL(req.url)
          cleanUrl.searchParams.delete('orgId')
          return NextResponse.redirect(cleanUrl)
        }
      }
    }
    
    // Require an organization membership for all portal users
    const orgId = authData.orgId
    
    if (!orgId && !viewingOrgId) {
      // Check if user is Koby staff - they can access without org membership
      const userId = authData.userId
      
      if (userId) {
        try {
          const clerk = await clerkClient()
          const user = await clerk.users.getUser(userId)
          const isKobyStaff = user?.publicMetadata?.kobyRole === 'staff'
          
          if (isKobyStaff) {
            // Koby staff can access portal without org
            return NextResponse.next()
          }
        } catch {
          // Fall through to org picker redirect
        }
      }
      
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
