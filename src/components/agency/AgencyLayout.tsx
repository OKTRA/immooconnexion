import { AgencySidebar } from "./AgencySidebar"
import { SubscriptionNotification } from "../subscription/SubscriptionNotification"
import { SidebarProvider } from "@/components/ui/sidebar"

interface AgencyLayoutProps {
  children: React.ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AgencySidebar />
        <main className="flex-1 p-8">
          <SubscriptionNotification />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}