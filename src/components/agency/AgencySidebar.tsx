import { 
  Home, 
  Users, 
  Building2, 
  Receipt, 
  CircleDollarSign,
  BarChart3,
  FileText
} from "lucide-react"
import { useNavigate } from "react-router-dom"
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

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/agence/admin",
    icon: Home,
  },
  {
    title: "Locataires",
    url: "/agence/locataires",
    icon: Users,
  },
  {
    title: "Biens",
    url: "/agence/biens",
    icon: Building2,
  },
  {
    title: "Ventes",
    url: "/agence/ventes",
    icon: Receipt,
  },
  {
    title: "Dépenses",
    url: "/agence/depenses",
    icon: CircleDollarSign,
  },
  {
    title: "Gains",
    url: "/agence/gains",
    icon: BarChart3,
  },
  {
    title: "Rapports",
    url: "/agence/rapports",
    icon: FileText,
  },
]

export function AgencySidebar() {
  const navigate = useNavigate()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)}>
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
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