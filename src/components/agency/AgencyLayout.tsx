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
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
        <GlobalHeader />
        <div className="flex-1 flex overflow-hidden pt-14">
          <AgencySidebar />
          <main className={`flex-1 p-4 md:p-8 overflow-y-auto ${!isMobile ? 'ml-[250px]' : ''}`}>
            <div className="w-full max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}