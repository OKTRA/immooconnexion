import { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1400px]">
      {children}
    </div>
  )
}