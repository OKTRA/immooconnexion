import { Label } from "@/components/ui/label"
import { PaymentMethodSelect } from "../../components/PaymentMethodSelect"

interface PaymentMethodFieldProps {
  value: string
  onChange: (value: string) => void
}

export function PaymentMethodField({ value, onChange }: PaymentMethodFieldProps) {
  return (
    <div>
      <Label>Mode de paiement</Label>
      <PaymentMethodSelect
        value={value}
        onChange={onChange}
      />
    </div>
  )
}