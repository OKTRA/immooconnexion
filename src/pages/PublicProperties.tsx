import { PublicNavbar } from "@/components/home/PublicNavbar"
import { HomeBanner } from "@/components/home/HomeBanner"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { SearchBar } from "@/components/home/SearchBar"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Property } from "@/types/property"

export default function PublicProperties() {
  const { data: properties = [] } = useQuery({
    queryKey: ['public-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(
            name,
            address
          )
        `)
        .eq('statut', 'disponible')
      
      if (error) throw error
      return data as Property[]
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8">
        <HomeBanner />
        <SearchBar />
        <PropertiesGrid properties={properties} />
      </main>
    </div>
  )
}