import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ApartmentsTabProps {
  ownerId: string
}

export function ApartmentsTab({ ownerId }: ApartmentsTabProps) {
  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['owner-apartments', ownerId],
    queryFn: async () => {
      console.log("Fetching apartments for owner:", ownerId)
      const { data, error } = await supabase
        .from('apartments')
        .select(`
          *,
          apartment_units (
            id,
            unit_number,
            status
          )
        `)
        .eq('owner_id', ownerId)

      if (error) {
        console.error("Error fetching apartments:", error)
        throw error
      }

      console.log("Fetched apartments:", data)
      return data
    }
  })

  if (isLoading) {
    return <div>Chargement des appartements...</div>
  }

  if (!apartments.length) {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun appartement</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ce propriétaire n'a pas encore d'appartements enregistrés.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {apartments.map((apartment) => (
        <Card key={apartment.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{apartment.name}</h3>
              <Badge>
                {apartment.apartment_units?.length || 0} unités
              </Badge>
            </div>
            {apartment.address && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {apartment.address}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="text-sm">
                <span className="font-medium">Disponibles: </span>
                {apartment.apartment_units?.filter(unit => unit.status === 'available').length || 0}
              </div>
              <div className="text-sm">
                <span className="font-medium">Occupées: </span>
                {apartment.apartment_units?.filter(unit => unit.status === 'occupied').length || 0}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}