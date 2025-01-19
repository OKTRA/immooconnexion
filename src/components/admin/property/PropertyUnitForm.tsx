import { PropertyUnitFormData } from "./types/propertyUnit"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit_number">Numéro d'unité</Label>
          <Input
            id="unit_number"
            value={formData.unit_number}
            onChange={(e) => onChange("unit_number", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="unit_name">Nom de l'unité</Label>
          <Input
            id="unit_name"
            value={formData.unit_name || ''}
            onChange={(e) => onChange("unit_name", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="floor_level">Niveau/Étage</Label>
          <Input
            id="floor_level"
            value={formData.floor_level || ''}
            onChange={(e) => onChange("floor_level", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="area">Surface (m²)</Label>
          <Input
            id="area"
            type="number"
            min="0"
            step="0.01"
            value={formData.area || ''}
            onChange={(e) => onChange("area", e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="living_rooms">Nombre de salons</Label>
          <Input
            id="living_rooms"
            type="number"
            min="0"
            value={formData.living_rooms || 0}
            onChange={(e) => onChange("living_rooms", parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="bedrooms">Nombre de chambres</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            value={formData.bedrooms || 0}
            onChange={(e) => onChange("bedrooms", parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">Nombre de toilettes</Label>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            value={formData.bathrooms || 0}
            onChange={(e) => onChange("bathrooms", parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="store_count">Nombre de magasins</Label>
        <Input
          id="store_count"
          type="number"
          min="0"
          value={formData.store_count || 0}
          onChange={(e) => onChange("store_count", parseInt(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="kitchen_description">Description de la cuisine</Label>
        <Textarea
          id="kitchen_description"
          value={formData.kitchen_description || ''}
          onChange={(e) => onChange("kitchen_description", e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="has_pool"
          checked={formData.has_pool || false}
          onCheckedChange={(checked) => onChange("has_pool", checked)}
        />
        <Label htmlFor="has_pool">Piscine</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            value={formData.deposit_amount || ''}
            onChange={(e) => onChange("deposit_amount", e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
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
        <Label htmlFor="description">Description supplémentaire</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
    </div>
  )
}