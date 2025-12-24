'use client'

import { OrganizationProfile, useOrganization, useUser } from '@clerk/nextjs'
import { Shield, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TeamPage() {
  const { organization, membership } = useOrganization()
  const { user } = useUser()
  
  // Check if user is Koby staff
  const isKobyStaff = user?.publicMetadata?.kobyRole === 'staff'
  
  // Check if user is client admin (can manage team)
  const isClientAdmin = membership?.role === 'org:admin' || 
                        membership?.role === 'org:client_admin' ||
                        isKobyStaff
  
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
            Manage your organization
          </h1>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            Invite team members and manage roles for your organization.
          </p>
        </div>
        
        {organization && (
          <div className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-xs text-[var(--ink-muted)]">
            {organization.name}
          </div>
        )}
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
      
      {/* Permissions Notice */}
      {!isClientAdmin && !isKobyStaff && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Client Admin</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Full access to portal data. Can invite members, manage roles, and configure settings.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Client Viewer</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Read-only access to portal data. Cannot invite members or change settings.
            </p>
          </div>
        </div>
      </div>
      
      {/* Clerk Organization Profile */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border-0 bg-transparent',
              navbar: 'hidden',
              pageScrollBox: 'p-0',
              profileSection: 'border-[var(--line)]',
              profileSectionTitle: 'text-[var(--ink)]',
              profileSectionTitleText: 'text-sm font-semibold',
              profileSectionContent: 'text-[var(--ink-muted)]',
              accordionTriggerButton: 'text-[var(--ink)]',
              formButtonPrimary: 'bg-[var(--accent-strong)] hover:bg-[var(--accent)]',
              formFieldLabel: 'text-[var(--ink)]',
              formFieldInput: 'border-[var(--line)] bg-[var(--paper-muted)]',
              membershipWidget: 'border-[var(--line)]',
              membersPageInviteButton: isClientAdmin ? '' : 'hidden',
              tableHead: 'text-[var(--ink-muted)]',
            },
          }}
          routing="hash"
        />
      </div>
    </div>
  )
}
