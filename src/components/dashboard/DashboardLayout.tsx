import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-border bg-background">
        {/* AppSidebar is already a separate component */}
        <AppSidebar />
      </div>
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}