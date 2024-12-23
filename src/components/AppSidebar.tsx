import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  BarChart3,
  Building2,
  CircleDollarSign,
  FileText,
  LogOut,
  Menu,
  Moon,
  Sun,
  Users,
  Wallet,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // First clear the session from localStorage
      const storageKey = `sb-${supabase.getClientConfig().supabaseUrl?.split('//')[1]}-auth-token`
      localStorage.removeItem(storageKey)
      
      // Then attempt to sign out from Supabase
      await supabase.auth.signOut()
      
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if the signOut fails, we still want to clear local session and redirect
      const storageKey = `sb-${supabase.getClientConfig().supabaseUrl?.split('//')[1]}-auth-token`
      localStorage.removeItem(storageKey)
      navigate("/login")
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté",
      })
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/locataires">
              <Button
                variant={
                  location.pathname === "/locataires" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Locataires
              </Button>
            </Link>
            <Link to="/biens">
              <Button
                variant={location.pathname === "/biens" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Biens
              </Button>
            </Link>
            <Link to="/depenses">
              <Button
                variant={location.pathname === "/depenses" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Dépenses
              </Button>
            </Link>
            <Link to="/gains">
              <Button
                variant={location.pathname === "/gains" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Gains
              </Button>
            </Link>
            <Link to="/rapports">
              <Button
                variant={location.pathname === "/rapports" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapports
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              {theme === "dark" ? "Mode clair" : "Mode sombre"}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppSidebar({ className }: SidebarProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <ScrollArea className="h-full">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return <SidebarContent />
}