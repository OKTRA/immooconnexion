import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const Login = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<"sign_in" | "forgotten_password">("sign_in")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
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
    
    checkSession()

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
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
      }}
    >
      <div className="fixed top-4 right-4 flex gap-2">
        <Button 
          variant="secondary" 
          className="bg-white hover:bg-gray-100"
          onClick={() => navigate('/super-admin/login')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Super Admin
        </Button>
        <Button 
          variant="secondary" 
          className="bg-white hover:bg-gray-100"
          onClick={() => navigate('/public')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Voir les biens disponibles
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Bienvenue sur votre espace de gestion immobilière
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
                    brand: "#000000",
                    brandAccent: "#333333",
                  },
                },
              },
              className: {
                container: "space-y-4",
                button: "w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition-colors",
                label: "block text-sm font-medium text-gray-700",
                input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm",
                anchor: "text-sm text-gray-600 hover:text-gray-900",
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
                  loading_button_label: "Connexion en cours...",
                },
                forgotten_password: {
                  link_text: "Mot de passe oublié ?",
                  button_label: "Réinitialiser le mot de passe",
                  email_label: "Email",
                  password_label: "Nouveau mot de passe",
                  confirmation_text: "Vérifiez vos emails pour réinitialiser votre mot de passe",
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
            <div className="text-center mt-4">
              <button 
                onClick={() => setView("forgotten_password")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}
          {view === "forgotten_password" && (
            <div className="text-center mt-4">
              <button 
                onClick={() => setView("sign_in")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Login