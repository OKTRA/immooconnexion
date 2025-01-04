import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function RevenueChart() {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: async () => {
      console.log('Fetching revenue data...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Agence non trouvée")
      }

      console.log('User profile:', profile)

      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          montant,
          created_at,
          type
        `)
        .eq('type', 'loyer')
        .eq('agency_id', profile.agency_id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching revenue data:', error)
        throw error
      }

      console.log('Contracts retrieved:', contracts)

      // Group by month and sum revenues
      const monthlyRevenue = (contracts || []).reduce((acc: Record<string, number>, contract) => {
        const month = new Date(contract.created_at).toLocaleString('fr-FR', { month: 'short' })
        acc[month] = (acc[month] || 0) + contract.montant
        return acc
      }, {})

      return Object.entries(monthlyRevenue || {}).map(([month, revenue]) => ({
        name: month,
        revenue: revenue
      }))
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Évolution des Revenus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}