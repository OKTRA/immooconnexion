import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "./AgencySidebar"

interface AgencyLayoutProps {
  children: ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex">
          <AgencySidebar />
          <main className="flex-1 ml-[250px] p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}