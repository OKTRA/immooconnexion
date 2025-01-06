import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, Home, DollarSign, LayoutDashboard } from "lucide-react"
import { NavLink } from "react-router-dom"

interface AgencySidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AgencySidebar({ className }: AgencySidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink to="/agence/dashboard">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Button>
              )}
            </NavLink>
            <NavLink to="/agence/biens">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Biens
                </Button>
              )}
            </NavLink>
            <NavLink to="/agence/appartements">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Appartements
                </Button>
              )}
            </NavLink>
            <NavLink to="/agence/ventes">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Ventes
                </Button>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}