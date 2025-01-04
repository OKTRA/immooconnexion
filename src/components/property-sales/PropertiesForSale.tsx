import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { PropertySaleDialog } from "./PropertySaleDialog"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"

export function PropertiesForSale() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [showSaleDialog, setShowSaleDialog] = useState(false)
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties-for-sale'],
    queryFn: async () => {
      console.log("Fetching properties for sale...")
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(name, address)
        `)
        .eq('is_for_sale', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log("Properties fetched:", data)
      return data || []
    }
  })

  const handleSale = (propertyId: string) => {
    setSelectedProperty(propertyId)
    setShowSaleDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PropertiesGrid properties={properties} />

      {selectedProperty && (
        <PropertySaleDialog
          propertyId={selectedProperty}
          open={showSaleDialog}
          onOpenChange={setShowSaleDialog}
        />
      )}
    </div>
  )
}