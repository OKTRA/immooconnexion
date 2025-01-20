import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { ApartmentUnitFormData, ApartmentUnitStatus } from "@/types/apartment"

interface UnitFormFieldsProps {
  formData: ApartmentUnitFormData;
  setFormData: (data: ApartmentUnitFormData) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrls: string[];
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
          <Label htmlFor="unit_name">Nom de l'unité</Label>
          <Input
            id="unit_name"
            value={formData.unit_name || ''}
            onChange={(e) =>
              setFormData({ ...formData, unit_name: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="floor_number">Étage</Label>
          <Input
            id="floor_number"
            type="number"
            value={formData.floor_number || ''}
            onChange={(e) =>
              setFormData({ ...formData, floor_number: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>

        <div>
          <Label htmlFor="area">Surface (m²)</Label>
          <Input
            id="area"
            type="number"
            value={formData.area || ''}
            onChange={(e) => 
              setFormData({ ...formData, area: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="living_rooms">Nombre de salons</Label>
            <Input
              id="living_rooms"
              type="number"
              min="0"
              value={formData.living_rooms || 0}
              onChange={(e) =>
                setFormData({ ...formData, living_rooms: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">Nombre de chambres</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms || 0}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="store_count">Nombre de magasins</Label>
            <Input
              id="store_count"
              type="number"
              min="0"
              value={formData.store_count || 0}
              onChange={(e) =>
                setFormData({ ...formData, store_count: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="kitchen_count">Nombre de cuisines</Label>
            <Input
              id="kitchen_count"
              type="number"
              min="0"
              value={formData.kitchen_count || 0}
              onChange={(e) =>
                setFormData({ ...formData, kitchen_count: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="bathroom_count">Nombre de toilettes</Label>
            <Input
              id="bathroom_count"
              type="number"
              min="0"
              value={formData.bathroom_count || 0}
              onChange={(e) =>
                setFormData({ ...formData, bathroom_count: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="has_pool"
            checked={formData.has_pool || false}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, has_pool: checked })
            }
          />
          <Label htmlFor="has_pool">Piscine</Label>
        </div>

        <div>
          <Label htmlFor="rent_amount">Loyer de base</Label>
          <Input
            id="rent_amount"
            type="number"
            value={formData.rent_amount}
            onChange={(e) =>
              setFormData({ ...formData, rent_amount: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <Label htmlFor="deposit_amount">Caution</Label>
          <Input
            id="deposit_amount"
            type="number"
            value={formData.deposit_amount || ''}
            onChange={(e) =>
              setFormData({ ...formData, deposit_amount: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>

        <div>
          <Label htmlFor="commission_percentage">Commission (%)</Label>
          <Input
            id="commission_percentage"
            type="number"
            min="5"
            max="25"
            value={formData.commission_percentage || 10}
            onChange={(e) =>
              setFormData({ ...formData, commission_percentage: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value: ApartmentUnitStatus) => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="occupied">Occupé</SelectItem>
              <SelectItem value="maintenance">En maintenance</SelectItem>
              <SelectItem value="reserved">Réservé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
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