import { ReactNode } from "react"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { Outlet } from "react-router-dom"

export function AgencyLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />
      <main className="flex-1 p-4 md:p-8 mt-[60px]">
        <Outlet />
      </main>
    </div>
  )
}