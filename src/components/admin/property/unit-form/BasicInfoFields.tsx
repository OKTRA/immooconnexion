import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function BasicInfoFields({ formData, setFormData }: BasicInfoFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="unit_number">Numéro d'unité</Label>
        <Input
          id="unit_number"
          value={formData.unit_number}
          onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
          placeholder="ex: A101"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="floor_number">Étage</Label>
        <Input
          id="floor_number"
          type="number"
          value={formData.floor_number}
          onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
          placeholder="ex: 1"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="area">Surface (m²)</Label>
        <Input
          id="area"
          type="number"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          placeholder="ex: 75"
        />
      </div>
    </div>
  )
}