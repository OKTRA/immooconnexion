import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Home,
  Receipt,
  Wallet,
  TrendingUp,
  FileText,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Tableau de bord",
    href: "/agence/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Locataires",
    href: "/agence/locataires",
    icon: Users,
  },
  {
    title: "Biens",
    href: "/agence/biens",
    icon: Home,
  },
  {
    title: "Ventes",
    href: "/agence/ventes",
    icon: Receipt,
  },
  {
    title: "Dépenses",
    href: "/agence/depenses",
    icon: Wallet,
  },
  {
    title: "Gains",
    href: "/agence/gains",
    icon: TrendingUp,
  },
  {
    title: "Rapports",
    href: "/agence/rapports",
    icon: FileText,
  },
]

const MenuContent = () => {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] pb-8">
      <div className="space-y-1 p-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", {
                  "justify-center": isCollapsed,
                })}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </div>
    </ScrollArea>
  )
}

export function AppSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed top-14 left-0 z-30 hidden h-screen w-[15%] min-w-[200px] border-r bg-background md:block">
        <MenuContent />
      </aside>

      {/* Mobile Menu Button - Always visible on mobile */}
      <div className="fixed top-3 left-2 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <MenuContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export const SidebarContent = MenuContent