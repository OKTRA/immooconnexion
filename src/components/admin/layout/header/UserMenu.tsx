import { useQuery } from "@tanstack/react-query"
import { supabase, checkSession } from "@/integrations/supabase/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserAvatar } from "./UserAvatar"
import { ThemeToggle } from "./ThemeToggle"
import { LogoutButton } from "./LogoutButton"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function UserMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const session = await checkSession();
      if (!session) {
        throw new Error('No session');
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()

      if (error) throw error;
      return data;
    },
    retry: false,
    meta: {
      errorMessage: "Failed to fetch user profile"
    }
  })

  useEffect(() => {
    const checkAuth = async () => {
      const session = await checkSession();
      if (!session) {
        navigate("/super-admin/login")
      }
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/super-admin/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

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