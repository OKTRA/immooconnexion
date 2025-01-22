import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ApartmentUnit } from "@/types/apartment"

interface SimpleUnitSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function SimpleUnitSelector({ value, onValueChange }: SimpleUnitSelectorProps) {
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      try {
        const { data: profile } = await supabase.auth.getUser()
        if (!profile.user) throw new Error("Non authentifié")

        const { data: userProfile } = await supabase
          .from("profiles")
          .select("agency_id")
          .eq("id", profile.user.id)
          .maybeSingle()

        if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

        console.log("Fetching units for agency:", userProfile.agency_id)

        const { data, error } = await supabase
          .from("apartment_units")
          .select(`
            id,
            unit_number,
            area,
            floor_number,
            apartment:apartments!inner (
              name
            )
          `)
          .eq("status", "available")
          .eq("apartments.agency_id", userProfile.agency_id)

        if (error) throw error
        return data as ApartmentUnit[]
      } catch (error) {
        console.error("Error fetching units:", error)
        return []
      }
    }
  })

  // Group units by apartment
  const groupedUnits = units.reduce((acc, unit) => {
    const apartmentName = unit.apartment.name
    if (!acc[apartmentName]) {
      acc[apartmentName] = []
    }
    acc[apartmentName].push(unit)
    return acc
  }, {} as Record<string, ApartmentUnit[]>)

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Unité d'appartement</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Chargement..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>Unité d'appartement</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une unité" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedUnits).map(([apartmentName, units]) => (
            <SelectGroup key={apartmentName}>
              <SelectLabel>{apartmentName}</SelectLabel>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  Unité {unit.unit_number}
                  {unit.area && ` - ${unit.area}m²`}
                  {unit.floor_number && ` - Étage ${unit.floor_number}`}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}