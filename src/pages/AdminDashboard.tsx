import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminStats } from "@/components/admin/AdminStats"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { AdminAgencies } from "@/components/admin/AdminAgencies"
import { AdminSubscriptionPlans } from "@/components/admin/subscription/AdminSubscriptionPlans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Check admin status
  const { data: adminStatus, isLoading: checkingAdmin } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!user) throw new Error("Non authentifié")

        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .maybeSingle()

        if (adminError) throw adminError
        if (!adminData?.is_super_admin) {
          throw new Error("Accès non autorisé")
        }

        return adminData
      } catch (error: any) {
        console.error("Admin check error:", error)
        throw error
      }
    },
    retry: false,
  })

  // Handle unauthorized access
  useEffect(() => {
    if (!checkingAdmin && !adminStatus) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
        variant: "destructive"
      })
      navigate("/login")
    }
  }, [adminStatus, checkingAdmin, navigate, toast])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      })
    }
  }

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!adminStatus) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord Super Admin</h1>
        <Button 
          variant="ghost" 
          className="text-red-500 hover:text-red-600 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <AdminStats />

      <Tabs defaultValue="agencies" className="mt-8">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="agencies">Agences</TabsTrigger>
          <TabsTrigger value="profiles">Utilisateurs</TabsTrigger>
          <TabsTrigger value="properties">Biens</TabsTrigger>
          <TabsTrigger value="plans">Abonnements</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="agencies">
            <AdminAgencies />
          </TabsContent>
          <TabsContent value="profiles">
            <AdminProfiles />
          </TabsContent>
          <TabsContent value="properties">
            <AdminProperties />
          </TabsContent>
          <TabsContent value="plans">
            <AdminSubscriptionPlans />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default AdminDashboard