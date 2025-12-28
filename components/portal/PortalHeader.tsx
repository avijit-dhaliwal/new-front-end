'use client'

import { UserButton, OrganizationSwitcher, useOrganization, useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, Building2 } from 'lucide-react'
import { isKobyInternalOrg } from '@/lib/koby-org'

export default function PortalHeader() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const searchParams = useSearchParams()
  
  // Check if user is Koby staff
  const isKobyStaff = user?.publicMetadata?.kobyRole === 'staff'
  const viewingOrgId = searchParams.get('orgId')
  const activeOrgId = viewingOrgId || organization?.id || null
  const isInternalOrgView = isKobyInternalOrg(activeOrgId)
  const isKobyTeamMember = isKobyStaff || isKobyInternalOrg(organization?.id)
  const viewingClientOrg = Boolean(viewingOrgId && !isKobyInternalOrg(viewingOrgId))
  
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
            ) : viewingClientOrg ? (
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5">
                <Building2 className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-xs font-medium text-[var(--ink)]">
                  Client {viewingOrgId?.slice(0, 8)}
                </span>
              </div>
            ) : organization ? (
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5">
                <Building2 className="w-4 h-4 text-[var(--ink-muted)]" />
                <span className="text-xs font-medium text-[var(--ink)]">{organization.name}</span>
              </div>
            ) : null}
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              {isInternalOrgView
                ? 'Koby AI Ops'
                : viewingClientOrg
                ? 'Client View'
                : 'Koby AI Portal'}
            </p>
            <h1 className="text-lg font-semibold text-[var(--ink)]">
              {isInternalOrgView
                ? 'Operations command center'
                : viewingClientOrg
                ? 'Client operations'
                : 'Operations overview'}
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
          
          {/* Organization Switcher - Hide create org for non-staff */}
          <OrganizationSwitcher
            hidePersonal
            afterSelectOrganizationUrl="/portal"
            afterCreateOrganizationUrl="/portal"
            appearance={{
              elements: {
                rootBox: 'flex items-center',
                organizationSwitcherTrigger: 'rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors',
                organizationSwitcherTriggerIcon: 'text-[var(--ink-muted)]',
                organizationPreviewMainIdentifier: 'text-[var(--ink)]',
                organizationPreviewSecondaryIdentifier: 'text-[var(--ink-muted)]',
                // Hide create organization for non-staff
                organizationSwitcherPopoverActionButton__createOrganization: isKobyStaff ? '' : 'hidden',
              },
            }}
          />
          
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
