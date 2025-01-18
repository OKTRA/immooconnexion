import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export interface RevenueEvolutionProps {
  ownerId: string
}

export function RevenueEvolution({ ownerId }: RevenueEvolutionProps) {
  const { data: monthlyRevenue } = useQuery({
    queryKey: ['owner-monthly-revenue', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_monthly_revenue')
        .select('*')
        .eq('owner_id', ownerId)
        .order('month', { ascending: true })
        .limit(6)

      if (error) throw error

      return data.map(item => ({
        month: new Date(item.month).toLocaleDateString('fr-FR', { month: 'short' }),
        revenue: item.total_revenue,
        net: item.net_revenue
      }))
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des revenus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenu brut" />
              <Line type="monotone" dataKey="net" stroke="#82ca9d" name="Revenu net" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}