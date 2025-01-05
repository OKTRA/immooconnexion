import { useEffect } from "react"
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

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Session error:', sessionError)
          clearSession()
          navigate("/login")
          return
        }
        
        // Verify the session is still valid
        const { error: userError } = await supabase.auth.getUser()
        if (userError && userError.message !== "session_not_found") {
          console.error('User verification error:', userError)
          clearSession()
          navigate("/login")
          return
        }
        
        return session?.user
      } catch (error) {
        console.error('Auth check error:', error)
        clearSession()
        navigate("/login")
      }
    },
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearSession()
        navigate("/login")
        return
      }

      if (event === 'TOKEN_REFRESHED' && !session) {
        clearSession()
        navigate("/login")
        return
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

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
