import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LeaseFormData } from "../types"

interface PaymentFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
  selectedUnitId: string | null;
}

export function PaymentFields({ formData, setFormData, selectedUnitId }: PaymentFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="rent_amount">Montant du loyer</Label>
        <Input
          type="number"
          value={formData.rent_amount}
          onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
          readOnly={!!selectedUnitId}
          className={selectedUnitId ? "bg-gray-100" : ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deposit_amount">Montant de la caution</Label>
        <Input
          type="number"
          value={formData.deposit_amount}
          onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
          readOnly={!!selectedUnitId}
          className={selectedUnitId ? "bg-gray-100" : ""}
          required
        />
      </div>
    </div>
  )
}