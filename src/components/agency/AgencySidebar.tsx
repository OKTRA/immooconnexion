import { Home, Users, Building2, Receipt, PiggyBank, CreditCard } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

const menuItems = [
  { href: "/agence", label: "Accueil", icon: Home },
  { href: "/agence/tenants", label: "Locataires", icon: Users },
  { href: "/agence/properties", label: "Propriétés", icon: Building2 },
  { href: "/agence/contracts", label: "Contrats", icon: Receipt },
  { href: "/agence/earnings", label: "Gains", icon: PiggyBank },
  { href: "/agence/billing", label: "Facturation", icon: CreditCard },
]

export function AgencySidebar() {
  const location = useLocation()
  const isMobile = useIsMobile()

  return (
    <Sidebar className={cn(
      "fixed top-[60px] left-0 h-[calc(100vh-60px)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 w-[250px] transition-transform duration-300 ease-in-out z-50",
      isMobile ? "-translate-x-full mobile-sidebar" : ""
    )}>
      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
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
            {item.icon && <item.icon className="h-5 w-5" />}
            {item.label}
          </Link>
        ))}
      </div>
    </Sidebar>
  )
}
