import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminStats } from "@/components/admin/AdminStats"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { AdminTenants } from "@/components/admin/AdminTenants"
import { AdminSubscriptionPlans } from "@/components/admin/subscription/AdminSubscriptionPlans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("Non authentifié")
      }

      // Vérifier d'abord si l'utilisateur est un super admin
      const { data: adminData, error: adminError } = await supabase
        .from("administrators")
        .select("is_super_admin")
        .eq("id", user.id)
        .maybeSingle()

      if (adminError) {
        console.error("Error fetching admin status:", adminError)
        throw adminError
      }

      // Si l'utilisateur n'est pas un super admin, vérifier s'il a un profil admin
      if (!adminData?.is_super_admin) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          throw profileError
        }

        if (!profile || profile.role !== 'admin') {
          throw new Error("Accès non autorisé")
        }
      }

      return adminData
    },
    retry: false,
    onError: (error) => {
      toast({
        title: "Erreur d'accès",
        description: "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
        variant: "destructive"
      })
      navigate("/")
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return null // La redirection est gérée par onError
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