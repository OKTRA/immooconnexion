import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaleFormFieldsProps {
  formData: {
    buyer_name: string
    buyer_contact: string
    sale_price: string
    commission_amount: string
    sale_date: string
  }
  onChange: (field: string, value: string) => void
}

export function SaleFormFields({ formData, onChange }: SaleFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="buyer_name">Nom de l'acheteur</Label>
        <Input
          id="buyer_name"
          value={formData.buyer_name}
          onChange={(e) => onChange('buyer_name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyer_contact">Contact de l'acheteur</Label>
        <Input
          id="buyer_contact"
          value={formData.buyer_contact}
          onChange={(e) => onChange('buyer_contact', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sale_price">Prix de vente (FCFA)</Label>
        <Input
          id="sale_price"
          type="number"
          value={formData.sale_price}
          onChange={(e) => onChange('sale_price', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="commission_amount">Commission (FCFA)</Label>
        <Input
          id="commission_amount"
          type="number"
          value={formData.commission_amount}
          onChange={(e) => onChange('commission_amount', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sale_date">Date de vente</Label>
        <Input
          id="sale_date"
          type="date"
          value={formData.sale_date}
          onChange={(e) => onChange('sale_date', e.target.value)}
        />
      </div>
    </div>
  )
}