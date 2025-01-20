import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyFormData, PropertyFormFieldsProps } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { westafrikanCountries } from "@/utils/countryUtils"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

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
    <div className="space-y-8 px-2">
      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Informations de base</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="owner">Propriétaire</Label>
              <Select 
                value={formData.owner_id} 
                onValueChange={handleOwnerSelect}
              >
                <SelectTrigger className="mt-1.5">
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

            <div>
              <Label htmlFor="bien">Nom du bien</Label>
              <Input 
                id="bien" 
                placeholder="Ex: Villa Jaune Block 1" 
                value={formData.bien}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="owner_name">Nom du propriétaire</Label>
              <Input 
                id="owner_name" 
                placeholder="Ex: Jean Dupont" 
                value={formData.owner_name}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="owner_phone">Numéro du propriétaire</Label>
              <Input 
                id="owner_phone" 
                placeholder="Ex: +225 0123456789" 
                value={formData.owner_phone}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Caractéristiques du bien</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="type">Type de bien</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="mt-1.5">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chambres">Chambres</Label>
              <Input 
                id="chambres" 
                type="number" 
                min="0" 
                value={formData.chambres}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="living_rooms">Salons</Label>
              <Input 
                id="living_rooms" 
                type="number" 
                min="0" 
                value={formData.living_rooms}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bathrooms">Salles de bain</Label>
              <Input 
                id="bathrooms" 
                type="number" 
                min="0" 
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="kitchen_count">Cuisines</Label>
              <Input 
                id="kitchen_count" 
                type="number" 
                min="0" 
                value={formData.kitchen_count}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_count">Magasins</Label>
              <Input 
                id="store_count" 
                type="number" 
                min="0" 
                value={formData.store_count}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center mt-6">
              <Switch
                id="has_pool"
                checked={formData.has_pool || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="has_pool" className="ml-2">Piscine</Label>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Localisation</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="country">Pays</Label>
            <Select 
              value={formData.country} 
              onValueChange={(value) => setFormData({ ...formData, country: value })}
            >
              <SelectTrigger className="mt-1.5">
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

          <div>
            <Label htmlFor="ville">Ville</Label>
            <Input 
              id="ville" 
              value={formData.ville}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="quartier">Quartier</Label>
            <Input 
              id="quartier" 
              placeholder="Ex: Bamako-Coura" 
              value={formData.quartier}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Informations financières</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="loyer">Loyer mensuel (FCFA)</Label>
            <Input 
              id="loyer" 
              type="number" 
              value={formData.loyer}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="taux_commission">Taux de commission (%)</Label>
            <Input 
              id="taux_commission" 
              type="number" 
              min="5" 
              max="15" 
              placeholder="Entre 5 et 15%"
              value={formData.taux_commission}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="caution">Caution (FCFA)</Label>
            <Input 
              id="caution" 
              type="number"
              value={formData.caution}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Photos du bien</h3>
        <div className="space-y-4">
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
      </Card>
    </div>
  )
}