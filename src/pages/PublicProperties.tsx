import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyCard } from "@/components/home/PropertyCard"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { PublicNavbar } from "@/components/home/PublicNavbar"
import { HomeBanner } from "@/components/home/HomeBanner"

const PublicProperties = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: properties, isLoading } = useQuery({
    queryKey: ['public-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')  // Changed from 'statut' to 'status'
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const filteredProperties = properties?.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <HomeBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Rechercher par nom, adresse ou statut..."
            className="pl-10 w-full max-w-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Chargement des propriétés...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties?.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProperties