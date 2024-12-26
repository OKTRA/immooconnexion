import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Shield, Building2 } from "lucide-react"
import { AnimatedLogo } from "./AnimatedLogo"

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const isLoginPage = ['/login', '/super-admin/login'].includes(location.pathname)

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      return data
    },
    enabled: !isLoginPage
  })

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      })
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-10 ${isLoginPage ? 'bg-transparent' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <AnimatedLogo />
        </div>
        {isLoginPage && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/public")}
            >
              <Building2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Biens disponibles</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/super-admin/login")}
            >
              <Shield className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Super Admin</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}