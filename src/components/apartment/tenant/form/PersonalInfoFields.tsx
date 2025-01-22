import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInfoFieldsProps {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthDate: string
  profession: string
  onChange: (field: string, value: string) => void
}

export function PersonalInfoFields({
  firstName,
  lastName,
  email,
  phoneNumber,
  birthDate,
  profession,
  onChange,
}: PersonalInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          placeholder="Prénom du locataire"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          placeholder="Nom du locataire"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Email du locataire"
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Téléphone</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          placeholder="Numéro de téléphone"
        />
      </div>
      <div>
        <Label htmlFor="birthDate">Date de naissance</Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => onChange("birthDate", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="profession">Profession</Label>
        <Input
          id="profession"
          value={profession}
          onChange={(e) => onChange("profession", e.target.value)}
          placeholder="Profession du locataire"
        />
      </div>
    </div>
  )
}