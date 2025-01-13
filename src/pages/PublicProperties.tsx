import { PublicHeader } from "@/components/layout/PublicHeader"
import { HomeBanner } from "@/components/home/HomeBanner"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { Footer } from "@/components/layout/Footer"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Property } from "@/components/property/types"

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

      // Cast the property_category to the correct type
      const typedData = data?.map(item => ({
        ...item,
        property_category: item.property_category as "house" | "duplex" | "triplex"
      })) as (Property & { agency: { name: string; address: string } })[]

      return typedData || []
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