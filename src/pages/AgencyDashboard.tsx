import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { RevenueChart } from "@/components/RevenueChart"
import { RecentActivities } from "@/components/RecentActivities"
import { Building2, Users, Receipt, CircleDollarSign } from "lucide-react"

export default function AgencyDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["agency-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("No agency found")

      const { data: agency } = await supabase
        .from("agencies")
        .select(`
          current_properties_count,
          current_tenants_count,
          current_profiles_count
        `)
        .eq("id", profile.agency_id)
        .single()

      return agency
    }
  })

  return (
    <AgencyLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Biens"
            value={stats?.current_properties_count || 0}
            icon={Building2}
          />
          <StatCard
            title="Locataires"
            value={stats?.current_tenants_count || 0}
            icon={Users}
          />
          <StatCard
            title="Agents"
            value={stats?.current_profiles_count || 0}
            icon={Receipt}
          />
          <StatCard
            title="Revenus"
            value="0 FCFA"
            icon={CircleDollarSign}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivities />
            </CardContent>
          </Card>
        </div>
      </div>
    </AgencyLayout>
  )
}