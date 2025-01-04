import { AgencySidebar } from "./AgencySidebar"

interface AgencyLayoutProps {
  children: React.ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AgencySidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <a className="mr-6 flex items-center space-x-2" href="/agence/admin">
                <span className="hidden font-bold sm:inline-block">
                  Tableau de bord
                </span>
              </a>
            </div>
          </div>
        </header>
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  )
}