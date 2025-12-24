import { Suspense } from 'react'
import PortalSidebar from '@/components/portal/PortalSidebar'
import PortalHeader from '@/components/portal/PortalHeader'

// Loading fallback for sidebar
function SidebarSkeleton() {
  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-72 lg:flex-col border-r border-[var(--line)] bg-[var(--paper)]">
      <div className="flex h-full flex-col px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--paper-muted)] animate-pulse" />
          <div>
            <div className="h-4 w-16 bg-[var(--paper-muted)] rounded animate-pulse" />
            <div className="h-3 w-20 bg-[var(--paper-muted)] rounded animate-pulse mt-1" />
          </div>
        </div>
        <div className="mt-10 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[var(--paper-muted)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </aside>
  )
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <Suspense fallback={<SidebarSkeleton />}>
        <PortalSidebar />
      </Suspense>
      <div className="lg:pl-72">
        <PortalHeader />
        <main className="px-6 pb-16">
          {children}
        </main>
      </div>
    </div>
  )
}
