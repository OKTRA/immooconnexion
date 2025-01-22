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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UnitSearchFieldProps {
  unitId?: string
  onChange: (unitId: string) => void
}

interface ApartmentUnit {
  id: string
  unit_number: string
  area?: number
  floor_number?: number
  apartment: {
    name: string
  }
}

export function UnitSearchField({ unitId, onChange }: UnitSearchFieldProps) {
  const [open, setOpen] = useState(false)
  
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          area,
          floor_number,
          apartment:apartments (
            name
          )
        `)
        .eq("status", "available")
        .single()

      if (error) {
        console.error("Error fetching units:", error)
        return []
      }
      
      return data ? [data] as ApartmentUnit[] : []
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const selectedUnit = units.find((unit) => unit.id === unitId)

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
                : "Sélectionner une unité..."
              }
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