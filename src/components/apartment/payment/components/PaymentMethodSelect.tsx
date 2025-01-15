import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentMethod } from "../types"

interface PaymentMethodSelectProps {
  value: PaymentMethod
  onChange: (value: PaymentMethod) => void
}

export function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un mode de paiement" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash">Espèces</SelectItem>
        <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
        <SelectItem value="mobile_money">Mobile Money</SelectItem>
      </SelectContent>
    </Select>
  )
}