import { useState } from "react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function LoginForm() {
  const [view, setView] = useState<"sign_in" | "forgotten_password">("sign_in")
  const { toast } = useToast()

  return (
    <Card className="w-[90%] max-w-[320px] shadow-lg bg-white/90 backdrop-blur-sm border-0 rounded-lg overflow-hidden">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-semibold text-center">Connexion</CardTitle>
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
  )
}