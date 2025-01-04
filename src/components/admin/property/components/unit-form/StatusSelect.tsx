import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="available">Disponible</SelectItem>
          <SelectItem value="occupied">Occupé</SelectItem>
          <SelectItem value="maintenance">En maintenance</SelectItem>
          <SelectItem value="reserved">Réservé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}