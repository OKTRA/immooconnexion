import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PricingFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function PricingFields({ formData, setFormData }: PricingFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="rent">Loyer mensuel (FCFA)</Label>
        <Input
          id="rent"
          type="number"
          value={formData.rent}
          onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
          placeholder="ex: 150000"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deposit">Caution (FCFA)</Label>
        <Input
          id="deposit"
          type="number"
          value={formData.deposit}
          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
          placeholder="ex: 300000"
        />
      </div>
    </div>
  )
}