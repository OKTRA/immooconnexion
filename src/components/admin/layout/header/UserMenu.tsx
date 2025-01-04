import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/agence/login")
        return
      }
      setIsSessionChecked(true)
    }

    checkAuth()

    // Écouter uniquement les événements de déconnexion explicite
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/agence/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      if (error) throw error
      return data
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