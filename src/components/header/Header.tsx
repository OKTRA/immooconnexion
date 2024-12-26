import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

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

  // Mobile buttons
  const MobileButtons = () => (
    <nav className="flex flex-col gap-2">
      <Button 
        variant="secondary" 
        className="bg-white/80 hover:bg-white/90 backdrop-blur-sm w-full px-3"
        onClick={() => navigate('/super-admin/login')}
      >
        <Shield className="mr-2 h-4 w-4" />
        <span className="text-sm">Admin</span>
      </Button>
      <Button 
        variant="secondary" 
        className="bg-white/80 hover:bg-white/90 backdrop-blur-sm w-full px-3"
        onClick={() => navigate('/public')}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        <span className="text-sm">Voir les biens</span>
      </Button>
    </nav>
  )

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isLoginPage ? 'bg-transparent' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {isLoginPage && <MobileButtons />}
        </div>
      </div>
    </header>
  )
}