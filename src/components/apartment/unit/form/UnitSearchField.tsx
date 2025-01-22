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

interface Unit {
  id: string
  unit_number: string
  apartment_name?: string
}

interface UnitSearchFieldProps {
  units: Unit[]
  selectedUnit?: string
  onUnitSelect: (unitId: string) => void
}

export function UnitSearchField({ units, selectedUnit, onUnitSelect }: UnitSearchFieldProps) {
  const [open, setOpen] = useState(false)
  
  const selectedUnitData = units.find((unit) => unit.id === selectedUnit)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUnitData ? `${selectedUnitData.unit_number} ${selectedUnitData.apartment_name || ''}` : "Sélectionner une unité..."}
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
                  onUnitSelect(unit.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedUnit === unit.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {unit.unit_number} {unit.apartment_name && `- ${unit.apartment_name}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}