import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { Building2, Users, Receipt, ArrowUpDown } from "lucide-react"

export function OverviewStats() {
  const { data: stats } = useQuery({
    queryKey: ['overview-stats'],
    queryFn: async () => {
      // Get current user's profile to check role
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      // Build the base queries
      let propertiesQuery = supabase.from('properties').select('*', { count: 'exact' })
      let tenantsQuery = supabase.from('tenants').select('*', { count: 'exact' })
      let contractsQuery = supabase.from('contracts').select('*')

      // If not admin, filter by agency
      if (profile?.role !== 'admin') {
        propertiesQuery = propertiesQuery.eq('agency_id', user.id)
        tenantsQuery = tenantsQuery.eq('agency_id', user.id)
        contractsQuery = contractsQuery.eq('agency_id', user.id)
      }

      const [
        { count: propertiesCount },
        { count: tenantsCount },
        { data: contracts }
      ] = await Promise.all([
        propertiesQuery,
        tenantsQuery,
        contractsQuery
      ])

      const totalRevenue = contracts?.reduce((sum, contract) => sum + (contract.montant || 0), 0) || 0
      const activeContracts = contracts?.filter(c => c.statut === 'actif').length || 0

      return {
        propertiesCount: propertiesCount || 0,
        tenantsCount: tenantsCount || 0,
        totalRevenue,
        activeContracts
      }
    }
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Biens"
        value={stats?.propertiesCount.toString() || "0"}
        description="Total des biens"
        icon={Building2}
      />
      <StatCard
        title="Locataires"
        value={stats?.tenantsCount.toString() || "0"}
        description="Total des locataires"
        icon={Users}
      />
      <StatCard
        title="Revenus"
        value={`${(stats?.totalRevenue || 0).toLocaleString()} FCFA`}
        description="Revenus totaux"
        icon={Receipt}
      />
      <StatCard
        title="Contrats Actifs"
        value={stats?.activeContracts.toString() || "0"}
        description="Contrats en cours"
        icon={ArrowUpDown}
      />
    </div>
  )
}