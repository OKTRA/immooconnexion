import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaymentFieldsProps {
  formData: any
  setFormData: (data: any) => void
}

export function PaymentFields({ formData, setFormData }: PaymentFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="rent_amount">Montant du loyer</Label>
        <Input
          id="rent_amount"
          type="number"
          value={formData.rent_amount}
          onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deposit_amount">Caution</Label>
        <Input
          id="deposit_amount"
          type="number"
          value={formData.deposit_amount}
          onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
          required
        />
      </div>
    </div>
  )
}