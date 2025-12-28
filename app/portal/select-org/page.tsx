'use client'

import { useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Users, Shield, Loader2 } from 'lucide-react'
import KobyLogo from '@/components/KobyLogo'
import type { MeResponse, UserMembership } from '@/types/portal'

const PORTAL_WORKER_URL = process.env.NEXT_PUBLIC_PORTAL_WORKER_URL || ''

/**
 * Organization Selection Page (D1-based)
 * 
 * Shows organizations the user belongs to from D1 database.
 * Koby staff can see all orgs.
 */
export default function SelectOrgPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [meData, setMeData] = useState<MeResponse | null>(null)
  const [allOrgs, setAllOrgs] = useState<Array<{ id: string; name: string; slug?: string; status: string; plan: string }>>([])
  
  const isKobyStaff = meData?.user?.isKobyStaff || false
  const memberships = meData?.memberships || []
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        const token = await getToken()
        if (!token || !PORTAL_WORKER_URL) {
          setLoading(false)
          return
        }
        
        // Fetch user info
        const meResponse = await fetch(`${PORTAL_WORKER_URL}/portal/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        
        if (meResponse.ok) {
          const data: MeResponse = await meResponse.json()
          setMeData(data)
          
          // If user has exactly one org, redirect directly to portal
          if (data.memberships.length === 1) {
            router.push(`/portal?orgId=${data.memberships[0].orgId}`)
            return
          }
          
          // If staff, also fetch all orgs
          if (data.user.isKobyStaff) {
            const orgsResponse = await fetch(`${PORTAL_WORKER_URL}/portal/orgs`, {
              headers: { 'Authorization': `Bearer ${token}` },
            })
            if (orgsResponse.ok) {
              const orgsData = await orgsResponse.json()
              setAllOrgs(orgsData.orgs || [])
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user, getToken, router])
  
  const handleSelectOrg = (orgId: string) => {
    router.push(`/portal?orgId=${orgId}`)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-strong)]" />
      </div>
    )
  }
  
  // Determine which orgs to show
  const orgsToShow = isKobyStaff ? allOrgs : memberships.map(m => ({
    id: m.orgId,
    name: m.orgName,
    slug: m.orgSlug,
    status: m.orgStatus || 'active',
    plan: m.orgPlan || 'chatbot',
  }))
  
  return (
    <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <KobyLogo className="w-10 h-10" />
            <div>
              <p className="text-lg font-semibold text-[var(--ink)]">Koby AI</p>
              <p className="text-xs text-[var(--ink-muted)]">Client Portal</p>
            </div>
          </Link>
        </div>
        
        {/* Koby Staff Badge */}
        {isKobyStaff && (
          <div className="mb-4 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[var(--accent-strong)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--accent-strong)]">Koby Staff Access</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  You can access any client portal.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Card */}
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[var(--shadow-soft)]">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-[var(--accent-strong)]" />
            </div>
            <h1 className="text-2xl font-display font-semibold text-[var(--ink)]">
              Select an organization
            </h1>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Choose an organization to access your portal dashboard.
            </p>
          </div>
          
          {/* Organization List */}
          {orgsToShow.length > 0 ? (
            <div className="space-y-3">
              {orgsToShow.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrg(org.id)}
                  className="w-full text-left rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 hover:bg-[var(--paper-muted)] hover:border-[var(--accent-soft)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{org.name}</p>
                      <p className="text-xs text-[var(--ink-muted)] mt-1">
                        {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)} Plan
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      org.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : org.status === 'at_risk'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {org.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--ink-muted)]">No organizations found.</p>
            </div>
          )}
          
          {/* No Organizations Message */}
          {!isKobyStaff && orgsToShow.length === 0 && (
            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[var(--ink-muted)] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Need access?</p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    Contact Koby support to get set up with an organization.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Back link */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
