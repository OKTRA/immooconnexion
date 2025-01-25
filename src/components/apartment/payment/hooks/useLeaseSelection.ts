import { useState, useEffect } from "react"
import { LeaseData } from "../types"

export function useLeaseSelection(
  leases: LeaseData[] = [], // Provide default empty array
  setValue: (field: string, value: any) => void,
  initialLeaseId?: string
) {
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>(initialLeaseId || "")
  const [selectedLease, setSelectedLease] = useState<LeaseData | null>(null)

  useEffect(() => {
    if (initialLeaseId && leases && leases.length > 0) {
      const lease = leases.find(l => l.id === initialLeaseId)
      if (lease) {
        setSelectedLease(lease)
        setSelectedLeaseId(initialLeaseId)
      }
    }
  }, [initialLeaseId, leases])

  const handleLeaseSelect = (leaseId: string) => {
    if (!leases) return

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