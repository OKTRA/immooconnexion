import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentTypeFieldProps {
  value: 'current' | 'advance'
  onChange: (value: 'current' | 'advance') => void
}

export function PaymentTypeField({ value, onChange }: PaymentTypeFieldProps) {
  return (
    <div>
      <Label>Type de paiement</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current">Paiement période courante</SelectItem>
          <SelectItem value="advance">Paiement d'avance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}