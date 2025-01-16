import { useState, useEffect } from "react";
import { LeaseData } from "../types";
import { UseFormSetValue } from "react-hook-form";
import { PaymentFormData } from "../types";

export function useLeaseSelection(
  leases: LeaseData[],
  setValue: UseFormSetValue<PaymentFormData>
) {
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>("");
  const [selectedLease, setSelectedLease] = useState<LeaseData | null>(null);

  useEffect(() => {
    if (selectedLeaseId) {
      const lease = leases.find(l => l.id === selectedLeaseId);
      setSelectedLease(lease || null);
      if (lease) {
        setValue("leaseId", lease.id);
        setValue("amount", lease.rent_amount);
      }
    }
  }, [selectedLeaseId, leases, setValue]);

  return {
    selectedLeaseId,
    setSelectedLeaseId,
    selectedLease,
    setSelectedLease
  };
}