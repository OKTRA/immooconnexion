import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethodSelectProps {
  value: string
  onChange: (value: "cash" | "bank_transfer" | "mobile_money") => void
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