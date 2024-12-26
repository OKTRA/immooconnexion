import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { RevenueChart } from "@/components/RevenueChart"
import { RecentActivities } from "@/components/RecentActivities"
import { AppSidebar } from "@/components/AppSidebar"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"

const Index = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Non authentifié")

        console.log('User ID:', user.id)

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        if (!profile) throw new Error("Profile not found")
        
        console.log('Profil utilisateur:', profile)

        let propertiesQuery = supabase.from("properties").select("*", { count: "exact", head: true })
        let tenantsQuery = supabase.from("tenants").select("*", { count: "exact", head: true })
        let contractsQuery = supabase.from("contracts").select("montant, type, created_at, agency_id")

        propertiesQuery = propertiesQuery.eq('agency_id', profile.agency_id)
        tenantsQuery = tenantsQuery.eq('agency_id', profile.agency_id)
        contractsQuery = contractsQuery.eq('agency_id', profile.agency_id)

        const [
          { count: propertiesCount },
          { count: tenantsCount },
          { data: contracts },
        ] = await Promise.all([
          propertiesQuery,
          tenantsQuery,
          contractsQuery,
        ])

        console.log("Détail des contrats pour le calcul des revenus:", 
          contracts?.map(c => ({
            montant: c.montant,
            type: c.type,
            date: new Date(c.created_at).toLocaleDateString(),
            agency_id: c.agency_id
          }))
        )

        const totalRevenue = contracts?.reduce((sum, contract) => {
          if (contract.type === 'loyer') {
            const montant = contract.montant || 0
            console.log(`Ajout du montant ${montant} au total pour l'agence ${contract.agency_id}`)
            return sum + montant
          }
          return sum
        }, 0) || 0

        console.log("Revenu total calculé:", totalRevenue)

        return {
          properties: propertiesCount || 0,
          tenants: tenantsCount || 0,
          revenue: totalRevenue,
        }
      } catch (error: any) {
        console.error("Error in dashboard stats:", error)
        toast.error(error.message || "Une erreur est survenue lors du chargement des statistiques")
        return {
          properties: 0,
          tenants: 0,
          revenue: 0,
        }
      }
    },
    enabled: !isLoading,
  })

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate("/login")
          return
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, agency_id")
          .eq("id", user.id)
          .maybeSingle()

        if (error) {
          console.error("Error fetching profile:", error)
          toast.error("Erreur lors de la vérification du profil")
          return
        }

        if (!profile?.agency_id) {
          toast.error("Aucune agence associée à ce profil")
          return
        }

        if (profile.role === "admin") {
          const { data: adminData, error: adminError } = await supabase
            .from("administrators")
            .select("is_super_admin")
            .eq("id", user.id)
            .maybeSingle()

          if (!adminError && adminData?.is_super_admin) {
            navigate("/admin")
            return
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("Une erreur inattendue s'est produite")
      }
    }

    checkUserRole()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block md:w-[15%] min-w-[200px]">
          <AppSidebar />
        </div>
        <main className="w-full md:w-[85%] p-4 md:p-8 overflow-x-hidden">
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <StatCard
              title="Total Biens"
              value={stats?.properties.toString() || "0"}
              className="w-full"
            />
            <StatCard
              title="Total Locataires"
              value={stats?.tenants.toString() || "0"}
              className="w-full"
            />
            <StatCard
              title="Revenus Totaux"
              value={new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
              }).format(stats?.revenue || 0)}
              className="w-full"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="w-full min-h-[400px]">
              <RevenueChart />
            </div>
            <div className="w-full min-h-[400px]">
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Index