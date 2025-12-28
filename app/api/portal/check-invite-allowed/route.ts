import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const PORTAL_WORKER_URL = process.env.PORTAL_WORKER_URL || 'https://portal-worker.koby.workers.dev'

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!orgId) {
      return NextResponse.json({ error: 'Organization required' }, { status: 400 })
    }
    
    // Get actual member count from Clerk
    const client = await clerkClient()
    const memberships = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
      limit: 1 // We just need the count
    })
    
    const currentMemberCount = memberships.totalCount
    
    // Get user info for staff check
    const user = await client.users.getUser(userId)
    const isKobyStaff = user.publicMetadata?.kobyRole === 'staff'
    
    // Get org membership to check role
    const orgMembership = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
      userId: [userId]
    })
    
    const userRole = orgMembership.data[0]?.role
    
    // Forward to portal worker
    const response = await fetch(`${PORTAL_WORKER_URL}/portal/check-invite-allowed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-User-Id': userId,
        'X-Clerk-Org-Id': orgId,
        'X-Clerk-Org-Role': userRole || '',
        'X-Koby-Staff': isKobyStaff ? 'true' : 'false',
      },
      body: JSON.stringify({ currentMemberCount })
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('check-invite-allowed error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
