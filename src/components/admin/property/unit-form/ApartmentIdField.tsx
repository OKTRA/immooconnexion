import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ApartmentIdFieldProps {
  propertyId: string;  // This will contain the apartment ID
}

export function ApartmentIdField({ propertyId }: ApartmentIdFieldProps) {
  const { data: apartment } = useQuery({
    queryKey: ['apartment', propertyId],
    queryFn: async () => {
      // Ne pas exécuter la requête si l'ID n'est pas valide
      if (!propertyId || propertyId === ':apartmentId') {
        return null
      }

      const { data, error } = await supabase
        .from('apartments')
        .select('name')
        .eq('id', propertyId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!propertyId && propertyId !== ':apartmentId',
  })

  return (
    <div className="space-y-2">
      <Label>Appartement</Label>
      <Input
        value={apartment?.name || 'Chargement...'}
        readOnly
        disabled
        className="bg-gray-100"
      />
    </div>
  )
}