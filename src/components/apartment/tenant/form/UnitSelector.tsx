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
import { Skeleton } from "@/components/ui/skeleton"

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
          rent_amount,
          apartment:apartments (
            name,
            address
          )
        `)
        .eq("status", "available")

      if (apartmentId !== "all") {
        query = query.eq("apartment_id", apartmentId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    enabled: !!apartmentId
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Unité d'appartement</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="unit">Unité d'appartement</Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger id="unit" className="w-full">
          <SelectValue placeholder="Sélectionner une unité disponible" />
        </SelectTrigger>
        <SelectContent>
          {units.length === 0 ? (
            <SelectItem value="" disabled>
              Aucune unité disponible
            </SelectItem>
          ) : (
            units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.apartment?.name} - Unité {unit.unit_number} ({unit.rent_amount.toLocaleString()} FCFA)
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}