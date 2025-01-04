import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28']

export function OccupancyStatus() {
  const { data: occupancyData } = useQuery({
    queryKey: ['occupancy-status'],
    queryFn: async () => {
      // Get current user's profile to check agency
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) throw new Error("Agence non trouvée")

      const { data: properties } = await supabase
        .from('properties')
        .select('statut')
        .eq('agency_id', profile.agency_id)

      const statusCount = properties?.reduce((acc, property) => {
        const status = property.statut || 'Non défini'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      return Object.entries(statusCount).map(([name, value]) => ({
        name,
        value
      }))
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>État d'Occupation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {occupancyData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}