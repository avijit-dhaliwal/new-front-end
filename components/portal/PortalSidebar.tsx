'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'
import KobyLogo from '@/components/KobyLogo'
import type { MeResponse, UserMembership } from '@/types/portal'
import { 
  LayoutDashboard, 
  Activity, 
  Workflow, 
  BookOpen, 
  Puzzle, 
  LineChart, 
  Flag,
  Users,
  Settings,
  Building2,
  AlertTriangle,
  Home,
  HelpCircle,
  Cloud
} from 'lucide-react'

const PORTAL_WORKER_URL = process.env.NEXT_PUBLIC_PORTAL_WORKER_URL || ''

const clientNavItems = [
  { label: 'Overview', href: '/portal#overview', icon: LayoutDashboard },
  { label: 'Live Ops', href: '/portal#operations', icon: Activity },
  { label: 'Automations', href: '/portal#automations', icon: Workflow },
  { label: 'Outcomes', href: '/portal#outcomes', icon: Flag },
  { label: 'Knowledge', href: '/portal#knowledge', icon: BookOpen },
  { label: 'Integrations', href: '/portal#integrations', icon: Puzzle },
  { label: 'Insights', href: '/portal#insights', icon: LineChart },
]

const internalNavItems = [
  { label: 'Overview', href: '/portal#overview', icon: LayoutDashboard },
  { label: 'Portfolio', href: '/portal#portfolio', icon: Building2 },
  { label: 'Cloudflare', href: '/portal#cloudflare-analytics', icon: Cloud },
  { label: 'Live Ops', href: '/portal#operations', icon: Activity },
  { label: 'Automations', href: '/portal#automations', icon: Workflow },
  { label: 'Outcomes', href: '/portal#outcomes', icon: Flag },
  { label: 'Insights', href: '/portal#insights', icon: LineChart },
  { label: 'Integrations', href: '/portal#integrations', icon: Puzzle },
]

const managementItems = [
  { label: 'Team & Access', href: '/portal/team', icon: Users },
  { label: 'Settings', href: '/portal/settings', icon: Settings },
]

export default function PortalSidebar() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const viewingOrgId = searchParams.get('orgId')
  
  const [meData, setMeData] = useState<MeResponse | null>(null)
  
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
  const viewingClientOrg = Boolean(viewingOrgId && viewingOrgId !== 'org_koby_internal')
  
  // Find current org
  const currentOrg = memberships.find((m: UserMembership) => m.orgId === activeOrgId)
  const orgName = currentOrg?.orgName || (activeOrgId ? `Org ${activeOrgId.slice(0, 8)}` : 'Loading...')
  
  // Koby staff viewing all clients (no specific org)
  const isStaffAllClientsView = isKobyTeamMember && !activeOrgId
  const navItems = isInternalOrgView ? internalNavItems : clientNavItems
  const orgLabel = viewingClientOrg ? 'Client org' : 'Organization'

  // Build href with orgId if viewing a specific client
  const buildHref = (baseHref: string) => {
    if (viewingOrgId) {
      const [path, hash] = baseHref.split('#')
      return `${path}?orgId=${viewingOrgId}${hash ? `#${hash}` : ''}`
    }
    return baseHref
  }
  
  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-72 lg:flex-col border-r border-[var(--line)] bg-[var(--paper)]">
      <div className="flex h-full flex-col px-6 py-8">
        <Link href="/" className="flex items-center gap-3">
          <KobyLogo className="w-9 h-9" />
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">Koby AI</p>
            <p className="text-xs text-[var(--ink-muted)]">
              {isInternalOrgView ? 'Ops Portal' : isKobyTeamMember ? 'Team View' : 'Client Portal'}
            </p>
          </div>
        </Link>
        
        {/* Koby Staff: Workspace Navigation */}
        {isKobyTeamMember && (
          <nav className="mt-8 space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-3 px-3">Koby Ops</p>
            <Link
              href="/portal?orgId=org_koby_internal"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isInternalOrgView
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)] font-medium'
                  : 'text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Internal Dashboard
            </Link>
            <Link
              href="/portal?filter=at-risk"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                searchParams.get('filter') === 'at-risk'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium'
                  : 'text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              At Risk
            </Link>
          </nav>
        )}
        
        {/* Current Organization Display */}
        {activeOrgId && (
          <div className="mt-6">
            {isKobyTeamMember && viewingClientOrg && (
              <Link
                href="/portal?orgId=org_koby_internal"
                className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors mb-2"
              >
                <span>&larr;</span>
                <span>Back to internal dashboard</span>
              </Link>
            )}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--ink-muted)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--ink-muted)]">{orgLabel}</p>
                  <p className="text-sm font-medium text-[var(--ink)] truncate">
                    {orgName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Koby Staff indicator when no org selected */}
        {isStaffAllClientsView && (
          <div className="mt-6 rounded-xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] p-3">
            <p className="text-xs font-medium text-[var(--accent-strong)]">Koby Ops View</p>
            <p className="text-xs text-[var(--ink-muted)] mt-1">Select a client to view their portal</p>
          </div>
        )}

        {/* Main Navigation - only show when viewing a specific org */}
        {!isStaffAllClientsView && activeOrgId && (
          <>
            <nav className="mt-8 space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-3 px-3">Dashboard</p>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={buildHref(item.href)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)] transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Management Section */}
            <nav className="mt-8 space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-3 px-3">Management</p>
              {managementItems.map((item) => (
                <Link
                  key={item.label}
                  href={buildHref(item.href)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)] transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        <div className="mt-auto">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Quick links</p>
            <div className="mt-3 space-y-2">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm text-[var(--ink)] hover:text-[var(--accent-strong)]"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Request support
              </Link>
              <Link
                href="/schedule-meeting"
                className="flex items-center gap-2 text-sm text-[var(--ink)] hover:text-[var(--accent-strong)]"
              >
                <Users className="h-3.5 w-3.5" />
                Schedule review
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-[var(--ink)] hover:text-[var(--accent-strong)]"
              >
                <Home className="h-3.5 w-3.5" />
                Back to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
