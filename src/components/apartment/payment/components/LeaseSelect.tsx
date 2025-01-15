import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeaseSelectProps } from "../types"
import { Loader2 } from "lucide-react"

export function LeaseSelect({ leases, selectedLeaseId, onLeaseSelect, isLoading }: LeaseSelectProps) {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Chargement des baux...</span>
      </div>
    )
  }

  return (
    <Select value={selectedLeaseId} onValueChange={onLeaseSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un contrat" />
      </SelectTrigger>
      <SelectContent>
        {leases.map((lease) => (
          <SelectItem key={lease.id} value={lease.id}>
            {lease.apartment_tenants.first_name} {lease.apartment_tenants.last_name} - {lease.apartment_units.apartment.name} (Unité {lease.apartment_units.unit_number})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}