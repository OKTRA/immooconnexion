import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

type SidebarState = "expanded" | "collapsed"

const SidebarContext = createContext<{
  state: SidebarState
  setState: (state: SidebarState) => void
} | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>("expanded")

  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {children}
      </div>
    </div>
  )
}