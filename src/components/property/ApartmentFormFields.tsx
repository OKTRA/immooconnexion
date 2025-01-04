import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ApartmentFormFieldsProps {
  formData: {
    bien: string
    type: string
    chambres: string
    ville: string
    loyer: string
    taux_commission: string
    caution: string
    owner_name: string
    owner_phone: string
    total_units: string
    property_category: string
  }
  setFormData: (data: any) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl?: string | string[]
}

export function ApartmentFormFields({ 
  formData, 
  setFormData, 
  handleImageChange,
  imagePreviewUrl 
}: ApartmentFormFieldsProps) {
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
        <Label htmlFor="bien">Nom de l'appartement</Label>
        <Input 
          id="bien" 
          placeholder="Ex: Résidence Les Palmiers Apt 301" 
          value={formData.bien}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="property_category">Catégorie</Label>
        <Select 
          value={formData.property_category} 
          onValueChange={(value) => setFormData({ ...formData, property_category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner la catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="duplex">Duplex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="total_units">Nombre total d'unités</Label>
        <Input 
          id="total_units" 
          type="number"
          min="1"
          placeholder="Ex: 1" 
          value={formData.total_units}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="chambres">Nombre de chambres</Label>
        <Input 
          id="chambres" 
          type="number" 
          min="0"
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
        <Label htmlFor="owner_name">Nom du propriétaire</Label>
        <Input 
          id="owner_name" 
          value={formData.owner_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="owner_phone">Téléphone du propriétaire</Label>
        <Input 
          id="owner_phone" 
          value={formData.owner_phone}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="photo">Photos de l'appartement</Label>
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