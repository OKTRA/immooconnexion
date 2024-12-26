import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { SearchBar } from "@/components/home/SearchBar"
import { HomeBanner } from "@/components/home/HomeBanner"
import { Loader2 } from "lucide-react"

const PublicProperties = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['public-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(name, address)
        `)
        .eq('statut', 'disponible')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <HomeBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar />
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <PropertiesGrid properties={properties || []} />
        )}
      </div>
    </div>
  )
}

export default PublicProperties