import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: (expanded: boolean) => void
} | null>(null)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = React.useState(true)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("Sidebar must be used within SidebarProvider")
  }

  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-gray-950 border-r transition-all duration-300",
        context.expanded ? "w-64" : "w-16",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 space-y-4", className)}>
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("SidebarGroupLabel must be used within SidebarProvider")
  }

  if (!context.expanded) {
    return null
  }

  return (
    <div className={cn("text-sm font-semibold text-gray-500", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function SidebarMenuButton({ className, active, children, ...props }: SidebarMenuButtonProps) {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("SidebarMenuButton must be used within SidebarProvider")
  }

  return (
    <button
      className={cn(
        "w-full flex items-center px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
        active && "bg-gray-100 dark:bg-gray-800",
        !context.expanded && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}