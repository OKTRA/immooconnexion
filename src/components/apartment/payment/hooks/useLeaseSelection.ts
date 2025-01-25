import { useState } from "react"
import { LeaseData } from "../types"

export function useLeaseSelection(
  leases: LeaseData[],
  setValue: (field: string, value: any) => void,
  initialLeaseId?: string
) {
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>(initialLeaseId || "")
  const [selectedLease, setSelectedLease] = useState<LeaseData | null>(
    initialLeaseId ? leases.find(l => l.id === initialLeaseId) || null : null
  )

  const handleLeaseSelect = (leaseId: string) => {
    const lease = leases.find(l => l.id === leaseId)
    setSelectedLeaseId(leaseId)
    setSelectedLease(lease || null)
    setValue("leaseId", leaseId)
  }

  return {
    selectedLeaseId,
    setSelectedLeaseId: handleLeaseSelect,
    selectedLease,
    setSelectedLease
  }
}