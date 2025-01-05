import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/home/PublicNavbar"
import { HomeBanner } from "@/components/home/HomeBanner"
import { SearchBar } from "@/components/home/SearchBar"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Property } from "@/components/property/types"

export default function PublicProperties() {
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchLocation, setSearchLocation] = useState("")

  const { data: properties, isLoading } = useQuery({
    queryKey: ["public-properties", selectedAgency, selectedType, searchLocation],
    queryFn: async () => {
      console.log("Fetching properties with filters:", { selectedAgency, selectedType, searchLocation })
      let query = supabase
        .from("properties")
        .select(`
          *,
          agency:agencies(name, address)
        `)
        .eq("statut", "disponible")

      if (selectedAgency) {
        query = query.eq("agency_id", selectedAgency)
      }
      if (selectedType) {
        query = query.eq("type", selectedType)
      }
      if (searchLocation) {
        query = query.ilike("ville", `%${searchLocation}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching properties:", error)
        throw error
      }

      // Cast the property_category to the correct type
      const typedData = data?.map(item => ({
        ...item,
        property_category: item.property_category as "house" | "apartment"
      })) as (Property & { agency: { name: string; address: string } })[]

      console.log("Fetched properties:", typedData)
      return typedData || []
    }
  })

  useEffect(() => {
    document.title = "Biens Disponibles | Immoo.pro"
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PublicNavbar />
      
      <main className="container mx-auto px-4 pb-12 animate-fade-in">
        <HomeBanner />
        
        <div className="relative z-10 -mt-8 mb-12">
          <SearchBar
            onAgencyChange={setSelectedAgency}
            onTypeChange={setSelectedType}
            onLocationChange={setSearchLocation}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {properties.length} bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
            </h2>
            <PropertiesGrid properties={properties} />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Aucun bien disponible pour le moment
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Veuillez modifier vos critères de recherche ou réessayer plus tard
            </p>
          </div>
        )}
      </main>
    </div>
  )
}