import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

interface ApartmentIdFieldProps {
  propertyId: string;
}

export function ApartmentIdField({ propertyId }: ApartmentIdFieldProps) {
  const { data: apartment } = useQuery({
    queryKey: ['apartment', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartments')
        .select('name')
        .eq('id', propertyId)
        .single()
      
      if (error) throw error
      return data
    }
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