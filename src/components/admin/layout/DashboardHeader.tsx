import { Separator } from "@/components/ui/separator"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Navigation } from "./header/Navigation"
import { NotificationsPopover } from "./header/NotificationsPopover"
import { UserMenu } from "./header/UserMenu"

export function DashboardHeader() {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dashboard-gradient-from/5 border-b border-white/10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <AnimatedLogo />
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <Navigation />
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationsPopover />
            <UserMenu />
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}