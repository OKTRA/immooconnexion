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
      // Clear any local storage items
      localStorage.removeItem(`sb-${supabase.supabaseUrl}-auth-token`)
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Navigate to login page
      navigate("/agence/login")
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if there's an error, clear storage and redirect
      localStorage.removeItem(`sb-${supabase.supabaseUrl}-auth-token`)
      navigate("/agence/login")
      toast({
        title: "Session terminée",
        description: "Votre session a été terminée",
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