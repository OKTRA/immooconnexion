import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { clearSession } from "@/utils/sessionUtils"

interface ProtectedRouteProps {
  adminOnly?: boolean
}

export const ProtectedRoute = ({ adminOnly }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()
  const location = useLocation()
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error?.message?.includes('session_not_found') || !session?.access_token) {
          console.log("No valid session found")
          clearSession()
          setIsAuthenticated(false)
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive"
          })
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()

        if (adminOnly) {
          const { data: adminData } = await supabase
            .from('administrators')
            .select('is_super_admin')
            .eq('id', session.user.id)
            .maybeSingle()

          if (!adminData?.is_super_admin) {
            console.log("User is not an admin")
            setIsAuthenticated(false)
            toast({
              title: "Accès refusé",
              description: "Vous n'avez pas les droits d'accès nécessaires",
              variant: "destructive"
            })
            return
          }
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        clearSession()
        setIsAuthenticated(false)
        toast({
          title: "Erreur d'authentification",
          description: "Une erreur est survenue lors de la vérification de votre session",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        clearSession()
        setIsAuthenticated(false)
        return
      }
      
      checkAuth()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [adminOnly, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.includes('/super-admin')
    const loginPath = isAdminRoute ? '/super-admin/login' : '/login'
    
    return <Navigate to={loginPath} replace state={{ from: location }} />
  }

  return <Outlet />
}