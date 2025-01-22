import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Label } from "@/components/ui/label"

interface ApartmentUnit {
  id: string
  unit_number: string
  area?: number | null
  floor_number?: number | null
  apartment: {
    name: string
  }
}

interface UnitSearchFieldProps {
  unitId?: string
  onChange: (unitId: string) => void
}

export function UnitSearchField({ unitId, onChange }: UnitSearchFieldProps) {
  const [open, setOpen] = useState(false)
  
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

        if (error) {
          console.error("Error fetching units:", error)
          throw error
        }

        console.log("Fetched units:", data)
        
        if (!data) return []

        return data.map(unit => ({
          id: unit.id,
          unit_number: unit.unit_number,
          area: unit.area,
          floor_number: unit.floor_number,
          apartment: {
            name: unit.apartment?.name || ''
          }
        }))
      } catch (error) {
        console.error("Error in useQuery:", error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const selectedUnit = units.find((unit) => unit.id === unitId)

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary" />
        <span>Chargement des unités...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Sélectionner une unité</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              onClick={(e) => {
                e.preventDefault()
                setOpen(!open)
              }}
            >
              {selectedUnit ? 
                `Unité ${selectedUnit.unit_number} - ${selectedUnit.apartment.name}` 
                : "Sélectionner une unité..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher une unité..." />
              <CommandEmpty>Aucune unité trouvée.</CommandEmpty>
              <CommandGroup>
                {units.map((unit) => (
                  <CommandItem
                    key={unit.id}
                    value={unit.id}
                    onSelect={() => {
                      onChange(unit.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        unitId === unit.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <div>
                        Unité {unit.unit_number} - {unit.apartment.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {unit.area && `${unit.area}m² | `}
                        {unit.floor_number && `Étage ${unit.floor_number}`}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}