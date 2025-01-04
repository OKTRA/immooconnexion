import { Link, useLocation } from "react-router-dom"
import {
  Building,
  Building2,
  Home,
  Users,
  Wallet,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AgencySidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      title: "Tableau de bord",
      icon: Home,
      path: "/agence/dashboard",
    },
    {
      title: "Biens",
      icon: Building,
      path: "/agence/biens",
    },
    {
      title: "Unités/Appartements",
      icon: Building2,
      path: "/agence/unites",
    },
    {
      title: "Locataires",
      icon: Users,
      path: "/agence/locataires",
    },
    {
      title: "Revenus",
      icon: Wallet,
      path: "/agence/revenus",
    },
    {
      title: "Contrats",
      icon: FileText,
      path: "/agence/contrats",
    },
    {
      title: "Rapports",
      icon: BarChart3,
      path: "/agence/rapports",
    },
    {
      title: "Paramètres",
      icon: Settings,
      path: "/agence/parametres",
    },
  ]

  return (
    <Sidebar className="fixed left-0 top-0 z-20 h-screen w-[250px] border-r bg-background pt-16">
      <SidebarContent>
        <div className="flex flex-col gap-2 p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent ${
                          isActive(item.path)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}