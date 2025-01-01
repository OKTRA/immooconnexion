import { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div 
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
      }}
    >
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1400px] animate-fade-in">
        <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  )
}