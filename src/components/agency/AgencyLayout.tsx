import { AgencySidebar } from "./AgencySidebar"
import { SubscriptionNotification } from "../subscription/SubscriptionNotification"
import { SidebarProvider } from "@/components/ui/sidebar"
import { GlobalHeader } from "../layout/GlobalHeader"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface AgencyLayoutProps {
  children: React.ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white">
        <GlobalHeader />
        <div className="flex pt-14 min-h-[calc(100vh-3.5rem)]">
          <AgencySidebar />
          <main className={cn(
            "flex-1 p-4 md:p-8",
            !isMobile && "ml-[250px]"
          )}>
            <SubscriptionNotification />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}