import Link from 'next/link'
import { Shield, ArrowRight, Mail } from 'lucide-react'
import KobyLogo from '@/components/KobyLogo'

export const runtime = 'edge'

/**
 * Sign-up is disabled for public access.
 * 
 * Koby AI uses an invite-only onboarding model:
 * 1. KobyAI staff creates an organization in Clerk Dashboard
 * 2. Staff invites the client admin via email
 * 3. Client receives invitation and signs up through the invite link
 * 4. Client can then invite additional teammates within their org
 * 
 * This page shows an informational message and redirects users to sign-in.
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] paper-texture flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
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
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[var(--accent-strong)]" />
            </div>
            <h1 className="text-2xl font-display font-semibold text-[var(--ink)]">
              Invite-only access
            </h1>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              Koby AI portal access is by invitation only. New accounts can only be created through an organization invitation.
            </p>
          </div>

          {/* Info boxes */}
          <div className="space-y-4 mb-6">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[var(--ink-muted)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Have an invitation?</p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    Check your email for an invitation link from Koby AI. Click the link to create your account and join your organization.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-muted)] p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[var(--ink-muted)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Need access?</p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    Contact your organization admin or reach out to Koby AI support to request an invitation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] transition-colors"
            >
              Already have an account? Sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full rounded-full border border-[var(--line)] bg-[var(--panel)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors"
            >
              Contact Koby AI support
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
