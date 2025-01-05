import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { clearSession } from "@/utils/sessionUtils"

export function LogoutButton() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // Clear session first to prevent race conditions
      clearSession()
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        toast({
          title: "Session terminée",
          description: "Votre session a été terminée",
        })
      } else {
        toast({
          title: "Déconnexion réussie",
          description: "Vous avez été déconnecté avec succès",
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always navigate to login page
      navigate("/login")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
    >
      <LogOut className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Déconnexion</span>
    </Button>
  )
}