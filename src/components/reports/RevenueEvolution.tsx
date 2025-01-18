import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RevenueEvolutionProps {
  ownerId: string
}

export function RevenueEvolution({ ownerId }: RevenueEvolutionProps) {
  const { data: revenues = [], isLoading } = useQuery({
    queryKey: ['owner-monthly-revenue', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_monthly_revenue')
        .select('*')
        .eq('owner_id', ownerId)
        .order('month', { ascending: true })
        .limit(6)

      if (error) {
        console.error("Error fetching revenue data:", error)
        throw error
      }

      return data
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={revenues}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
            }}
          />
          <YAxis 
            tickFormatter={(value) => `${value.toLocaleString()} FCFA`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()} FCFA`]}
            labelFormatter={(label) => {
              const date = new Date(label)
              return `${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total_revenue" 
            name="Revenus totaux"
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="net_revenue" 
            name="Revenus nets"
            stroke="#82ca9d" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}