import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { getSupabaseSessionKey } from "@/utils/sessionUtils"

const Login = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<"sign_in" | "forgotten_password">("sign_in")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAndClearSession = async () => {
      try {
        setIsLoading(true)
        const storageKey = getSupabaseSessionKey()
        localStorage.removeItem(storageKey)

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
          navigate("/")
        }
      } catch (error: any) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAndClearSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, toast])

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
        }}
      >
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  return (
    <div 
      className="relative min-h-screen flex flex-col p-4"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
      }}
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button 
          variant="secondary" 
          className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
          onClick={() => navigate('/super-admin/login')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Super Admin
        </Button>
        <Button 
          variant="secondary" 
          className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
          onClick={() => navigate('/public')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Voir les biens disponibles
        </Button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-sm shadow-lg bg-white/90 backdrop-blur-sm border-0 rounded-lg overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">Connexion</CardTitle>
            <CardDescription className="text-center text-sm">
              Bienvenue sur votre espace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#517fa4",
                      brandAccent: "#243949",
                    },
                  },
                },
                className: {
                  container: "space-y-3",
                  button: "w-full bg-gradient-to-r from-[#243949] to-[#517fa4] hover:from-[#2c4456] hover:to-[#5c8fb8] text-white font-medium py-2 px-4 rounded-md transition-all duration-200",
                  label: "block text-sm font-medium text-gray-700",
                  input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#517fa4] focus:ring-[#517fa4] sm:text-sm",
                  anchor: "text-sm text-[#517fa4] hover:text-[#243949] transition-colors",
                },
              }}
              theme="light"
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "Se connecter",
                    loading_button_label: "Connexion...",
                  },
                  forgotten_password: {
                    link_text: "Mot de passe oublié ?",
                    button_label: "Réinitialiser",
                    email_label: "Email",
                    password_label: "Nouveau mot de passe",
                    confirmation_text: "Vérifiez vos emails",
                  },
                },
              }}
              view={view}
              showLinks={false}
              redirectTo={window.location.origin}
              onlyThirdPartyProviders={false}
              magicLink={false}
            />
            {view === "sign_in" && (
              <div className="text-center mt-3">
                <button 
                  onClick={() => setView("forgotten_password")}
                  className="text-sm text-[#517fa4] hover:text-[#243949] transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}
            {view === "forgotten_password" && (
              <div className="text-center mt-3">
                <button 
                  onClick={() => setView("sign_in")}
                  className="text-sm text-[#517fa4] hover:text-[#243949] transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login