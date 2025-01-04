import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Agency } from "./types"

interface AgencyBasicInfoProps {
  agency: Agency
  onChange: (field: keyof Agency, value: string) => void
}

export function AgencyBasicInfo({ agency, onChange }: AgencyBasicInfoProps) {
  return (
    <>
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={agency.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={agency.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={agency.phone || ""}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={agency.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
    </>
  )
}