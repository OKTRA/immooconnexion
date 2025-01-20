import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyFormData, PropertyFormFieldsProps } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { westafrikanCountries } from "@/utils/countryUtils"
import { Switch } from "@/components/ui/switch"

export function PropertyFormFields({ 
  formData, 
  setFormData, 
  handleImageChange,
  imagePreviewUrl,
  propertyType,
  owners = []
}: PropertyFormFieldsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target
    setFormData({ 
      ...formData, 
      [id]: type === 'number' ? (value ? parseInt(value) : undefined) : value 
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, has_pool: checked })
  }

  const handleOwnerSelect = (ownerId: string) => {
    const selectedOwner = owners.find(o => o.id === ownerId)
    if (selectedOwner) {
      setFormData({
        ...formData,
        owner_id: ownerId,
        owner_name: `${selectedOwner.first_name} ${selectedOwner.last_name}`,
        owner_phone: selectedOwner.phone_number || ''
      })
    }
  }

  const previewUrls = imagePreviewUrl 
    ? Array.isArray(imagePreviewUrl) 
      ? imagePreviewUrl 
      : [imagePreviewUrl]
    : []

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="owner">Propriétaire</Label>
        <Select 
          value={formData.owner_id} 
          onValueChange={handleOwnerSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un propriétaire" />
          </SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.first_name} {owner.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bien">Nom du bien</Label>
        <Input 
          id="bien" 
          placeholder="Ex: Villa Jaune Block 1" 
          value={formData.bien}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="owner_name">Nom du propriétaire</Label>
        <Input 
          id="owner_name" 
          placeholder="Ex: Jean Dupont" 
          value={formData.owner_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="owner_phone">Numéro du propriétaire</Label>
        <Input 
          id="owner_phone" 
          placeholder="Ex: +225 0123456789" 
          value={formData.owner_phone}
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
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="duplex">Duplex</SelectItem>
            <SelectItem value="triplex">Triplex</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="living_rooms">Nombre de salons</Label>
        <Input 
          id="living_rooms" 
          type="number" 
          min="0" 
          value={formData.living_rooms}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bathrooms">Nombre de salles de bain</Label>
        <Input 
          id="bathrooms" 
          type="number" 
          min="0" 
          value={formData.bathrooms}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kitchen_count">Nombre de cuisines</Label>
        <Input 
          id="kitchen_count" 
          type="number" 
          min="0" 
          value={formData.kitchen_count}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="store_count">Nombre de magasins</Label>
        <Input 
          id="store_count" 
          type="number" 
          min="0" 
          value={formData.store_count}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="has_pool"
          checked={formData.has_pool || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="has_pool">Piscine</Label>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="country">Pays</Label>
        <Select 
          value={formData.country} 
          onValueChange={(value) => setFormData({ ...formData, country: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le pays" />
          </SelectTrigger>
          <SelectContent>
            {westafrikanCountries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
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

      <div className="grid gap-2">
        <Label htmlFor="quartier">Quartier</Label>
        <Input 
          id="quartier" 
          placeholder="Ex: Bamako-Coura" 
          value={formData.quartier}
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