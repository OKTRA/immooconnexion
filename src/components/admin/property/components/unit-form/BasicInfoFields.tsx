import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BasicInfoFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function BasicInfoFields({ formData, setFormData }: BasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="unit_number">Numéro d'unité</Label>
        <Input
          id="unit_number"
          value={formData.unit_number}
          onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
          placeholder="Ex: A101"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="floor_number">Étage</Label>
        <Input
          id="floor_number"
          type="number"
          value={formData.floor_number}
          onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
          placeholder="Ex: 1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Surface (m²)</Label>
        <Input
          id="area"
          type="number"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          placeholder="Ex: 75"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="luxe">Luxe</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}