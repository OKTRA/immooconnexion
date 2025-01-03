import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminProfiles } from "../AdminProfiles"
import { AdminProperties } from "../dashboard/AdminProperties"
import { AdminTenants } from "../AdminTenants"
import { AdminSubscriptionPlans } from "../subscription/AdminSubscriptionPlans"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function DashboardTabs() {
  const { data: profile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from('profiles')
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
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    }
  })

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

  const isProfileComplete = !needsProfileUpdate && !needsAgencyUpdate

  return (
    <Tabs defaultValue="stats" className="w-full">
      {!isProfileComplete && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
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
      
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="plans">Plans d'abonnement</TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <AdminStats />
      </TabsContent>

      <TabsContent value="agents">
        <AdminProfiles />
      </TabsContent>

      <TabsContent value="plans">
        <AdminSubscriptionPlans />
      </TabsContent>
    </Tabs>
  )
}