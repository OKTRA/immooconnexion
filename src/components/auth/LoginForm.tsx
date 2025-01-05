import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  view: "sign_in" | "forgotten_password"
  setView: (view: "sign_in" | "forgotten_password") => void
}

export const LoginForm = ({ view, setView }: LoginFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Check if user's agency is blocked
        const { data: profile } = await supabase
          .from('profiles')
          .select('agency_id')
          .eq('id', session.user.id)
          .single()

        if (profile?.agency_id) {
          const { data: agency } = await supabase
            .from('agencies')
            .select('status')
            .eq('id', profile.agency_id)
            .single()

          if (agency?.status === 'blocked') {
            await supabase.auth.signOut()
            toast({
              title: "Accès refusé",
              description: "Votre agence a été bloquée. Veuillez contacter l'administrateur.",
              variant: "destructive",
            })
            return
          }
        }
        navigate("/agence/admin")
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Check if user's agency is blocked
        const { data: profile } = await supabase
          .from('profiles')
          .select('agency_id')
          .eq('id', session.user.id)
          .single()

        if (profile?.agency_id) {
          const { data: agency } = await supabase
            .from('agencies')
            .select('status')
            .eq('id', profile.agency_id)
            .single()

          if (agency?.status === 'blocked') {
            await supabase.auth.signOut()
            toast({
              title: "Accès refusé",
              description: "Votre agence a été bloquée. Veuillez contacter l'administrateur.",
              variant: "destructive",
            })
            return
          }
        }
        navigate("/agence/admin")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

  return (
    <>
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
        redirectTo={window.location.origin + "/agence/admin"}
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
    </>
  )
}