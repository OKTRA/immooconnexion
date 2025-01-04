import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OwnerInfoSectionProps {
  formData: {
    owner_name: string
    owner_phone: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function OwnerInfoSection({ formData, handleInputChange }: OwnerInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations du propriétaire</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="owner_name">Nom du propriétaire</Label>
          <Input 
            id="owner_name" 
            placeholder="Ex: John Doe"
            value={formData.owner_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="owner_phone">Téléphone du propriétaire</Label>
          <Input 
            id="owner_phone" 
            placeholder="Ex: +225 XX XX XX XX XX"
            value={formData.owner_phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}