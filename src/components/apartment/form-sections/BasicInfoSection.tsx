import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { westafrikanCountries } from "@/utils/countryUtils"

interface BasicInfoSectionProps {
  formData: {
    bien: string
    property_category: string
    ville: string
    country: string
    total_units: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (value: string, field: string) => void
}

export function BasicInfoSection({ 
  formData, 
  handleInputChange, 
  handleSelectChange 
}: BasicInfoSectionProps) {
  return (
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
            onValueChange={(value) => handleSelectChange(value, 'property_category')}
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
          <Label htmlFor="country">Pays</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleSelectChange(value, 'country')}
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
            placeholder="Ex: Abidjan"
            value={formData.ville}
            onChange={handleInputChange}
          />
        </div>

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
  )
}