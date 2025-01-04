import { ReactNode } from "react"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { Outlet } from "react-router-dom"

interface AgencyLayoutProps {
  children?: ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />
      <main className="flex-1 p-4 md:p-8 mt-[60px]">
        {children || <Outlet />}
      </main>
    </div>
  )
}