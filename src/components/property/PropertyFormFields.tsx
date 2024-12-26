import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyFormData } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: (data: PropertyFormData) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl?: string | string[]
}

export function PropertyFormFields({ 
  formData, 
  setFormData, 
  handleImageChange,
  imagePreviewUrl 
}: PropertyFormFieldsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const previewUrls = imagePreviewUrl 
    ? Array.isArray(imagePreviewUrl) 
      ? imagePreviewUrl 
      : [imagePreviewUrl]
    : []

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="bien">Nom du bien</Label>
        <Input 
          id="bien" 
          placeholder="Ex: Appartement Jaune Block 1" 
          value={formData.bien}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type de bien</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => setFormData({ ...formData, type: value })}
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
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ville">Ville</Label>
        <Input 
          id="ville" 
          value={formData.ville}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="loyer">Loyer mensuel (FCFA)</Label>
        <Input 
          id="loyer" 
          type="number" 
          value={formData.loyer}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="caution">Caution (FCFA)</Label>
        <Input 
          id="caution" 
          type="number"
          value={formData.caution}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="photo">Photos du bien</Label>
        <Input 
          id="photo" 
          type="file" 
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {previewUrls.length > 0 && (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Aperçu ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}