import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Shield, Building2, Menu } from "lucide-react"
import { AnimatedLogo } from "./AnimatedLogo"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

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

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-primary hover:text-primary/80 w-full md:w-auto justify-start md:justify-center"
        onClick={() => navigate("/public")}
      >
        <Building2 className="h-4 w-4 mr-2" />
        <span>Biens disponibles</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary hover:text-primary/80 w-full md:w-auto justify-start md:justify-center"
        onClick={() => navigate("/super-admin/login")}
      >
        <Shield className="h-4 w-4 mr-2" />
        <span>Super Admin</span>
      </Button>
    </div>
  )

  return (
    <header className={`fixed top-0 left-0 right-0 z-10 ${isLoginPage ? 'bg-transparent' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <AnimatedLogo />
          </div>
          
          {isLoginPage && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex">
                <NavLinks />
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <NavLinks />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}