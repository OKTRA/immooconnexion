import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { PropertyTable } from "@/components/PropertyTable"
import { RevenueChart } from "@/components/RevenueChart"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyDialog } from "@/components/PropertyDialog"
import { useState } from "react"

const Index = () => {
  const [addPropertyDialogOpen, setAddPropertyDialogOpen] = useState(false)

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties...')
      const { data, error } = await supabase
        .from('properties')
        .select('*')
      
      if (error) {
        console.error('Error fetching properties:', error)
        throw error
      }
      
      console.log('Properties fetched:', data)
      return data
    }
  })

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-8">
            <div>Chargement...</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Biens</h1>
            <Button onClick={() => setAddPropertyDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard 
              title="Biens en Location" 
              value={properties?.length.toString() || "0"} 
            />
            <StatCard 
              title="Taux d'Occupation" 
              value={properties?.filter(p => p.statut === 'occupé').length + '%' || "0%"} 
            />
            <StatCard 
              title="Revenus Mensuels" 
              value={`${properties?.reduce((acc, p) => acc + (p.loyer || 0), 0)} FCFA` || "0 FCFA"} 
            />
            <StatCard 
              title="Commissions" 
              value={`${properties?.reduce((acc, p) => acc + (p.frais_agence || 0), 0)} FCFA` || "0 FCFA"} 
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Dernières Activités</h2>
            <PropertyTable />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <RevenueChart />
          </div>

          <PropertyDialog
            open={addPropertyDialogOpen}
            onOpenChange={setAddPropertyDialogOpen}
          />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Index