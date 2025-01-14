import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AgencyBasicInfoProps {
  formData: {
    name: string
    address: string
    phone: string
    email: string
  }
  onChange: (field: string, value: string) => void
}

export function AgencyBasicInfo({ formData, onChange }: AgencyBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'agence</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex: Immo Plus"
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Ex: 123 Rue du Commerce"
        />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Ex: +225 0123456789"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Ex: contact@immoplus.com"
        />
      </div>
    </div>
  )
}