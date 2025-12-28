'use client'

import { useEffect, useState } from 'react'
import { UserButton, useUser, useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, Building2, ChevronDown } from 'lucide-react'
import type { MeResponse, UserMembership } from '@/types/portal'

const PORTAL_WORKER_URL = process.env.NEXT_PUBLIC_PORTAL_WORKER_URL || ''

export default function PortalHeader() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  
  const [meData, setMeData] = useState<MeResponse | null>(null)
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  
  const viewingOrgId = searchParams.get('orgId')
  
  // Fetch user data from D1
  useEffect(() => {
    const fetchMe = async () => {
      if (!user) return
      try {
        const token = await getToken()
        if (!token || !PORTAL_WORKER_URL) return
        
        const response = await fetch(`${PORTAL_WORKER_URL}/portal/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (response.ok) {
          setMeData(await response.json())
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }
    fetchMe()
  }, [user, getToken])
  
  const isKobyStaff = meData?.user?.isKobyStaff || false
  const memberships = meData?.memberships || []
  const defaultOrgId = memberships[0]?.orgId || null
  const activeOrgId = viewingOrgId || meData?.currentOrgId || defaultOrgId
  const isInternalOrgView = activeOrgId === 'org_koby_internal'
  const isKobyTeamMember = isKobyStaff || memberships.some((m: UserMembership) => m.orgId === 'org_koby_internal')
  
  // Find current org name
  const currentOrg = memberships.find((m: UserMembership) => m.orgId === activeOrgId)
  const currentOrgName = currentOrg?.orgName || (activeOrgId ? `Org ${activeOrgId.slice(0, 8)}` : 'No organization')
  
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Organization info / Koby staff badge */}
          <div className="flex items-center gap-3">
            {isInternalOrgView ? (
              <div className="flex items-center gap-2 rounded-full border border-[var(--accent-soft)] bg-[var(--accent-soft)] px-3 py-1.5">
                <Shield className="w-4 h-4 text-[var(--accent-strong)]" />
                <span className="text-xs font-semibold text-[var(--accent-strong)]">Koby Ops</span>
              </div>
            ) : activeOrgId ? (
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5">
                <Building2 className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-xs font-medium text-[var(--ink)]">{currentOrgName}</span>
              </div>
            ) : null}
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              {isInternalOrgView ? 'Koby AI Ops' : 'Koby AI Portal'}
            </p>
            <h1 className="text-lg font-semibold text-[var(--ink)]">
              {isInternalOrgView ? 'Operations command center' : 'Operations overview'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Koby staff: Note about accessing any org */}
          {isKobyTeamMember && (
            <p className="hidden lg:block text-xs text-[var(--ink-muted)] max-w-[200px]">
              You can view any client organization
            </p>
          )}
          
          {/* Organization Switcher (D1-based) */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors"
            >
              <span>{activeOrgId ? currentOrgName : 'No organization selected'}</span>
              <ChevronDown className="w-4 h-4 text-[var(--ink-muted)]" />
            </button>
            
            {showOrgDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowOrgDropdown(false)} 
                />
                <div className="absolute right-0 top-full mt-2 w-64 z-20 rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-[var(--line)]">
                    <p className="text-xs font-semibold text-[var(--ink-muted)] px-2">Your Organizations</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {memberships.length > 0 ? (
                      memberships.map((m: UserMembership) => (
                        <Link
                          key={m.orgId}
                          href={`/portal?orgId=${m.orgId}`}
                          onClick={() => setShowOrgDropdown(false)}
                          className={`block px-4 py-3 text-sm hover:bg-[var(--paper-muted)] transition-colors ${
                            m.orgId === activeOrgId ? 'bg-[var(--accent-soft)]' : ''
                          }`}
                        >
                          <p className="font-medium text-[var(--ink)]">{m.orgName}</p>
                          <p className="text-xs text-[var(--ink-muted)]">{m.role}</p>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-[var(--ink-muted)]">
                        No organizations
                      </div>
                    )}
                  </div>
                  {isKobyStaff && (
                    <div className="p-2 border-t border-[var(--line)]">
                      <Link
                        href="/portal/select-org"
                        onClick={() => setShowOrgDropdown(false)}
                        className="block w-full text-center px-4 py-2 text-xs font-medium text-[var(--accent-strong)] hover:bg-[var(--accent-soft)] rounded-lg transition-colors"
                      >
                        View all organizations
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          <Link
            href="/contact"
            className="hidden sm:inline-flex rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-muted)]"
          >
            Request support
          </Link>
          
          <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--ink-muted)]">
            Status: Live
          </div>
          
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
