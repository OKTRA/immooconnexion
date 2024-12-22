import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { useQuery } from "@tanstack/react-query"

const Index = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setUserRole(profile?.role || null)

      // Redirect super admins to their dedicated dashboard
      if (profile?.role === "admin") {
        const { data: adminData } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .single()

        if (adminData?.is_super_admin) {
          navigate("/admin")
        }
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
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
    </div>
  )
}

export default Index