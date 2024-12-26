import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { AnimatedLogo } from "./AnimatedLogo"
import { useQuery } from "@tanstack/react-query"

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Check if we're on a login page
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
    enabled: !isLoginPage // Only fetch profile if not on login page
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
    <header className={`fixed top-0 left-0 right-0 z-50 ${isLoginPage ? 'bg-transparent' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
      <div className="container flex h-16 items-center justify-start">
        <AnimatedLogo />
      </div>
    </header>
  )
}