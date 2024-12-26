import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { StatCard } from "@/components/StatCard"
import { AgencyEarningsTable } from "@/components/AgencyEarningsTable"
import { RevenueChart } from "@/components/RevenueChart"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const AgencyEarnings = () => {
  const { data: stats } = useQuery({
    queryKey: ['agency-stats'],
    queryFn: async () => {
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          montant,
          type,
          properties (
            frais_agence,
            taux_commission
          )
        `)

      if (error) throw error

      // Calculate total agency fees
      const totalFraisAgence = contracts.reduce((sum, contract) => {
        if (contract.type === 'frais_agence') {
          return sum + contract.montant
        }
        return sum + (contract.properties?.frais_agence || 0)
      }, 0)

      // Calculate total commissions from rent
      const totalCommissions = contracts.reduce((sum, contract) => {
        if (contract.type === 'loyer') {
          return sum + ((contract.montant * (contract.properties?.taux_commission || 0)) / 100)
        }
        return sum
      }, 0)

      const totalGains = totalFraisAgence + totalCommissions

      return {
        totalFraisAgence,
        totalCommissions,
        totalGains
      }
    }
  })

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gain d'Agence</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard 
              title="Total Frais d'Agence" 
              value={`${stats?.totalFraisAgence?.toLocaleString() || 0} FCFA`}
              description="Inclut tous les frais d'agence perçus"
            />
            <StatCard 
              title="Commission sur Loyers" 
              value={`${stats?.totalCommissions?.toLocaleString() || 0} FCFA`}
              description="Commission mensuelle sur les loyers"
            />
            <StatCard 
              title="Total Gains" 
              value={`${stats?.totalGains?.toLocaleString() || 0} FCFA`}
              description="Total des frais et commissions"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Détails des Gains</h2>
            <AgencyEarningsTable />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <RevenueChart />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AgencyEarnings