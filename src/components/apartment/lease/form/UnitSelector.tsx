import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface UnitSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      console.log("Fetching available units...")
      
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        console.log("No agency found for user")
        return []
      }

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          rent_amount,
          apartment:apartments (
            id,
            name
          )
        `)
        .eq("status", "available")
        .eq("apartments.agency_id", userProfile.agency_id)

      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }

      console.log("Available units:", data)
      return data || []
    },
  })

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (!units.length) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Aucune unité disponible" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner une unité" />
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.apartment?.name} - Unité {unit.unit_number} (
            {unit.rent_amount?.toLocaleString()} FCFA)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}