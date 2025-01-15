import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeaseData } from "../types";

interface PaymentDetailsProps {
  selectedLease: LeaseData | null;
  selectedPeriods: number;
}

export function PaymentDetails({ selectedLease, selectedPeriods }: PaymentDetailsProps) {
  if (!selectedLease) return null;

  return (
    <>
      <div className="space-y-2">
        <Label>Fréquence de paiement</Label>
        <Input
          value={
            selectedLease.payment_frequency === 'monthly' ? 'Mensuel' :
            selectedLease.payment_frequency === 'weekly' ? 'Hebdomadaire' :
            selectedLease.payment_frequency === 'daily' ? 'Quotidien' :
            selectedLease.payment_frequency === 'yearly' ? 'Annuel' : ''
          }
          disabled
          className="bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <Label>Montant du loyer</Label>
        <Input
          type="number"
          value={selectedLease.rent_amount}
          disabled
          className="bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <Label>Montant total</Label>
        <Input
          type="number"
          value={selectedLease.rent_amount * selectedPeriods}
          disabled
          className="bg-gray-50"
        />
      </div>
    </>
  );
}