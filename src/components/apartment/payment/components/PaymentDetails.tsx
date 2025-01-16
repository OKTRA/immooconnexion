import { LeaseData } from "../types"

interface PaymentDetailsProps {
  selectedLease: LeaseData
  selectedPeriods: number
}

export function PaymentDetails({ selectedLease, selectedPeriods }: PaymentDetailsProps) {
  const totalAmount = selectedLease.rent_amount * selectedPeriods

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <h3 className="font-semibold">Détails du paiement</h3>
        <div className="flex justify-between text-sm">
          <span>Loyer mensuel</span>
          <span className="font-medium">{selectedLease.rent_amount.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Nombre de périodes</span>
          <span className="font-medium">{selectedPeriods}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span>Montant total</span>
          <span>{totalAmount.toLocaleString()} FCFA</span>
        </div>
      </div>
    </div>
  )
}