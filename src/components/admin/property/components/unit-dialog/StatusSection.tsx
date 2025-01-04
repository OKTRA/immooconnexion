import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatusSectionProps {
  status: string
  onStatusChange: (value: string) => void
}

export function StatusSection({ status, onStatusChange }: StatusSectionProps) {
  return (
    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm space-y-2">
      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Statut
      </Label>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="bg-white dark:bg-gray-700">
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