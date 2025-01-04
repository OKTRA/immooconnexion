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
      // First check if there's a valid session
      const { data: { session } } = await supabase.auth.getSession()
      
      // If no session exists, just clean up and redirect
      if (!session) {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID
        localStorage.removeItem(`sb-${projectId}-auth-token`)
        navigate("/agence/login")
        return
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        // If session not found error, clean up and redirect
        if (error.message.includes('session_not_found')) {
          const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID
          localStorage.removeItem(`sb-${projectId}-auth-token`)
          navigate("/agence/login")
          return
        }
        throw error
      }

      // Clean up and redirect on successful logout
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID
      localStorage.removeItem(`sb-${projectId}-auth-token`)
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