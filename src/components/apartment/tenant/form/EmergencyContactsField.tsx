import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmergencyContactFieldsProps {
  contactName: string;
  contactPhone: string;
  contactRelationship: string;
  onChange: (field: string, value: string) => void;
}

export function EmergencyContactsField({ 
  contactName,
  contactPhone,
  contactRelationship,
  onChange 
}: EmergencyContactFieldsProps) {
  return (
    <div className="space-y-4">
      <Label>Contact d'urgence</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Nom</Label>
          <Input
            id="emergency_contact_name"
            value={contactName}
            onChange={(e) => onChange("emergency_contact_name", e.target.value)}
            placeholder="Nom du contact"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Téléphone</Label>
          <Input
            id="emergency_contact_phone"
            value={contactPhone}
            onChange={(e) => onChange("emergency_contact_phone", e.target.value)}
            placeholder="Numéro de téléphone"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_relationship">Relation</Label>
          <Input
            id="emergency_contact_relationship"
            value={contactRelationship}
            onChange={(e) => onChange("emergency_contact_relationship", e.target.value)}
            placeholder="Relation avec le locataire"
          />
        </div>
      </div>
    </div>
  )
}