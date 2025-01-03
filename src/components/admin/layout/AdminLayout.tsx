import { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DashboardHeader } from "./DashboardHeader"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: profile } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from("profiles")
        .select(`
          *,
          agencies (
            id,
            name,
            address,
            phone,
            email,
            status
          )
        `)
        .eq("id", user.id)
        .maybeSingle()

      console.log("Profile data:", data)
      return data
    }
  })

  // Vérifier si l'utilisateur est un admin d'agence et si son profil ou son agence nécessite une mise à jour
  const needsProfileUpdate = profile?.role === 'admin' && (
    !profile.first_name || 
    !profile.last_name || 
    !profile.phone_number ||
    !profile.email
  )

  const needsAgencyUpdate = profile?.role === 'admin' && profile?.agencies && (
    !profile.agencies.name ||
    !profile.agencies.address ||
    !profile.agencies.phone ||
    !profile.agencies.email ||
    profile.agencies.status === 'pending'
  )

  const showWarning = needsProfileUpdate || needsAgencyUpdate

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
      }}
    >
      <DashboardHeader />
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1400px] animate-fade-in">
        {showWarning && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-lg">
              {needsProfileUpdate && needsAgencyUpdate ? (
                "Veuillez compléter votre profil et les informations de votre agence pour accéder à toutes les fonctionnalités"
              ) : needsProfileUpdate ? (
                "Veuillez compléter votre profil pour continuer"
              ) : (
                "Veuillez compléter les informations de votre agence pour continuer"
              )}
            </AlertDescription>
          </Alert>
        )}
        <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  )
}