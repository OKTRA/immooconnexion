import { Check, ChevronsUpDown, Search } from "lucide-react"
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
  } | null
}

export function UnitSearchField({ unitId, onChange }: UnitSearchFieldProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["available-units", searchQuery],
    queryFn: async () => {
      const query = supabase
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

      if (searchQuery) {
        query.or(`unit_number.ilike.%${searchQuery}%,apartment.name.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }
      
      return (data || []) as ApartmentUnit[]
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const selectedUnit = units.find((unit) => unit.id === unitId)

  const handleSelect = (value: string) => {
    onChange(value)
    // Ne pas fermer le popover immédiatement pour éviter la fermeture du formulaire
    setTimeout(() => setOpen(false), 100)
  }

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
                onClick={(e) => {
                  e.preventDefault() // Empêcher la propagation qui pourrait fermer le formulaire
                  setOpen(!open)
                }}
              >
                {selectedUnit ? 
                  `Unité ${selectedUnit.unit_number} - ${selectedUnit.apartment?.name || ""}` 
                  : "Sélectionner une unité..."
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command shouldFilter={false}>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    placeholder="Rechercher une unité..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                </div>
                <CommandEmpty>Aucune unité trouvée.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {units.map((unit) => (
                    <CommandItem
                      key={unit.id}
                      value={unit.id}
                      onSelect={() => handleSelect(unit.id)}
                      className="flex flex-col items-start py-2"
                    >
                      <div className="flex items-center w-full">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            unitId === unit.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div className="font-medium">
                            Unité {unit.unit_number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {unit.apartment?.name || "Non spécifié"}
                            {unit.area && ` | ${unit.area}m²`}
                            {unit.floor_number && ` | Étage ${unit.floor_number}`}
                          </div>
                        </div>
                      </div>
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
              value={selectedUnit.apartment?.name || "Non spécifié"}
              readOnly
              className="bg-muted"
            />
          </div>
        )}
      </div>
    </div>
  )
}