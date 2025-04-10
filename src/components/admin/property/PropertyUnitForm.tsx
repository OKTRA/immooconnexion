import { PropertyUnitFormData } from "./types/propertyUnit"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyUnitFormProps {
  formData: PropertyUnitFormData
  onChange: (field: keyof PropertyUnitFormData, value: any) => void
}

export function PropertyUnitForm({ formData, onChange }: PropertyUnitFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="unit_number">Numéro d'unité</Label>
        <Input
          id="unit_number"
          value={formData.unit_number}
          onChange={(e) => onChange("unit_number", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="floor_number">Étage</Label>
        <Input
          id="floor_number"
          type="number"
          value={formData.floor_number || ""}
          onChange={(e) => onChange("floor_number", e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>

      <div>
        <Label htmlFor="area">Surface (m²)</Label>
        <Input
          id="area"
          type="number"
          value={formData.area || ""}
          onChange={(e) => onChange("area", e.target.value ? parseFloat(e.target.value) : null)}
        />
      </div>

      <div>
        <Label htmlFor="rent_amount">Loyer</Label>
        <Input
          id="rent_amount"
          type="number"
          value={formData.rent_amount}
          onChange={(e) => onChange("rent_amount", parseInt(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="deposit_amount">Caution</Label>
        <Input
          id="deposit_amount"
          type="number"
          value={formData.deposit_amount || ""}
          onChange={(e) => onChange("deposit_amount", e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>

      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="occupied">Occupé</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
    </div>
  )
}