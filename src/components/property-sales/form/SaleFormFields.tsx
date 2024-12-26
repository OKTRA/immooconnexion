import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SaleFormFieldsProps {
  formData: {
    property_name: string
    neighborhood: string
    city: string
    listing_date: string
    document_type: string
    sale_price: string
  }
  onChange: (field: string, value: string) => void
}

export function SaleFormFields({ formData, onChange }: SaleFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="property_name">Nom du bien</Label>
        <Input
          id="property_name"
          value={formData.property_name}
          onChange={(e) => onChange('property_name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Quartier</Label>
        <Input
          id="neighborhood"
          value={formData.neighborhood}
          onChange={(e) => onChange('neighborhood', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Ville / Pays</Label>
        <Input
          id="city"
          value={formData.city}
          placeholder="Ex: Abidjan, Côte d'Ivoire"
          onChange={(e) => onChange('city', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="listing_date">Date de mise en vente</Label>
        <Input
          id="listing_date"
          type="date"
          value={formData.listing_date}
          onChange={(e) => onChange('listing_date', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="document_type">Type de document</Label>
        <Select 
          value={formData.document_type} 
          onValueChange={(value) => onChange('document_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type de document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="titre_foncier">Titre Foncier</SelectItem>
            <SelectItem value="attestation_villageoise">Attestation Villageoise</SelectItem>
            <SelectItem value="lettre_attribution">Lettre d'Attribution</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
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
    </div>
  )
}