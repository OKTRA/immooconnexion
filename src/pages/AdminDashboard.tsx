import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { AdminTenants } from "@/components/admin/AdminTenants"
import { AdminStats } from "@/components/admin/AdminStats"
import { AdminSubscriptionPlans } from "@/components/admin/subscription/AdminSubscriptionPlans"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Vérifier si l'utilisateur est un super admin
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/login")
        return null
      }

      const { data: adminData, error } = await supabase
        .from("administrators")
        .select("is_super_admin")
        .eq("id", user.id)
        .single()

      if (error || !adminData?.is_super_admin) {
        throw new Error("Accès non autorisé")
      }

      return adminData
    },
    retry: false,
    onError: () => {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
        variant: "destructive",
      })
      navigate("/")
    },
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord Super Admin</h1>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
      
      <AdminStats />

      <Tabs defaultValue="profiles" className="mt-6">
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