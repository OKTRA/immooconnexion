import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut, Moon, Sun } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useTheme } from "next-themes"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function GlobalHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // N'afficher le header que sur les routes authentifiées
  const isAuthenticatedRoute = location.pathname.includes('/admin')
  if (!isAuthenticatedRoute) {
    return null
  }

  // N'afficher le header que sur la route du dashboard
  const isDashboardRoute = location.pathname === '/agence/admin' || location.pathname === '/super-admin/admin'
  if (!isDashboardRoute) {
    return null
  }

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!user) throw new Error("Non authentifié")

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        return data
      } catch (error: any) {
        console.error('Profile fetch error:', error)
        throw error
      }
    },
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

  const HeaderContent = () => (
    <>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/5 text-primary">
            {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground">
            {profile?.first_name || profile?.email || 'Utilisateur'}
          </p>
          <p className="text-xs text-muted-foreground">
            {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 hover:bg-primary/5"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <AnimatedLogo />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold hidden sm:block text-foreground/90">
            {profile?.role === 'admin' ? 'Administration' : 'Gestion Immobilière'}
          </h1>
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex items-center gap-4">
          <HeaderContent />
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <HeaderContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}