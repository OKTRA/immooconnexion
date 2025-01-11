import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LeaseFormData } from "../types"

interface PaymentFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
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
          placeholder="Montant en FCFA"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deposit_amount">Montant de la caution</Label>
        <Input
          id="deposit_amount"
          type="number"
          value={formData.deposit_amount}
          onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
          placeholder="Montant en FCFA"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agency_fees_percentage">Frais d'agence (%)</Label>
        <Input
          id="agency_fees_percentage"
          type="number"
          min="0"
          max="100"
          value={formData.agency_fees_percentage}
          onChange={(e) => setFormData({ ...formData, agency_fees_percentage: Number(e.target.value) })}
          placeholder="Par défaut 50% du loyer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="commission_percentage">Commission (%)</Label>
        <Input
          id="commission_percentage"
          type="number"
          min="5"
          max="25"
          value={formData.commission_percentage}
          onChange={(e) => setFormData({ ...formData, commission_percentage: Number(e.target.value) })}
          placeholder="Entre 5% et 25%"
        />
      </div>
    </div>
  )
}