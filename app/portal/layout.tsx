import PortalSidebar from '@/components/portal/PortalSidebar'
import PortalHeader from '@/components/portal/PortalHeader'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <PortalSidebar />
      <div className="lg:pl-72">
        <PortalHeader />
        <main className="px-6 pb-16">
          {children}
        </main>
      </div>
    </div>
  )
}
