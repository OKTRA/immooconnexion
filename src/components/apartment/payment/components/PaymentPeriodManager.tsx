import { useState } from "react";
import { PeriodSelector } from "./PeriodSelector";
import { PaymentSummary } from "./PaymentSummary";
import { usePaymentCalculations } from "../hooks/usePaymentCalculations";
import { PaymentPeriod } from "@/types/payment";

interface PaymentPeriodManagerProps {
  lease: {
    rentAmount: number;
  };
  onPeriodsChange: (periods: string[]) => void;
  onPaymentDateChange: (date: Date) => void;
}

export function PaymentPeriodManager({
  lease,
  onPeriodsChange,
  onPaymentDateChange
}: PaymentPeriodManagerProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  const { summary } = usePaymentCalculations(
    selectedPeriods as unknown as PaymentPeriod[],
    lease.rentAmount
  );

  const handlePeriodsChange = (periods: string[]) => {
    setSelectedPeriods(periods);
    onPeriodsChange(periods);
  };

  const handlePaymentDateChange = (date: Date) => {
    setPaymentDate(date);
    onPaymentDateChange(date);
  };

  return (
    <div className="space-y-6">
      <PeriodSelector
        periods={[]}
        selectedPeriods={selectedPeriods}
        onPeriodsChange={handlePeriodsChange}
        paymentDate={paymentDate}
        onPaymentDateChange={handlePaymentDateChange}
      />
      <PaymentSummary summary={summary} />
    </div>
  );
}