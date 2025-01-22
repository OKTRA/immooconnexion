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
          apartment:apartments (
            name
          )
        `)
        .eq("status", "available")

      if (error) throw error
      
      return (data || []).map(unit => ({
        id: unit.id,
        unit_number: unit.unit_number,
        apartment: {
          name: unit.apartment?.name || ''
        }
      })) as ApartmentUnit[]
    }
  })

  const selectedUnit = units.find((unit) => unit.id === unitId)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sélectionner une unité</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedUnit ? 
                  `Unité ${selectedUnit.unit_number}` 
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
                      Unité {unit.unit_number}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {selectedUnit && (
          <div className="space-y-2">
            <Label>Appartement</Label>
            <Input
              value={selectedUnit.apartment.name}
              readOnly
              className="bg-muted"
            />
          </div>
        )}
      </div>
    </div>
  )
}