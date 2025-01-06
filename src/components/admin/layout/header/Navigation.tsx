import { useNavigate } from "react-router-dom"
import { 
  ChartBar,
  Users,
  Building2,
  CreditCard,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"

const navItems = [
  { icon: ChartBar, label: "Tableau de bord", path: "/properties" },
  { icon: Building2, label: "Biens", path: "/agence/biens" },
  { icon: Users, label: "Appartements", path: "/agence/appartements" },
  { icon: CreditCard, label: "Ventes", path: "/agence/ventes" },
  { icon: History, label: "Dépenses", path: "/agence/depenses" },
]

export function Navigation() {
  const navigate = useNavigate()

  return (
    <TooltipProvider>
      <nav className="flex items-center gap-2">
        {navItems.map((item) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  )
}