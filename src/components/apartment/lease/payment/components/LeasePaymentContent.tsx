import { LeaseData, PaymentListItem } from "../types";
import { PaymentsList } from "./PaymentsList";
import { PaymentTimeline } from "./PaymentTimeline";

interface LeasePaymentContentProps {
  lease: LeaseData;
  initialPayments: PaymentListItem[];
  regularPayments: PaymentListItem[];
}

export function LeasePaymentContent({ 
  lease,
  initialPayments,
  regularPayments
}: LeasePaymentContentProps) {
  return (
    <div className="space-y-8">
      {lease.initial_payments_completed && (
        <PaymentTimeline payments={regularPayments} />
      )}

      <PaymentsList
        title="Paiements Initiaux"
        payments={initialPayments}
        className="w-full"
      />

      {lease.initial_payments_completed && (
        <PaymentsList
          title="Paiements de Loyer"
          payments={regularPayments}
          className="w-full"
        />
      )}
    </div>
  );
}