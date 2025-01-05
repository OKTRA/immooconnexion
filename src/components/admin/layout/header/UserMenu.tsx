import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { clearSession } from "@/utils/sessionUtils"

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          clearSession()
          navigate("/login")
          return null
        }

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        return data
      } catch (error) {
        console.error("Error fetching profile:", error)
        return null
      }
    },
  })

  const handleLogout = async () => {
    try {
      // First clear any existing session from localStorage
      clearSession()
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
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
      // Always navigate to login page, even if there was an error
      navigate("/super-admin/login")
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="text-sm font-medium">
          {profile?.first_name || profile?.email || 'Utilisateur'}
        </p>
        <p className="text-xs text-muted-foreground">
          {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
      >
        <LogOut className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Déconnexion</span>
      </Button>
    </div>
  )
}