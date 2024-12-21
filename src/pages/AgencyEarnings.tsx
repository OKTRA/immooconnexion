import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { StatCard } from "@/components/StatCard"
import { AgencyEarningsTable } from "@/components/AgencyEarningsTable"
import { RevenueChart } from "@/components/RevenueChart"

const AgencyEarnings = () => {
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
              value="450 000 FCFA" 
            />
            <StatCard 
              title="Commission sur Loyers (Mensuel)" 
              value="125 000 FCFA" 
            />
            <StatCard 
              title="Total Gains" 
              value="575 000 FCFA" 
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