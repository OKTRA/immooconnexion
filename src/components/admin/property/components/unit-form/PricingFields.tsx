import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PricingFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function PricingFields({ formData, setFormData }: PricingFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="rent">Loyer mensuel (FCFA)</Label>
        <Input
          id="rent"
          type="number"
          value={formData.rent}
          onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
          placeholder="Ex: 150000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deposit">Caution (FCFA)</Label>
        <Input
          id="deposit"
          type="number"
          value={formData.deposit}
          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
          placeholder="Ex: 300000"
        />
      </div>
    </div>
  )
}