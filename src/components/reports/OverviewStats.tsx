import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function OverviewStats() {
  const { data: stats } = useQuery({
    queryKey: ['overview-stats'],
    queryFn: async () => {
      const { data: properties } = await supabase
        .from('properties')
        .select('*')

      const { data: contracts } = await supabase
        .from('contracts')
        .select('montant, type')
        .eq('type', 'loyer')

      const totalProperties = properties?.length || 0
      const occupiedProperties = properties?.filter(p => p.statut === 'occupé').length || 0
      const occupancyRate = totalProperties ? Math.round((occupiedProperties / totalProperties) * 100) : 0
      const totalRevenue = contracts?.reduce((sum, contract) => sum + (contract.montant || 0), 0) || 0
      const totalAgencyFees = properties?.reduce((sum, property) => sum + (property.frais_agence || 0), 0) || 0

      return {
        totalProperties,
        occupancyRate,
        totalRevenue,
        totalAgencyFees
      }
    }
  })

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total des Biens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.totalProperties || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taux d'Occupation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.occupancyRate || 0}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenu Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {(stats?.totalRevenue || 0).toLocaleString()} FCFA
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frais d'Agence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {(stats?.totalAgencyFees || 0).toLocaleString()} FCFA
          </p>
        </CardContent>
      </Card>
    </div>
  )
}