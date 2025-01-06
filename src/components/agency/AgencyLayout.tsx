import { AgencySidebar } from "./AgencySidebar"
import { SubscriptionNotification } from "../subscription/SubscriptionNotification"
import { SidebarProvider } from "@/components/ui/sidebar"
import { GlobalHeader } from "../layout/GlobalHeader"

interface AgencyLayoutProps {
  children: React.ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <GlobalHeader />
        <div className="flex pt-14 min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-dashboard-gradient-from to-dashboard-gradient-to">
          <AgencySidebar />
          <main className="flex-1 p-8 ml-[250px]">
            <SubscriptionNotification />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}