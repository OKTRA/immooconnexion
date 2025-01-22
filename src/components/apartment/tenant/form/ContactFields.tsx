import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactFieldsProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    emergency_contact_phone?: string
  }
  setFormData: (data: any) => void
}

export function ContactFields({ formData, setFormData }: ContactFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Téléphone</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergency_contact_phone">Numéro d'urgence</Label>
        <Input
          id="emergency_contact_phone"
          value={formData.emergency_contact_phone || ''}
          onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
          placeholder="Numéro à contacter en cas d'urgence"
        />
      </div>
    </div>
  )
}