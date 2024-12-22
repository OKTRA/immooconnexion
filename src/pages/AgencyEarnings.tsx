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
          properties (
            frais_agence,
            taux_commission
          )
        `)
        .eq('type', 'loyer')

      if (error) throw error

      const totalFraisAgence = contracts.reduce((sum, contract) => 
        sum + (contract.properties?.frais_agence || 0), 0)

      const totalCommissions = contracts.reduce((sum, contract) => 
        sum + ((contract.montant * (contract.properties?.taux_commission || 0)) / 100), 0)

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
            />
            <StatCard 
              title="Commission sur Loyers (Mensuel)" 
              value={`${stats?.totalCommissions?.toLocaleString() || 0} FCFA`}
            />
            <StatCard 
              title="Total Gains" 
              value={`${stats?.totalGains?.toLocaleString() || 0} FCFA`}
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