'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function PortalHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Koby AI Portal</p>
          <h1 className="text-lg font-semibold text-[var(--ink)]">Operations overview</h1>
        </div>
        <div className="flex items-center gap-3">
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
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </header>
  )
}
