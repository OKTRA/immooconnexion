import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Users, DollarSign, PieChart, Coins, FileBarChart } from "lucide-react"
import { Link } from "react-router-dom"

const menuItems = [
  { title: "Gestion des Biens", icon: Home, url: "/biens" },
  { title: "Gestion des Locataires", icon: Users, url: "/locataires" },
  { title: "Gestion des Dépenses", icon: DollarSign, url: "/depenses" },
  { title: "Gain d'Agence", icon: Coins, url: "/gains" },
  { title: "Rapports", icon: FileBarChart, url: "/rapports" },
  { title: "Gestion des Commissions", icon: PieChart, url: "/commissions" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}