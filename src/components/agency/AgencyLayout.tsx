import { ReactNode } from "react"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { AgencySidebar } from "@/components/agency/AgencySidebar"
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"

interface AgencyLayoutProps {
  children?: ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <GlobalHeader />
        <div className="flex flex-1">
          <AgencySidebar />
          <main className="flex-1 p-4 md:p-8 mt-[60px] ml-[250px]">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}