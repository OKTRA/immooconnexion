import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyUnitsManager } from "@/components/admin/property/PropertyUnitsManager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PropertyUnits() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (!profile?.agency_id) throw new Error("No agency found")

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agency_id", profile.agency_id)
        .order("bien")

      if (error) throw error
      return data
    },
  })

  if (propertiesLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestion des Appartements</h1>
        <p>Chargement des propriétés...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Appartements</h1>
      
      <div className="max-w-md">
        <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une propriété" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.bien}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPropertyId ? (
        <PropertyUnitsManager propertyId={selectedPropertyId} />
      ) : (
        <p className="text-gray-500">
          Veuillez sélectionner une propriété pour gérer ses unités
        </p>
      )}
    </div>
  )
}