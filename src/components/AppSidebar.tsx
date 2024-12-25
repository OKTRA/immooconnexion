import { useNavigate } from "react-router-dom"
import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { supabase } from "@/integrations/supabase/client"
import { getSupabaseSessionKey } from "@/utils/sessionUtils"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent as BaseSidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { SidebarNavItems } from "./sidebar/SidebarNavItems"

// Export the SidebarContent component for reuse
export function SidebarContent() {
  return (
    <BaseSidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarNavItems />
        </SidebarGroupContent>
      </SidebarGroup>
    </BaseSidebarContent>
  )
}

export function AppSidebar() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const handleLogout = async () => {
    const storageKey = getSupabaseSessionKey()
    
    try {
      await supabase.auth.signOut()
      localStorage.removeItem(storageKey)
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
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
    <Sidebar>
      <SidebarContent />
      <SidebarFooter className="border-t p-4 space-y-2">
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
      </SidebarFooter>
    </Sidebar>
  )
}