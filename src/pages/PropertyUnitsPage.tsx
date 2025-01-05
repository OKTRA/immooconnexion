import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartUnitsManager } from "@/components/admin/property/ApartUnitsManager"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Building, Users, Receipt, FileText, CreditCard } from "lucide-react"

export default function PropertyUnitsPage() {
  const { propertyId } = useParams()

  const { data: apartment } = useQuery({
    queryKey: ['apartment', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartments')
        .select('name')
        .eq('id', propertyId)
        .single()
      
      if (error) throw error
      return data
    }
  })

  if (!propertyId) {
    return <div>ID de la propriété manquant</div>
  }

  return (
    <AgencyLayout>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 w-full">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion de l'immeuble : {apartment?.name || 'Chargement...'}
          </h1>
        </div>

        <Tabs defaultValue="units" className="space-y-4">
          <TabsList className="bg-white p-1 flex w-full justify-start border rounded-lg h-14">
            <TabsTrigger value="units" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building className="h-4 w-4" />
              Unités
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              Locataires
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Receipt className="h-4 w-4" />
              Dépenses
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              Contrats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="mt-6">
            <ApartUnitsManager propertyId={propertyId} />
          </TabsContent>

          <TabsContent value="tenants">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-muted-foreground text-center">
                Gestion des locataires - Fonctionnalité à venir
              </p>
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-muted-foreground text-center">
                Gestion des dépenses - Fonctionnalité à venir
              </p>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-muted-foreground text-center">
                Gestion des paiements - Fonctionnalité à venir
              </p>
            </div>
          </TabsContent>

          <TabsContent value="contracts">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-muted-foreground text-center">
                Gestion des contrats - Fonctionnalité à venir
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}