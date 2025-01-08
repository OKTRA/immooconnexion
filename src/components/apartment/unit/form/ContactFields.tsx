import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactFieldsProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    secondaryPhoneNumber: string
  }
  setFormData: (data: any) => void
}

export function ContactFields({ formData, setFormData }: ContactFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Téléphone principal</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryPhoneNumber">Téléphone secondaire</Label>
          <Input
            id="secondaryPhoneNumber"
            value={formData.secondaryPhoneNumber}
            onChange={(e) => setFormData({ ...formData, secondaryPhoneNumber: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}