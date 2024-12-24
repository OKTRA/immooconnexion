import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { SearchBar } from "@/components/home/SearchBar"
import { PublicNavbar } from "@/components/home/PublicNavbar"
import { Property } from "@/components/property/types"

interface PropertyWithAgency extends Omit<Property, 'agencies'> {
  agencies?: {
    name: string;
    address: string;
  } | null;
  agency_name: string;
  agency_address: string;
  status: string;
}

const PublicProperties = () => {
  const { data: properties = [] } = useQuery({
    queryKey: ['public-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agencies (
            name,
            address
          )
        `)
        .eq('statut', 'disponible')

      if (error) throw error

      return (data as Array<Property & { agencies: { name: string; address: string; } | null }>).map(property => ({
        ...property,
        agency_name: property.agencies?.name || 'Non renseigné',
        agency_address: property.agencies?.address || 'Non renseigné',
        status: property.statut
      })) as PropertyWithAgency[]
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <PropertiesGrid properties={properties} />
      </main>
    </div>
  )
}

export default PublicProperties