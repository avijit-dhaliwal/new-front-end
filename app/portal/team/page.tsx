'use client'

import { useEffect, useState, Suspense } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Shield, Users, ArrowLeft, UserPlus, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { MeResponse, UserMembership } from '@/types/portal'

const PORTAL_WORKER_URL = process.env.NEXT_PUBLIC_PORTAL_WORKER_URL || ''

interface OrgMember {
  id: string
  clerkUserId: string
  email?: string
  name?: string
  role: string
  createdAt: string
}

function TeamSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-strong)]" />
    </div>
  )
}

function TeamPageContent() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const viewingOrgId = searchParams.get('orgId')
  
  const [meData, setMeData] = useState<MeResponse | null>(null)
  const [meLoading, setMeLoading] = useState(true)
  const [members, setMembers] = useState<OrgMember[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  
  // Invite form state
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'member' | 'admin'>('member')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  
  // Fetch user info from D1
  useEffect(() => {
    const fetchMe = async () => {
      if (!user) return
      try {
        const token = await getToken()
        if (!token || !PORTAL_WORKER_URL) {
          setMeLoading(false)
          return
        }
        const response = await fetch(`${PORTAL_WORKER_URL}/portal/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (response.ok) {
          setMeData(await response.json())
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      } finally {
        setMeLoading(false)
      }
    }
    fetchMe()
  }, [user, getToken])
  
  const isKobyStaff = meData?.user?.isKobyStaff || false
  const memberships = meData?.memberships || []
  const defaultOrgId = memberships[0]?.orgId || null
  const activeOrgId = viewingOrgId || meData?.currentOrgId || defaultOrgId
  
  // Find current org and user's role
  const currentMembership = memberships.find((m: UserMembership) => m.orgId === activeOrgId)
  const currentOrgName = currentMembership?.orgName || 'Organization'
  const isOrgAdmin = isKobyStaff || currentMembership?.role === 'owner' || currentMembership?.role === 'admin'
  
  // Fetch org members (placeholder - would need API endpoint)
  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeOrgId || !user) return
      setMembersLoading(true)
      
      // For now, show current user as a member
      // In production, you'd fetch from /portal/orgs/:id/members
      const mockMembers: OrgMember[] = []
      
      if (meData?.user) {
        mockMembers.push({
          id: meData.user.id,
          clerkUserId: meData.user.clerkUserId,
          email: meData.user.email,
          name: meData.user.name,
          role: currentMembership?.role || 'member',
          createdAt: meData.user.createdAt,
        })
      }
      
      setMembers(mockMembers)
      setMembersLoading(false)
    }
    
    if (!meLoading) {
      fetchMembers()
    }
  }, [activeOrgId, user, meData, meLoading, currentMembership?.role])
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !activeOrgId) return
    
    setInviting(true)
    setInviteError(null)
    
    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      
      // This would call the membership creation API
      // For now, show a placeholder message
      alert(`Invite functionality coming soon. Would invite ${inviteEmail} as ${inviteRole} to org ${activeOrgId}`)
      
      setInviteEmail('')
      setShowInviteForm(false)
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite')
    } finally {
      setInviting(false)
    }
  }
  
  if (meLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-strong)]" />
      </div>
    )
  }
  
  if (!activeOrgId) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <Link 
          href="/portal" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portal
        </Link>
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="text-sm font-semibold text-[var(--ink)]">No organization selected</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Go to the portal and select an organization to manage team members.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Back link */}
      <Link 
        href="/portal" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portal
      </Link>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Team & Access</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
            Manage your team
          </h1>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            Invite team members and manage roles for your organization.
          </p>
        </div>
        
        <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs text-[var(--ink-muted)]">
          {currentOrgName}
        </div>
      </div>
      
      {/* Koby Staff Notice */}
      {isKobyStaff && (
        <div className="mb-8 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[var(--accent-strong)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Koby Staff Access</p>
              <p className="text-xs text-[var(--ink-muted)]">
                You have full access to manage this organization as a Koby team member.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Permissions Notice for non-admins */}
      {!isOrgAdmin && (
        <div className="mb-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[var(--ink-muted)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">View-Only Access</p>
              <p className="text-xs text-[var(--ink-muted)]">
                You can view team members but only admins can invite or manage roles.
                Contact your organization admin to request elevated permissions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Role Legend */}
      <div className="mb-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4">Role Definitions</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Owner</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Full access. Can manage billing, delete org, and manage all members.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Admin</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Full access to portal data. Can invite members and manage roles.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Member</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Read-only access to portal data. Cannot invite members or change settings.
            </p>
          </div>
        </div>
      </div>
      
      {/* Team Members */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Team Members</h2>
            <p className="text-sm text-[var(--ink-muted)]">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
          {isOrgAdmin && (
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          )}
        </div>
        
        {/* Invite Form */}
        {showInviteForm && isOrgAdmin && (
          <form onSubmit={handleInvite} className="mb-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[var(--ink)] mb-2">Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--ink)] mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'member' | 'admin')}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {inviteError && (
              <p className="mt-3 text-sm text-red-600">{inviteError}</p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--paper-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={inviting || !inviteEmail}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-50"
              >
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        )}
        
        {/* Members List */}
        {membersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--ink-muted)]" />
          </div>
        ) : members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                    <span className="text-sm font-semibold text-[var(--accent-strong)]">
                      {(member.name || member.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {member.name || 'Unnamed User'}
                    </p>
                    <p className="text-xs text-[var(--ink-muted)]">{member.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.role === 'owner' 
                      ? 'bg-purple-100 text-purple-700'
                      : member.role === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {member.role}
                  </span>
                  {isOrgAdmin && member.clerkUserId !== meData?.user?.clerkUserId && (
                    <button className="p-2 text-[var(--ink-muted)] hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--ink-muted)]">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No team members found.</p>
            {isOrgAdmin && (
              <p className="text-xs mt-1">Click &quot;Invite Member&quot; to add someone.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TeamPage() {
  return (
    <Suspense fallback={<TeamSkeleton />}>
      <TeamPageContent />
    </Suspense>
  )
}
