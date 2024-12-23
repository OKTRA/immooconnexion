import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminStats } from "@/components/admin/AdminStats"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { AdminTenants } from "@/components/admin/AdminTenants"
import { AdminSubscriptionPlans } from "@/components/admin/subscription/AdminSubscriptionPlans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AdminDashboard = () => {
  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("Non authentifié")
      }

      // First, try to get the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        throw profileError
      }

      // If no profile exists, create one with minimal required fields
      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id, 
            role: 'admin',
            email: user.email
          }])

        if (insertError) {
          console.error("Error creating profile:", insertError)
          throw insertError
        }

        // Fetch the newly created profile
        const { data: newProfile, error: newProfileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (newProfileError) throw newProfileError
        if (!newProfile?.role) throw new Error("Profile role not set")
        
        if (newProfile.role !== 'admin') {
          throw new Error("Accès non autorisé")
        }
      } else if (profile.role !== 'admin') {
        throw new Error("Accès non autorisé")
      }

      // Now check admin status
      const { data: adminData, error } = await supabase
        .from("administrators")
        .select("is_super_admin")
        .eq("id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching admin status:", error)
        throw error
      }

      return adminData
    },
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur: {(error as Error).message}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>

      <AdminStats />

      <Tabs defaultValue="profiles" className="mt-8">
        <TabsList>
          <TabsTrigger value="profiles">Profils</TabsTrigger>
          <TabsTrigger value="properties">Biens</TabsTrigger>
          <TabsTrigger value="tenants">Locataires</TabsTrigger>
          <TabsTrigger value="plans">Plans d'abonnement</TabsTrigger>
        </TabsList>
        <TabsContent value="profiles">
          <AdminProfiles />
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
    </div>
  )
}

export default AdminDashboard