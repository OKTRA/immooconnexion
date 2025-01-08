import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, Home, Users, Receipt, PiggyBank, FileText, BarChart3 } from "lucide-react"
import { NavLink } from "react-router-dom"

const routes = [
  {
    label: "Tableau de bord",
    icon: BarChart3,
    href: "/agence/dashboard",
  },
  {
    label: "Appartements",
    icon: Building2,
    href: "/agence/apartments",
  },
  {
    label: "Propriétés",
    icon: Home,
    href: "/agence/properties",
  },
  {
    label: "Locataires",
    icon: Users,
    href: "/agence/tenants",
  },
  {
    label: "Contrats",
    icon: FileText,
    href: "/agence/contracts",
  },
  {
    label: "Revenus",
    icon: PiggyBank,
    href: "/agence/earnings",
  },
  {
    label: "Dépenses",
    icon: Receipt,
    href: "/agence/expenses",
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AgencySidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Menu
            </h2>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-1 p-2">
                {routes.map((route) => (
                  <NavLink
                    key={route.href}
                    to={route.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                        isActive ? "bg-accent" : "transparent"
                      )
                    }
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </NavLink>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}