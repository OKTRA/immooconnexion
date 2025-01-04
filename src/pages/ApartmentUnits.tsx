import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ApartmentUnits() {
  const { apartmentId } = useParams()
  const navigate = useNavigate()

  const { data: apartment } = useQuery({
    queryKey: ['apartment', apartmentId],
    queryFn: async () => {
      if (!apartmentId) return null
      
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('id', apartmentId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!apartmentId
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/agence/appartements')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">
              Unités de {apartment?.name || 'l\'appartement'}
            </h1>
          </div>
        </div>

        {apartmentId && (
          <PropertyUnitsManager propertyId={apartmentId} />
        )}
      </div>
    </AgencyLayout>
  )
}