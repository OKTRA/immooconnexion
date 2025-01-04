import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "./AgencySidebar"
import { GlobalHeader } from "@/components/layout/GlobalHeader"

interface AgencyLayoutProps {
  children: ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <GlobalHeader />
        <AgencySidebar />
        <main className="ml-[250px] pt-[60px] flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}