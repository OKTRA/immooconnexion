import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    let mounted = true

    const clearLocalStorage = () => {
      // Clear all Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })
    }

    const handleAuthError = async () => {
      console.log("Handling auth error - clearing state")
      clearLocalStorage()
      if (mounted) {
        setIsAuthenticated(false)
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive"
        })
      }
    }

    const checkAuth = async () => {
      try {
        // First clear any potentially corrupted session
        await supabase.auth.signOut()
        clearLocalStorage()

        // Get a fresh session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.log("No valid session found")
          await handleAuthError()
          return
        }

        // Verify user exists
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error("User verification failed:", userError)
          await handleAuthError()
          return
        }

        // Only proceed with profile check if we have a valid user
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          console.error("Profile check error:", profileError)
          await handleAuthError()
          return
        }

        // Don't try to create profile here - it should be handled by the database trigger
        if (!profile) {
          console.log("No profile found for user")
          await handleAuthError()
          return
        }

        if (mounted) setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        await handleAuthError()
      }
    }

    // Initial auth check
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      
      if (event === 'SIGNED_OUT' || !session) {
        clearLocalStorage()
        if (mounted) setIsAuthenticated(false)
        return
      }
      
      if (mounted) {
        await checkAuth()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [toast])

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}