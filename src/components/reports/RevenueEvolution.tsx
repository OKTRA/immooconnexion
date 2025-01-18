import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Loader2 } from "lucide-react"

interface RevenueEvolutionProps {
  ownerId: string
}

export function RevenueEvolution({ ownerId }: RevenueEvolutionProps) {
  const { data: revenueData, isLoading } = useQuery({
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
        month: format(new Date(item.month), 'MMM yyyy', { locale: fr }),
        revenue: item.total_revenue,
        net: item.net_revenue
      }))
    }
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Revenus</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des Revenus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar name="Revenus Bruts" dataKey="revenue" fill="#0088FE" />
              <Bar name="Revenus Nets" dataKey="net" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}