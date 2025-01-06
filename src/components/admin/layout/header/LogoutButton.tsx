import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // Clear any existing session from localStorage
      localStorage.removeItem('supabase.auth.token')
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error && error.message !== "session_not_found") {
        console.error('Logout error:', error)
        toast({
          title: "Erreur de déconnexion",
          description: "Une erreur est survenue lors de la déconnexion",
          variant: "destructive"
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