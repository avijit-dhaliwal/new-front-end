import Link from 'next/link'
import KobyLogo from '@/components/KobyLogo'

const navItems = [
  { label: 'Overview', href: '/portal#overview' },
  { label: 'Live Ops', href: '/portal#operations' },
  { label: 'Automations', href: '/portal#automations' },
  { label: 'Knowledge', href: '/portal#knowledge' },
  { label: 'Integrations', href: '/portal#integrations' },
  { label: 'Insights', href: '/portal#insights' },
  { label: 'Team & Access', href: '/portal#team' },
]

const quickLinks = [
  { label: 'Request a demo', href: '/contact' },
  { label: 'Schedule review', href: '/schedule-meeting' },
  { label: 'Back to site', href: '/' },
]

export default function PortalSidebar() {
  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-72 lg:flex-col border-r border-[var(--line)] bg-[var(--paper)]">
      <div className="flex h-full flex-col px-6 py-8">
        <Link href="/" className="flex items-center gap-3">
          <KobyLogo className="w-9 h-9" />
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">Koby AI</p>
            <p className="text-xs text-[var(--ink-muted)]">Client portal</p>
          </div>
        </Link>

        <nav className="mt-10 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-xl px-3 py-2 text-sm text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Quick links</p>
            <div className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[var(--ink)] hover:text-[var(--accent-strong)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
