import { useQuery } from "@tanstack/react-query"
import { supabase, clearSession } from "@/integrations/supabase/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserAvatar } from "./UserAvatar"
import { ThemeToggle } from "./ThemeToggle"
import { LogoutButton } from "./LogoutButton"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSessionChecked, setIsSessionChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          clearSession()
          navigate("/login")
          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
          })
          return
        }
        
        // Verify the session is still valid
        const { error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error('User verification error:', userError)
          clearSession()
          navigate("/login")
          toast({
            title: "Session invalide",
            description: "Votre session n'est plus valide. Veuillez vous reconnecter.",
          })
          return
        }
        
        setIsSessionChecked(true)
      } catch (error) {
        console.error('Auth check error:', error)
        clearSession()
        navigate("/login")
        toast({
          title: "Erreur d'authentification",
          description: "Une erreur est survenue. Veuillez vous reconnecter.",
        })
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        clearSession()
        navigate("/login")
        return
      }
      
      if (event === 'TOKEN_REFRESHED' && !session) {
        clearSession()
        navigate("/login")
        toast({
          title: "Session expirée",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
        })
        return
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          clearSession()
          throw new Error('No user found')
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (error) {
          console.error('Profile fetch error:', error)
          throw error
        }
        return data
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        clearSession()
        navigate("/login")
        return null
      }
    },
    enabled: isSessionChecked,
    retry: false,
    meta: {
      errorMessage: "Failed to fetch user profile"
    }
  })

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <UserAvatar profile={profile} />
        <ThemeToggle />
        <LogoutButton />
      </div>
    </TooltipProvider>
  )
}