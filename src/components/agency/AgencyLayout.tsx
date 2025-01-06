import { AgencySidebar } from "./AgencySidebar"
import { SubscriptionNotification } from "../subscription/SubscriptionNotification"

interface AgencyLayoutProps {
  children: React.ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AgencySidebar />
      <main className="flex-1 p-8">
        <SubscriptionNotification />
        {children}
      </main>
    </div>
  )
}