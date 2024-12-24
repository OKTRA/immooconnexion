import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { Building2, CircleDollarSign, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: profilesCount },
        { count: propertiesCount },
        { count: tenantsCount },
        { data: contracts },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("tenants").select("*", { count: "exact", head: true }),
        supabase.from("contracts").select("montant"),
      ])

      const totalRevenue = contracts?.reduce((sum, contract) => sum + (contract.montant || 0), 0) || 0

      return {
        profiles: profilesCount || 0,
        properties: propertiesCount || 0,
        tenants: tenantsCount || 0,
        revenue: totalRevenue,
      }
    },
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Utilisateurs"
        value={stats?.profiles.toString() || "0"}
        icon={Users}
      />
      <StatCard
        title="Total Biens"
        value={stats?.properties.toString() || "0"}
        icon={Building2}
      />
      <StatCard
        title="Revenus Totaux"
        value={new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
        }).format(stats?.revenue || 0)}
        icon={CircleDollarSign}
      />
    </div>
  )
}