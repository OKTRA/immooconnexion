import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartUnitsManager } from "@/components/admin/property/ApartUnitsManager"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Building, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export default function PropertyUnitsPage() {
  const navigate = useNavigate()
  const { data: properties } = useQuery({
    queryKey: ["apartment-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("type", "appartement")
      
      if (error) throw error
      return data
    }
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Appartements</h1>
          <Button 
            onClick={() => navigate("/agence/biens/ajouter")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un appartement
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full space-y-6">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4 py-2">
              <Building2 className="h-4 w-4" />
              <span>Tous les appartements</span>
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2 px-4 py-2">
              <Home className="h-4 w-4" />
              <span>Disponibles</span>
            </TabsTrigger>
            <TabsTrigger value="occupied" className="flex items-center gap-2 px-4 py-2">
              <Building className="h-4 w-4" />
              <span>Occupés</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 bg-gray-50 p-4 rounded-lg">
            {properties?.map((property) => (
              <div key={property.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">{property.bien}</h2>
                <ApartUnitsManager propertyId={property.id} />
              </div>
            ))}
            {!properties?.length && (
              <div className="text-center py-8 text-gray-500">
                Aucun appartement trouvé
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6 bg-gray-50 p-4 rounded-lg">
            {properties?.map((property) => (
              <div key={property.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">{property.bien}</h2>
                <ApartUnitsManager 
                  propertyId={property.id}
                  filterStatus="available"
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="occupied" className="mt-6 bg-gray-50 p-4 rounded-lg">
            {properties?.map((property) => (
              <div key={property.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">{property.bien}</h2>
                <ApartUnitsManager 
                  propertyId={property.id}
                  filterStatus="occupied"
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}