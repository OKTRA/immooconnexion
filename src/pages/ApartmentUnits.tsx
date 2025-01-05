import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentUnitsManager } from "@/components/apartment/ApartmentUnitsManager"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Building } from "lucide-react"

export default function ApartmentUnits() {
  const { apartmentId } = useParams()

  const { data: apartment } = useQuery({
    queryKey: ['apartment', apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartments')
        .select('name')
        .eq('id', apartmentId)
        .single()
      
      if (error) throw error
      return data
    }
  })

  if (!apartmentId) {
    return <div>ID de l'appartement manquant</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building className="h-5 w-5" />
            {apartment?.name ? `Unités de ${apartment.name}` : 'Gestion des unités'}
          </h1>
        </div>
        <ApartmentUnitsManager apartmentId={apartmentId} />
      </div>
    </AgencyLayout>
  )
}