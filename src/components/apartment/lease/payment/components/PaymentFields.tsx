import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { PaymentMethod } from "@/types/payment"

interface PaymentFieldsProps {
  depositAmount: number
  agencyFees: number
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (value: PaymentMethod) => void
  firstRentDate: Date
  onFirstRentDateChange: (date: Date) => void
}

export function PaymentFields({
  depositAmount,
  agencyFees,
  paymentMethod,
  onPaymentMethodChange,
  firstRentDate,
  onFirstRentDateChange
}: PaymentFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Caution</Label>
        <Input
          type="text"
          value={`${depositAmount.toLocaleString()} FCFA`}
          disabled
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Frais d'agence (50% du loyer)</Label>
        <Input
          type="text"
          value={`${agencyFees.toLocaleString()} FCFA`}
          disabled
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Mode de paiement</Label>
        <PaymentMethodSelect
          value={paymentMethod}
          onChange={onPaymentMethodChange}
        />
      </div>

      <div>
        <Label>Date du premier loyer</Label>
        <Input
          type="date"
          value={firstRentDate.toISOString().split('T')[0]}
          onChange={(e) => onFirstRentDateChange(new Date(e.target.value))}
          className="mt-1.5"
        />
      </div>
    </div>
  )
}