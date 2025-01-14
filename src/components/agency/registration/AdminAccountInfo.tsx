import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AdminAccountInfoProps {
  formData: {
    adminFirstName: string
    adminLastName: string
    adminEmail: string
    adminPhone: string
  }
  onChange: (field: string, value: string) => void
}

export function AdminAccountInfo({ formData, onChange }: AdminAccountInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="adminFirstName">Prénom de l'administrateur</Label>
        <Input
          id="adminFirstName"
          value={formData.adminFirstName}
          onChange={(e) => onChange('adminFirstName', e.target.value)}
          placeholder="Ex: John"
        />
      </div>
      <div>
        <Label htmlFor="adminLastName">Nom de l'administrateur</Label>
        <Input
          id="adminLastName"
          value={formData.adminLastName}
          onChange={(e) => onChange('adminLastName', e.target.value)}
          placeholder="Ex: Doe"
        />
      </div>
      <div>
        <Label htmlFor="adminEmail">Email de l'administrateur</Label>
        <Input
          id="adminEmail"
          value={formData.adminEmail}
          onChange={(e) => onChange('adminEmail', e.target.value)}
          placeholder="Ex: admin@immoplus.com"
        />
      </div>
      <div>
        <Label htmlFor="adminPhone">Téléphone de l'administrateur</Label>
        <Input
          id="adminPhone"
          value={formData.adminPhone}
          onChange={(e) => onChange('adminPhone', e.target.value)}
          placeholder="Ex: +225 0123456789"
        />
      </div>
    </div>
  )
}