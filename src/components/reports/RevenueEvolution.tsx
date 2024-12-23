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
      // Get current user's profile to check role
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      // Get last 6 months
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        return {
          start: startOfMonth(date),
          month: format(date, 'MMM', { locale: fr })
        }
      }).reverse()

      // Build the query
      let query = supabase
        .from('contracts')
        .select('montant, created_at')
        .eq('type', 'loyer')

      // If not admin, filter by agency
      if (profile?.role !== 'admin') {
        query = query.eq('agency_id', user.id)
      }

      const { data: contracts } = await query

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