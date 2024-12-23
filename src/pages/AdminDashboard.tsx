import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminStats } from "@/components/admin/AdminStats"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Non authentifié")
      }

      // Vérifier si super admin
      const { data: adminData, error: adminError } = await supabase
        .from("administrators")
        .select("is_super_admin")
        .eq("id", user.id)
        .maybeSingle()

      if (adminError) {
        console.error("Erreur lors de la vérification des droits admin:", adminError)
        // Si pas super admin, vérifier si admin dans profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) {
          console.error("Erreur lors de la vérification du profil:", profileError)
          throw new Error("Accès non autorisé")
        }

        if (!profileData || profileData.role !== "admin") {
          throw new Error("Accès non autorisé")
        }

        return { is_super_admin: false }
      }

      if (!adminData) {
        throw new Error("Accès non autorisé")
      }

      return adminData
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Erreur d'accès:", error)
        toast({
          title: "Erreur d'accès",
          description: error.message || "Vous n'avez pas les droits nécessaires pour accéder à cette page",
          variant: "destructive",
        })
        navigate("/")
      }
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
      
      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Profils</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="properties">Propriétés</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <AdminProfiles />
        </TabsContent>

        <TabsContent value="stats">
          <AdminStats />
        </TabsContent>

        <TabsContent value="properties">
          <AdminProperties />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard