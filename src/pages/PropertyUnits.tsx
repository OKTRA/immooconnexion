import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Building2, Home, Building } from "lucide-react"

export default function PropertyUnits() {
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestion des Appartements</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Tous les appartements</span>
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Disponibles</span>
            </TabsTrigger>
            <TabsTrigger value="occupied" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Occupés</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {properties?.map((property) => (
              <div key={property.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{property.bien}</h2>
                <PropertyUnitsManager propertyId={property.id} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            {properties?.map((property) => (
              <div key={property.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{property.bien}</h2>
                <PropertyUnitsManager 
                  propertyId={property.id}
                  filterStatus="available"
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="occupied" className="mt-6">
            {properties?.map((property) => (
              <div key={property.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{property.bien}</h2>
                <PropertyUnitsManager 
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