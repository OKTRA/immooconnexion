import { PublicHeader } from "@/components/layout/PublicHeader"
import { HomeBanner } from "@/components/home/HomeBanner"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { Footer } from "@/components/layout/Footer"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function PublicProperties() {
  const { data: properties, isLoading } = useQuery({
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
      return data
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 container py-8">
        <HomeBanner />
        <PropertiesGrid properties={properties || []} />
      </main>
      <Footer />
    </div>
  )
}