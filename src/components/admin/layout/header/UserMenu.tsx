import { LogOut, Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import { useEffect } from "react"

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        console.error('Session error:', error)
        navigate("/super-admin/login")
      }
    }
    checkSession()
  }, [navigate])

  const { data: profile, isError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !session) {
          throw new Error('No active session')
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle()

        if (error) throw error
        return data
      } catch (error) {
        console.error('Profile fetch error:', error)
        throw error
      }
    },
    retry: false,
    onError: () => {
      navigate("/super-admin/login")
    }
  })

  const handleLogout = async () => {
    try {
      // Clear any existing session data first
      localStorage.removeItem('sb-' + supabaseUrl + '-auth-token')
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      navigate("/super-admin/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Force navigation to login even if there's an error
      navigate("/super-admin/login")
      toast({
        title: "Session expirée",
        description: "Votre session a expiré, veuillez vous reconnecter",
        variant: "destructive"
      })
    }
  }

  if (isError) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-white/20">
            <AvatarFallback className="bg-white/10 text-white">
              {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              {profile?.first_name || profile?.email || 'Utilisateur'}
            </p>
            <p className="text-xs text-white/70">
              Super Admin
            </p>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:bg-white/10"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Changer le thème</p>
          </TooltipContent>
        </Tooltip>

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
      </div>
    </TooltipProvider>
  )
}