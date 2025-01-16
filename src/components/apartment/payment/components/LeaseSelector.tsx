import { Label } from "@/components/ui/label"
import { LeaseSelect } from "./LeaseSelect"
import { LeaseData } from "../types"

interface LeaseSelectorProps {
  leases: LeaseData[]
  selectedLeaseId: string
  onLeaseSelect: (value: string) => void
  isLoading: boolean
}

export function LeaseSelector({
  leases,
  selectedLeaseId,
  onLeaseSelect,
  isLoading,
}: LeaseSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Contrat de location</Label>
      <LeaseSelect
        leases={leases}
        selectedLeaseId={selectedLeaseId}
        onLeaseSelect={onLeaseSelect}
        isLoading={isLoading}
      />
    </div>
  )
}