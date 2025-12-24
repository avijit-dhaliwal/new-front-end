'use client'

import { OrganizationList, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Building2, Users } from 'lucide-react'
import KobyLogo from '@/components/KobyLogo'

export default function SelectOrgPage() {
  const { user } = useUser()
  
  // Check if user is Koby staff
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
                  Ask your organization admin to invite you, or contact Koby support if you need a new organization set up.
                </p>
              </div>
            </div>
          </div>
          
          {/* Koby Staff Shortcut */}
          {isKobyStaff && (
            <div className="mt-6">
              <Link
                href="/portal"
                className="block w-full text-center rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)] hover:bg-[var(--accent-strong)] hover:text-white transition-colors"
              >
                Continue as Koby Staff (All Clients View)
              </Link>
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
