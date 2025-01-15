import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeaseData } from "../types";

interface PaymentDetailsProps {
  selectedLease: LeaseData | null;
  selectedPeriods: number;
}

const getFrequencyLabel = (frequency: string): string => {
  switch (frequency) {
    case 'daily':
      return 'Quotidien';
    case 'weekly':
      return 'Hebdomadaire';
    case 'monthly':
      return 'Mensuel';
    case 'yearly':
      return 'Annuel';
    default:
      return '';
  }
};

export function PaymentDetails({ selectedLease, selectedPeriods }: PaymentDetailsProps) {
  if (!selectedLease) return null;

  return (
    <>
      <div className="space-y-2">
        <Label>Fréquence de paiement</Label>
        <Input
          value={getFrequencyLabel(selectedLease.payment_frequency)}
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