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
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [adminDetails, setAdminDetails] = useState<any>(null)

  // Vérifier la session au chargement
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        navigate("/login")
        return
      }
    }

    checkSession()

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
    }
  }

  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      console.log("Début de la vérification du statut admin")
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error("Aucun utilisateur connecté")
        throw new Error("Non authentifié")
      }

      console.log("ID utilisateur:", user.id)
      console.log("Email utilisateur:", user.email)

      // Vérification dans la table administrators
      const { data: adminData, error: adminError } = await supabase
        .from("administrators")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      console.log("Données admin récupérées:", adminData)
      console.log("Erreur admin:", adminError)

      if (adminError) {
        console.error("Erreur lors de la récupération du statut admin:", adminError)
        throw adminError
      }

      // Vérification explicite du statut de super admin
      if (!adminData?.is_super_admin) {
        console.warn("L'utilisateur n'est pas un super admin")
        throw new Error("Accès non autorisé. Seuls les super administrateurs peuvent se connecter ici.")
      }

      setAdminDetails(adminData)
      return adminData
    },
    retry: false,
    meta: {
      errorHandler: (error: any) => {
        console.error("Erreur de gestion de l'accès:", error)
        toast({
          title: "Erreur d'accès",
          description: error.message || "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
          variant: "destructive"
        })
        navigate("/")
      }
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
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