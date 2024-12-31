import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { SearchBar } from "@/components/home/SearchBar"
import { HomeBanner } from "@/components/home/HomeBanner"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const PublicProperties = () => {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['public-properties'],
    queryFn: async () => {
      console.log("Fetching public properties...")
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(name, address)
        `)
        .eq('statut', 'disponible')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching properties:", error)
        throw error
      }

      console.log("Properties fetched:", data)
      return data || []
    },
    onError: (error: Error) => {
      console.error("Query error:", error)
      toast.error("Une erreur est survenue lors du chargement des propriétés")
    }
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">
            Une erreur est survenue lors du chargement des propriétés
          </div>
        </div>
      </div>
    )
  }

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