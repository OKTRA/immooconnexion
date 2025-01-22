import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmergencyFieldsProps {
  contactName: string
  contactPhone: string
  contactRelationship: string
  onChange: (field: string, value: string) => void
}

export function EmergencyFields({
  contactName,
  contactPhone,
  contactRelationship,
  onChange
}: EmergencyFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact d'urgence</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Nom du contact</Label>
          <Input
            id="emergency_contact_name"
            value={contactName}
            onChange={(e) => onChange("emergency_contact_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Téléphone du contact</Label>
          <Input
            id="emergency_contact_phone"
            value={contactPhone}
            onChange={(e) => onChange("emergency_contact_phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_relationship">Relation</Label>
          <Input
            id="emergency_contact_relationship"
            value={contactRelationship}
            onChange={(e) => onChange("emergency_contact_relationship", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}