import { AgencySidebar } from "./AgencySidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { GlobalHeader } from "../layout/GlobalHeader"
import { MainContent } from "./layout/MainContent"

interface AgencyLayoutProps {
  children: React.ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white">
        <GlobalHeader />
        <div className="flex pt-14 min-h-[calc(100vh-3.5rem)]">
          <AgencySidebar />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </SidebarProvider>
  )
}