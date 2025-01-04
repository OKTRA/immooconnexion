import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "./AgencySidebar"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { useIsMobile } from "@/hooks/use-mobile"

interface AgencyLayoutProps {
  children: ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <GlobalHeader />
        <div className="flex-1 flex">
          <AgencySidebar />
          <main className={`flex-1 p-4 md:p-8 ${!isMobile ? 'ml-[250px]' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}