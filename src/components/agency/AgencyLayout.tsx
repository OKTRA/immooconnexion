import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "./AgencySidebar"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgencyLayoutProps {
  children: ReactNode
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <GlobalHeader />
        <div className="flex-1 flex">
          <AgencySidebar />
          <main className={`flex-1 p-4 md:p-8 ${!isMobile ? 'ml-[250px]' : ''}`}>
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon"
                className="mb-4 -ml-2"
                onClick={() => document.querySelector('.mobile-sidebar')?.classList.toggle('translate-x-0')}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}