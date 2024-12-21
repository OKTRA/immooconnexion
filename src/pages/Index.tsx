import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { PropertyTable } from "@/components/PropertyTable"
import { RevenueChart } from "@/components/RevenueChart"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Biens</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard title="Biens en Location" value="42" />
            <StatCard title="Taux d'Occupation" value="95%" />
            <StatCard title="Revenus Mensuels" value="45 500 €" />
            <StatCard title="Commissions" value="2 275 €" />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Dernières Activités</h2>
            <PropertyTable />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <RevenueChart />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Index