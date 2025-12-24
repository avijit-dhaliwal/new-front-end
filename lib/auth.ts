import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

/**
 * Clerk Organization Roles (configured in Clerk Dashboard):
 * - client_admin: Can manage org settings, invite members, change roles
 * - client_viewer: Read-only access to portal data
 * 
 * Koby Staff Role (set via publicMetadata.kobyRole = 'staff'):
 * - Full access to all organizations
 * - Can view any client portal via ?orgId= parameter
 */

export type OrgRole = 'client_admin' | 'client_viewer'
export type KobyRole = 'staff'

export interface AuthContext {
  userId: string | null
  orgId: string | null
  orgRole: OrgRole | null
  isKobyStaff: boolean
  activeOrgId: string | null
}

/**
 * Check if the current user is a Koby staff member
 * Staff members have publicMetadata.kobyRole = 'staff'
 */
export async function isKobyStaff(): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false
  return user.publicMetadata?.kobyRole === 'staff'
}

/**
 * Get the current user's organization role within their active org
 */
export async function getOrgRole(): Promise<OrgRole | null> {
  const { orgRole } = await auth()
  if (!orgRole) return null
  // Map Clerk's role to our OrgRole type
  if (orgRole === 'org:client_admin' || orgRole === 'org:admin') return 'client_admin'
  if (orgRole === 'org:client_viewer' || orgRole === 'org:member') return 'client_viewer'
  return null
}

/**
 * Get the active organization ID
 * - For regular users: returns their current org from auth()
 * - For Koby staff: can override via ?orgId= query parameter
 */
export async function getActiveOrgId(searchParams?: { orgId?: string }): Promise<string | null> {
  const { orgId } = await auth()
  const staff = await isKobyStaff()
  
  // Koby staff can access any org via query param
  if (staff && searchParams?.orgId) {
    return searchParams.orgId
  }
  
  return orgId ?? null
}

/**
 * Get full auth context for the current request
 */
export async function getAuthContext(searchParams?: { orgId?: string }): Promise<AuthContext> {
  const { userId, orgId, orgRole } = await auth()
  const staff = await isKobyStaff()
  
  let mappedRole: OrgRole | null = null
  if (orgRole === 'org:client_admin' || orgRole === 'org:admin') mappedRole = 'client_admin'
  else if (orgRole === 'org:client_viewer' || orgRole === 'org:member') mappedRole = 'client_viewer'
  
  const activeOrgId = staff && searchParams?.orgId ? searchParams.orgId : (orgId ?? null)
  
  return {
    userId: userId ?? null,
    orgId: orgId ?? null,
    orgRole: mappedRole,
    isKobyStaff: staff,
    activeOrgId,
  }
}

/**
 * Require either an organization membership OR Koby staff role
 * Redirects to org picker if neither condition is met
 */
export async function requireOrgOrKoby(searchParams?: { orgId?: string }): Promise<AuthContext> {
  const context = await getAuthContext(searchParams)
  
  if (!context.userId) {
    redirect('/sign-in')
  }
  
  // Koby staff can access without org
  if (context.isKobyStaff) {
    return context
  }
  
  // Regular users need an org
  if (!context.orgId) {
    redirect('/portal/select-org')
  }
  
  return context
}

/**
 * Require client_admin role or Koby staff for admin actions
 */
export async function requireAdminOrKoby(searchParams?: { orgId?: string }): Promise<AuthContext> {
  const context = await requireOrgOrKoby(searchParams)
  
  if (context.isKobyStaff) {
    return context
  }
  
  if (context.orgRole !== 'client_admin') {
    redirect('/portal')
  }
  
  return context
}

/**
 * Check if user can manage team (invite, change roles)
 */
export async function canManageTeam(): Promise<boolean> {
  const staff = await isKobyStaff()
  if (staff) return true
  
  const role = await getOrgRole()
  return role === 'client_admin'
}

/**
 * Check if user can edit portal configuration
 */
export async function canEditConfig(): Promise<boolean> {
  const staff = await isKobyStaff()
  if (staff) return true
  
  const role = await getOrgRole()
  return role === 'client_admin'
}
