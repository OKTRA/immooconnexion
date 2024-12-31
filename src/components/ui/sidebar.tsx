import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SidebarProps {
  className?: string
  children: ReactNode
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {children}
      </div>
    </div>
  )
}