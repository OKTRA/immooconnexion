import { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {children}
    </div>
  )
}