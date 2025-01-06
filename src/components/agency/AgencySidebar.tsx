import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Building2, 
  Home, 
  DollarSign, 
  LayoutDashboard,
  Users,
  Receipt,
  PieChart,
  Wallet
} from "lucide-react"
import { NavLink } from "react-router-dom"

interface AgencySidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AgencySidebar({ className }: AgencySidebarProps) {
  return (
    <div className={cn("fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-white lg:block dark:bg-gray-950", className)}>
      <ScrollArea className="h-full py-6">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <NavLink to="/">
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
              <NavLink to="/agence/locataires">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Locataires
                  </Button>
                )}
              </NavLink>
              <NavLink to="/agence/depenses">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Dépenses
                  </Button>
                )}
              </NavLink>
              <NavLink to="/agence/gains">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Gains
                  </Button>
                )}
              </NavLink>
              <NavLink to="/agence/rapports">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <PieChart className="mr-2 h-4 w-4" />
                    Rapports
                  </Button>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}