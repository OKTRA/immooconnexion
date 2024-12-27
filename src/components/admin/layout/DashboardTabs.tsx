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
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  const isProfileComplete = profile?.first_name && 
                          profile?.last_name && 
                          profile?.email && 
                          profile?.phone_number

  return (
    <Tabs defaultValue="stats" className="w-full">
      {!isProfileComplete && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Veuillez compléter votre profil avant d'accéder aux autres fonctionnalités
          </AlertDescription>
        </Alert>
      )}
      
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
        <TabsTrigger 
          value="profiles" 
          disabled={!isProfileComplete}
        >
          Agents
        </TabsTrigger>
        <TabsTrigger 
          value="agencies" 
          disabled={!isProfileComplete}
        >
          Agences
        </TabsTrigger>
        <TabsTrigger 
          value="properties" 
          disabled={!isProfileComplete}
        >
          Biens
        </TabsTrigger>
        <TabsTrigger 
          value="tenants" 
          disabled={!isProfileComplete}
        >
          Locataires
        </TabsTrigger>
        <TabsTrigger 
          value="plans" 
          disabled={!isProfileComplete}
        >
          Abonnements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <AdminStats />
      </TabsContent>

      <TabsContent value="profiles">
        <AdminProfiles />
      </TabsContent>

      <TabsContent value="agencies">
        <AdminAgencies />
      </TabsContent>

      <TabsContent value="properties">
        <AdminProperties />
      </TabsContent>

      <TabsContent value="tenants">
        <AdminTenants />
      </TabsContent>

      <TabsContent value="plans">
        <AdminSubscriptionPlans />
      </TabsContent>
    </Tabs>
  )
}