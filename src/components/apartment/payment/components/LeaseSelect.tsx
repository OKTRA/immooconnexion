import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeaseData } from "../hooks/usePaymentForm"

interface LeaseSelectProps {
  leases: LeaseData[]
  selectedLeaseId: string
  onLeaseSelect: (value: string) => void
}

export function LeaseSelect({ leases, selectedLeaseId, onLeaseSelect }: LeaseSelectProps) {
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