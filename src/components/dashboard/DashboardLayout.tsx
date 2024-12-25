import { ReactNode } from "react"
import { AppSidebar } from "@/components/AppSidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-border bg-background">
        <AppSidebar />
      </div>
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}