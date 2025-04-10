import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { Building2, Users, Receipt, ArrowUpDown } from "lucide-react"

export function OverviewStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['overview-stats'],
    queryFn: async () => {
      // Get current user's profile to check role and agency
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) throw new Error("Agence non trouvée")

      // Build the queries with agency filter
      const propertiesQuery = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('agency_id', profile.agency_id)

      const tenantsQuery = supabase
        .from('tenants')
        .select('*', { count: 'exact' })
        .eq('agency_id', profile.agency_id)

      const contractsQuery = supabase
        .from('contracts')
        .select('*')
        .eq('agency_id', profile.agency_id)

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

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Biens"
        value={(stats?.propertiesCount || 0).toString()}
        description="Total des biens"
        icon={Building2}
      />
      <StatCard
        title="Locataires"
        value={(stats?.tenantsCount || 0).toString()}
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
        value={(stats?.activeContracts || 0).toString()}
        description="Contrats en cours"
        icon={ArrowUpDown}
      />
    </div>
  )
}