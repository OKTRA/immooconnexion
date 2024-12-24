import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminStats } from "@/components/admin/AdminStats"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { AdminTenants } from "@/components/admin/AdminTenants"
import { AdminSubscriptionPlans } from "@/components/admin/subscription/AdminSubscriptionPlans"
import { AdminAgencies } from "@/components/admin/AdminAgencies"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseSessionKey } from "@/utils/sessionUtils"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    const storageKey = getSupabaseSessionKey()
    
    try {
      await supabase.auth.signOut()
      localStorage.removeItem(storageKey)
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem(storageKey)
      navigate("/login")
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté",
      })
    }
  }

  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      try {
        console.log("Checking admin status...")
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('User fetch error:', userError)
          throw userError
        }
        
        if (!user) {
          console.error('No user found')
          throw new Error("Non authentifié")
        }

        console.log("User found:", user.id)

        // Check if user is a super admin
        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .maybeSingle()

        if (adminError) {
          console.error("Error fetching admin status:", adminError)
          throw adminError
        }

        // If user is a super admin, return the data
        if (adminData?.is_super_admin) {
          console.log("User is super admin")
          return adminData
        }

        // If not super admin, check if they have an admin role in profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          throw profileError
        }

        if (!profile || profile.role !== 'admin') {
          console.error("User is not an admin:", profile)
          throw new Error("Accès non autorisé")
        }

        console.log("User is admin via profile")
        return { is_super_admin: false }
      } catch (error: any) {
        console.error('Admin check error:', error)
        throw error
      }
    },
    retry: false,
  })

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Handle error state
  if (error) {
    toast({
      title: "Accès refusé",
      description: "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
      variant: "destructive"
    })
    navigate("/")
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
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

      <Tabs defaultValue="profiles" className="mt-8">
        <TabsList>
          <TabsTrigger value="profiles">Profils</TabsTrigger>
          <TabsTrigger value="agencies">Agences</TabsTrigger>
          <TabsTrigger value="properties">Biens</TabsTrigger>
          <TabsTrigger value="tenants">Locataires</TabsTrigger>
          <TabsTrigger value="plans">Plans d'abonnement</TabsTrigger>
        </TabsList>
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
    </div>
  )
}

export default AdminDashboard