import { LeaseData } from "../types";
import { LeaseHeader } from "./LeaseHeader";

interface LeasePaymentHeaderProps {
  lease: LeaseData;
  onInitialPayment: () => void;
}

export function LeasePaymentHeader({ lease, onInitialPayment }: LeasePaymentHeaderProps) {
  return (
    <LeaseHeader 
      lease={lease}
      onInitialPayment={onInitialPayment}
    />
  );
}