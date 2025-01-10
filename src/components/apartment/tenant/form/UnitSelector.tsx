import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface UnitSelectorProps {
  apartmentId: string
  value: string
  onChange: (value: string) => void
}

export function UnitSelector({ apartmentId, value, onChange }: UnitSelectorProps) {
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["available-units", apartmentId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Agency ID not found")

      let query = supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          apartment:apartments (
            name
          )
        `)
        .eq("status", "available")

      if (apartmentId !== "all") {
        query = query.eq("apartment_id", apartmentId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    }
  })

  return (
    <div className="space-y-2">
      <Label htmlFor="unit">Unité d'appartement</Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger id="unit">
          <SelectValue placeholder="Sélectionner une unité" />
        </SelectTrigger>
        <SelectContent>
          {units.map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              {unit.apartment?.name} - Unité {unit.unit_number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}