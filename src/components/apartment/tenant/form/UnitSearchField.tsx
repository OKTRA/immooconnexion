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
import { supabase } from "@/integrations/supabase/client"

interface UnitSearchFieldProps {
  unitId?: string;
  onChange: (unitId: string) => void;
}

export function UnitSearchField({ unitId, onChange }: UnitSearchFieldProps) {
  const [open, setOpen] = useState(false)
  
  const { data: units = [] } = useQuery({
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
      return data || []
    }
  })

  const selectedUnit = units.find((unit) => unit.id === unitId)

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedUnit ? 
              `${selectedUnit.unit_number} - ${selectedUnit.apartment?.name || ''}` 
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
                  {unit.unit_number} {unit.apartment?.name && `- ${unit.apartment.name}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}