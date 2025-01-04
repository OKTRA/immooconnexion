import { Separator } from "@/components/ui/separator"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { UserMenu } from "./header/UserMenu"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Building2, LayoutDashboard, Settings, Users } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

export function SuperAdminHeader() {
  const navigate = useNavigate()

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dashboard-gradient-from/5 border-b border-white/10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <AnimatedLogo />
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white/80"
                onClick={() => navigate("/super-admin/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white/80"
                onClick={() => navigate("/super-admin/agencies")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Agences
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white/80"
                onClick={() => navigate("/super-admin/users")}
              >
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white/80"
                onClick={() => navigate("/super-admin/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </nav>
          </div>
          
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  )
}