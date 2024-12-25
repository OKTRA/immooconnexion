import { BarChart3, Building2, CircleDollarSign, FileText, Users, Wallet } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

export const navigationItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: BarChart3,
  },
  {
    title: "Locataires",
    path: "/locataires",
    icon: Users,
  },
  {
    title: "Biens",
    path: "/biens",
    icon: Building2,
  },
  {
    title: "Dépenses",
    path: "/depenses",
    icon: Wallet,
  },
  {
    title: "Gains",
    path: "/gains",
    icon: CircleDollarSign,
  },
  {
    title: "Rapports",
    path: "/rapports",
    icon: FileText,
  },
]

export function SidebarNavItems() {
  const location = useLocation()

  return (
    <SidebarMenu>
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className="relative"
            data-active={location.pathname === item.path}
          >
            <Link to={item.path} className="group">
              <item.icon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{item.title}</span>
              {location.pathname === item.path && (
                <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}