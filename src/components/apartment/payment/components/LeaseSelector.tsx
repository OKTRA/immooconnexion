import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { LeaseSelect } from "./LeaseSelect";
import { PaymentFormData, LeaseData } from "../types";

interface LeaseSelectorProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  form: UseFormReturn<PaymentFormData>;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}

export function LeaseSelector({
  leases,
  selectedLeaseId,
  form,
  onLeaseSelect,
  isLoading,
}: LeaseSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Contrat de location</Label>
      <LeaseSelect
        leases={leases}
        selectedLeaseId={selectedLeaseId}
        onLeaseSelect={(value) => {
          onLeaseSelect(value);
          form.setValue("leaseId", value);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}