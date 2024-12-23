import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Property, PropertyFormData } from "./types"

interface PropertyFormProps {
  formData: PropertyFormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTypeChange: (value: string) => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  image: File | null
  property?: Property | null
}

export function PropertyForm({ 
  formData, 
  onInputChange, 
  onTypeChange,
  onImageChange,
  image,
  property 
}: PropertyFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="bien">Nom du bien</Label>
        <Input 
          id="bien" 
          placeholder="Ex: Appartement Jaune Block 1" 
          value={formData.bien}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type de bien</Label>
        <Select 
          value={formData.type} 
          onValueChange={onTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appartement">Appartement</SelectItem>
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="chambres">Nombre de chambres</Label>
        <Input 
          id="chambres" 
          type="number" 
          min="1" 
          value={formData.chambres}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ville">Ville</Label>
        <Input 
          id="ville" 
          value={formData.ville}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="loyer">Loyer mensuel (FCFA)</Label>
        <Input 
          id="loyer" 
          type="number" 
          value={formData.loyer}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="taux_commission">Taux de commission (%)</Label>
        <Input 
          id="taux_commission" 
          type="number" 
          min="5" 
          max="15" 
          placeholder="Entre 5 et 15%"
          value={formData.taux_commission}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="caution">Caution (FCFA)</Label>
        <Input 
          id="caution" 
          type="number"
          value={formData.caution}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="photo">Photo du bien</Label>
        <Input 
          id="photo" 
          type="file" 
          accept="image/*" 
          onChange={onImageChange}
        />
        {(image || property?.photo_url) && (
          <div className="mt-2">
            <img
              src={image ? URL.createObjectURL(image) : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
              alt="Aperçu"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  )
}