'use client'

import { OrganizationList, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Building2, Users, Shield } from 'lucide-react'
import KobyLogo from '@/components/KobyLogo'

/**
 * Organization Selection Page
 * 
 * Access control:
 * - All authenticated users can select from orgs they belong to
 * - Only Koby staff (publicMetadata.kobyRole === 'staff') can create new orgs
 * - Regular clients cannot create orgs - they must be invited
 */
export default function SelectOrgPage() {
  const { user } = useUser()
  
  // Check if user is Koby staff - only staff can create organizations
  const isKobyStaff = user?.publicMetadata?.kobyRole === 'staff'
  
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
                  You can create new organizations and access any client portal.
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
          
          {/* Organization List - hideSlug to simplify, only show create for staff */}
          <OrganizationList
            hidePersonal
            afterSelectOrganizationUrl="/portal"
            afterCreateOrganizationUrl="/portal"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0 bg-transparent',
                organizationListCard: 'border border-[var(--line)] rounded-2xl',
                organizationListCardTitle: 'text-[var(--ink)]',
                organizationListCardSubtitle: 'text-[var(--ink-muted)]',
                organizationListPreviewButton: 'text-[var(--ink)] hover:bg-[var(--paper-muted)]',
                organizationListPreviewMainIdentifier: 'text-[var(--ink)]',
                // Hide the "Create organization" button for non-staff users
                organizationListCreateOrganizationActionButton: isKobyStaff ? '' : 'hidden',
              },
            }}
          />
          
          {/* No Organizations Message */}
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[var(--ink-muted)] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">Need access?</p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  {isKobyStaff
                    ? 'Create a new organization above, or select an existing one to access.'
                    : 'Ask your organization admin to invite you, or contact Koby support if you need a new organization set up.'}
                </p>
              </div>
            </div>
          </div>
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
