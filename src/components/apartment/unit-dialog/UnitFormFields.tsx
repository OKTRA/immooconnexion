import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApartmentUnitFormData, ApartmentUnitStatus } from "@/components/apartment/types"

interface UnitFormFieldsProps {
  formData: ApartmentUnitFormData
  setFormData: (data: ApartmentUnitFormData) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrls?: string[]
}

export function UnitFormFields({
  formData,
  setFormData,
  handleImageChange,
  imagePreviewUrls = [],
}: UnitFormFieldsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="unit_number">Numéro d'unité</Label>
          <Input
            id="unit_number"
            value={formData.unit_number}
            onChange={(e) =>
              setFormData({ ...formData, unit_number: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="floor_number">Étage</Label>
          <Input
            id="floor_number"
            type="number"
            value={formData.floor_number}
            onChange={(e) =>
              setFormData({ ...formData, floor_number: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="area">Surface (m²)</Label>
          <Input
            id="area"
            type="number"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="rent_amount">Loyer de base</Label>
          <Input
            id="rent_amount"
            type="number"
            value={formData.rent_amount}
            onChange={(e) =>
              setFormData({ ...formData, rent_amount: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="deposit_amount">Caution</Label>
          <Input
            id="deposit_amount"
            type="number"
            value={formData.deposit_amount}
            onChange={(e) =>
              setFormData({ ...formData, deposit_amount: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="minimum_stay">Durée minimum de séjour</Label>
          <Input
            id="minimum_stay"
            type="number"
            value={formData.minimum_stay}
            onChange={(e) =>
              setFormData({ ...formData, minimum_stay: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="maximum_stay">Durée maximum de séjour</Label>
          <Input
            id="maximum_stay"
            type="number"
            value={formData.maximum_stay}
            onChange={(e) =>
              setFormData({ ...formData, maximum_stay: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="late_fee_percentage">Pénalité de retard (%)</Label>
          <Input
            id="late_fee_percentage"
            type="number"
            value={formData.late_fee_percentage}
            onChange={(e) =>
              setFormData({ ...formData, late_fee_percentage: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value: ApartmentUnitStatus) => setFormData({ ...formData, status: value })}
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
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="photos">Photos</Label>
          <Input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {imagePreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {imagePreviewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}