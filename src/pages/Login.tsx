import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase, clearSession } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/LoginForm"
import { WarningDialog } from "@/components/auth/WarningDialog"

const Login = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<"sign_in" | "forgotten_password">("sign_in")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkAndClearSession = async () => {
      try {
        setIsLoading(true)
        clearSession()
        await supabase.auth.signOut()
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session check error:', error)
          if (error.message.includes('Failed to fetch')) {
            toast({
              title: "Erreur de connexion",
              description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
              variant: "destructive"
            })
          }
          return
        }

        if (session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role, has_seen_warning')
            .eq('id', session.user.id)
            .single()

          if (profileData?.role === 'admin') {
            if (!profileData.has_seen_warning) {
              setShowWarning(true)
              await supabase
                .from('profiles')
                .update({ has_seen_warning: true })
                .eq('id', session.user.id)
            } else {
              navigate("/agence/admin")
            }
          } else {
            navigate("/")
          }
        }
      } catch (error: any) {
        console.error('Session check error:', error)
        clearSession()
        toast({
          title: "Erreur d'authentification",
          description: "Une erreur est survenue. Veuillez vous reconnecter.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAndClearSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, has_seen_warning')
          .eq('id', session.user.id)
          .single()

        if (profileData?.role === 'admin') {
          if (!profileData.has_seen_warning) {
            setShowWarning(true)
            await supabase
              .from('profiles')
              .update({ has_seen_warning: true })
              .eq('id', session.user.id)
          } else {
            navigate("/agence/admin")
          }
        } else {
          navigate("/")
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, toast])

  const handleWarningClose = () => {
    setShowWarning(false)
    navigate("/agence/admin")
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
        }}
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#243949] to-[#517fa4]">
      <PublicHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4">
          <Card className="w-[90%] max-w-[320px] shadow-lg bg-white/90 backdrop-blur-sm border-0 rounded-lg overflow-hidden">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg font-semibold text-center">Connexion</CardTitle>
              <CardDescription className="text-center text-sm">
                Bienvenue sur votre espace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm view={view} setView={setView} />
            </CardContent>
          </Card>
        </div>
      </div>
      <WarningDialog open={showWarning} onClose={handleWarningClose} />
    </div>
  )
}

export default Login
