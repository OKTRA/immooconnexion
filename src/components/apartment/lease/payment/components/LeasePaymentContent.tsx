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
  // Vérifier si first_rent_start_date existe dans le paiement de dépôt
  const depositPayment = initialPayments.find(p => p.payment_type === 'deposit');
  const shouldShowTimeline = depositPayment?.first_rent_start_date;

  return (
    <div className="space-y-8">
      {shouldShowTimeline && lease.initial_payments_completed && (
        <PaymentTimeline 
          lease={lease}
          initialPayments={initialPayments}
        />
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