import { 
  LayoutDashboard,
  Users,
  Building2,
  Receipt,
  CircleDollarSign,
  BarChart2,
  FileText,
  CreditCard,
  Building
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

const menuItems = [
  {
    title: "Tableau de bord",
    href: "/agence/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Locataires",
    href: "/agence/tenants",
    icon: Users,
  },
  {
    title: "Biens",
    href: "/agence/properties",
    icon: Building2,
  },
  {
    title: "Appartements",
    href: "/agence/apartments",
    icon: Building,
  },
  {
    title: "Ventes",
    href: "/agence/sales",
    icon: Receipt,
  },
  {
    title: "Dépenses",
    href: "/agence/expenses",
    icon: CircleDollarSign,
  },
  {
    title: "Gains",
    href: "/agence/earnings",
    icon: BarChart2,
  },
  {
    title: "Rapports",
    href: "/agence/reports",
    icon: FileText,
  },
  {
    title: "Abonnement",
    href: "/agence/subscription",
    icon: CreditCard,
  },
]

export function AgencySidebar() {
  const location = useLocation()
  const isMobile = useIsMobile()

  return (
    <Sidebar className={cn(
      "fixed top-[3.5rem] left-0 h-[calc(100vh-3.5rem)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 w-[250px] transition-transform duration-300 ease-in-out",
      isMobile ? "-translate-x-full mobile-sidebar" : ""
    )}>
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => {
              if (isMobile) {
                document.querySelector('.mobile-sidebar')?.classList.remove('translate-x-0')
              }
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              location.pathname === item.href && 
              "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </Sidebar>
  )
}