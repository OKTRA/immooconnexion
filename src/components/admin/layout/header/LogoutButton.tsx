import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase, clearSession } from "@/integrations/supabase/client"
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
      // Always clear the session first
      clearSession()
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        // Even if there's an error, we've already cleared the session
        toast({
          title: "Session terminée",
          description: "Votre session a été terminée en raison d'une erreur",
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