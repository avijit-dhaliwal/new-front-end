import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export const runtime = 'edge'

/**
 * Sign-in page for the portal
 * 
 * Note: Sign-up is invite-only, so we don't show a sign-up link here.
 * Users can only create accounts through organization invitations.
 */
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] paper-texture flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <SignIn
          path="/sign-in"
          routing="path"
          forceRedirectUrl="/portal"
          appearance={{
            elements: {
              // Hide the sign-up link since we're invite-only
              footerActionLink: 'hidden',
              footerActionText: 'hidden',
            },
          }}
        />
        
        {/* Invite-only notice */}
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">Invite-only access</p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                Don&apos;t have an account? Koby AI portal access is by invitation only. 
                <Link href="/contact" className="text-[var(--accent)] hover:underline ml-1">
                  Contact us
                </Link>{' '}
                to request access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
