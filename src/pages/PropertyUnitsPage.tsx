import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Key, FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function PropertyUnitsPage() {
  const { propertyId } = useParams()

  const { data: apartment, isLoading } = useQuery({
    queryKey: ['apartment', propertyId],
    queryFn: async () => {
      if (!propertyId) return null
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
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion de l'immeuble: {isLoading ? "Chargement..." : apartment?.name}
          </h1>
        </div>

        <Tabs defaultValue="units" orientation="vertical" className="flex">
          <TabsList className="flex flex-col h-[400px] w-48 bg-white rounded-lg shadow-sm">
            <TabsTrigger value="units" className="w-full justify-start gap-2 p-4">
              <Building2 className="h-5 w-5" />
              Unités
            </TabsTrigger>
            <TabsTrigger value="rentals" className="w-full justify-start gap-2 p-4">
              <Key className="h-5 w-5" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="contracts" className="w-full justify-start gap-2 p-4">
              <FileText className="h-5 w-5" />
              Contrats
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 pl-6">
            <TabsContent value="units" className="mt-0">
              <PropertyUnitsManager propertyId={propertyId} />
            </TabsContent>
            
            <TabsContent value="rentals" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                Gestion des locations - Fonctionnalité à venir
              </div>
            </TabsContent>
            
            <TabsContent value="contracts" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                Gestion des contrats - Fonctionnalité à venir
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}