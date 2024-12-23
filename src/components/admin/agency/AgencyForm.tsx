import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Agency } from "./types"

interface AgencyFormProps {
  agency: Agency
  setAgency: (agency: Agency) => void
}

export function AgencyForm({ agency, setAgency }: AgencyFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={agency.name}
          onChange={(e) => setAgency({ ...agency, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={agency.address || ""}
          onChange={(e) => setAgency({ ...agency, address: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={agency.phone || ""}
          onChange={(e) => setAgency({ ...agency, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={agency.email || ""}
          onChange={(e) => setAgency({ ...agency, email: e.target.value })}
        />
      </div>
    </div>
  )
}