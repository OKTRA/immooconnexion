import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { startOfMonth, format, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

export function RevenueEvolution() {
  const { data: revenueData } = useQuery({
    queryKey: ['revenue-evolution'],
    queryFn: async () => {
      // Get last 6 months
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        return {
          start: startOfMonth(date),
          month: format(date, 'MMM', { locale: fr })
        }
      }).reverse()

      const { data: contracts } = await supabase
        .from('contracts')
        .select('montant, created_at')
        .eq('type', 'loyer')

      return months.map(({ start, month }) => {
        const monthlyRevenue = contracts?.reduce((sum, contract) => {
          const contractDate = new Date(contract.created_at)
          if (contractDate >= start && contractDate < new Date(start.getFullYear(), start.getMonth() + 1, 1)) {
            return sum + (contract.montant || 0)
          }
          return sum
        }, 0) || 0

        return {
          month,
          revenue: monthlyRevenue
        }
      })
    }
  })

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
              <Bar dataKey="revenue" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}