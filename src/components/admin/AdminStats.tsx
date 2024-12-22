import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"

export function AdminStats() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: profilesCount },
        { count: propertiesCount },
        { count: tenantsCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("tenants").select("*", { count: "exact", head: true }),
      ])

      return {
        profiles: profilesCount || 0,
        properties: propertiesCount || 0,
        tenants: tenantsCount || 0,
      }
    },
  })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total des Profils"
        value={stats?.profiles.toString() || "0"}
      />
      <StatCard
        title="Total des Biens"
        value={stats?.properties.toString() || "0"}
      />
      <StatCard
        title="Total des Locataires"
        value={stats?.tenants.toString() || "0"}
      />
    </div>
  )
}