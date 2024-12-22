import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { RevenueChart } from "@/components/RevenueChart"
import { RecentActivities } from "@/components/RecentActivities"
import { AppSidebar } from "@/components/AppSidebar"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

const Index = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate("/login")
          return
        }

        console.log("Checking role for user:", user.id)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          toast.error("Erreur lors de la vérification du profil")
          return
        }

        if (!profile) {
          console.log("No profile found for user:", user.id)
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, role: 'user' }])

          if (insertError) {
            console.error("Error creating profile:", insertError)
            toast.error("Erreur lors de la création du profil")
            return
          }
          
          setUserRole('user')
          return
        }

        console.log("Profile found:", profile)
        setUserRole(profile.role)

        if (profile.role === "admin") {
          const { data: adminData, error: adminError } = await supabase
            .from("administrators")
            .select("is_super_admin")
            .eq("id", user.id)
            .maybeSingle()

          if (adminError) {
            console.error("Error checking admin status:", adminError)
            return
          }

          if (adminData?.is_super_admin) {
            navigate("/admin")
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("Une erreur inattendue s'est produite")
      }
    }

    checkUserRole()
  }, [navigate])

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        { count: propertiesCount },
        { count: tenantsCount },
        { data: contracts },
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("tenants").select("*", { count: "exact", head: true }),
        supabase.from("contracts").select("montant"),
      ])

      const totalRevenue = contracts?.reduce((sum, contract) => sum + (contract.montant || 0), 0) || 0

      return {
        properties: propertiesCount || 0,
        tenants: tenantsCount || 0,
        revenue: totalRevenue,
      }
    },
  })

  if (userRole === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block w-64 border-r">
        <AppSidebar />
      </div>
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="lg:hidden">
            <AppSidebar />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Total Biens"
            value={stats?.properties.toString() || "0"}
          />
          <StatCard
            title="Total Locataires"
            value={stats?.tenants.toString() || "0"}
          />
          <StatCard
            title="Revenus Totaux"
            value={new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
            }).format(stats?.revenue || 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <RevenueChart />
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}

export default Index