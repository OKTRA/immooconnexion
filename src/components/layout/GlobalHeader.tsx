import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { clearSession } from "@/utils/sessionUtils"
import { useIsMobile } from "@/hooks/use-mobile"

export function GlobalHeader() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()

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

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (error) {
          console.error("Error fetching profile:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error fetching profile:", error)
        return null
      }
    },
  })

  const handleLogout = async () => {
    try {
      clearSession()
      await supabase.auth.signOut()
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error: any) {
      console.error('Logout error:', error)
      clearSession()
      navigate("/login")
      toast({
        title: "Session terminée",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
      })
    }
  }

  const toggleMobileMenu = () => {
    const sidebar = document.querySelector('.mobile-sidebar')
    sidebar?.classList.toggle('translate-x-0')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden -ml-2"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <AnimatedLogo />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold hidden sm:block">
            {profile?.role === 'admin' ? 'Administration' : 'Gestion Immobilière'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
      </div>
    </header>
  )
}