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

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

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
      // Clear any stored session data first
      localStorage.removeItem('sb-' + process.env.VITE_SUPABASE_PROJECT_ID + '-auth-token')
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
        throw error
      }

      // Always navigate to login regardless of error
      navigate("/agence/login")
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to login even if there's an error
      navigate("/agence/login")
      
      toast({
        title: "Attention",
        description: "La session a été terminée",
        variant: "default"
      })
    }
  }

  // Only render if we're on an admin/dashboard route
  const isAdminOrDashboardRoute = location.pathname.includes('/admin') || location.pathname === '/'
  if (!profile || !isAdminOrDashboardRoute) {
    return null
  }

  const HeaderContent = () => (
    <>
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

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8"
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
          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <AnimatedLogo />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold hidden sm:block">
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