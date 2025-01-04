import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LogoutButton() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // D'abord, on récupère la session actuelle
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Si pas de session, rediriger vers login
        navigate("/agence/login")
        return
      }

      // Déconnexion avec Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Nettoyer les données de session locales
      localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token')
      
      // Redirection et notification
      navigate("/agence/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error: any) {
      console.error('Logout error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      })
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Déconnexion</p>
      </TooltipContent>
    </Tooltip>
  )
}