import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface ApartmentFormFieldsProps {
  formData: {
    bien: string
    type: string
    chambres: string
    ville: string
    total_units: string
    property_category: string
    owner_name: string
    owner_phone: string
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
    <div className="grid gap-6 py-4">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations de base</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="bien">Nom de l'immeuble</Label>
            <Input 
              id="bien" 
              placeholder="Ex: Résidence Les Palmiers" 
              value={formData.bien}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property_category">Type de bien</Label>
            <Select 
              value={formData.property_category} 
              onValueChange={(value) => setFormData({ ...formData, property_category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Immeuble</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ville">Ville</Label>
            <Input 
              id="ville" 
              value={formData.ville}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Informations du propriétaire */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations du propriétaire</h3>
        <div className="grid gap-4">
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
        </div>
      </div>

      <Separator />

      {/* Gestion des unités */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Gestion des unités</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="total_units">Nombre total d'unités</Label>
            <Input 
              id="total_units" 
              type="number"
              min="1"
              placeholder="Ex: 6" 
              value={formData.total_units}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Photos</h3>
        <div className="grid gap-2">
          <Label htmlFor="photo">Photos de l'immeuble</Label>
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
    </div>
  )
}