import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmergencyContactFieldsProps {
  formData: {
    emergency_contact_name: string;
    emergency_contact_phone: string;
  };
  setFormData: (data: any) => void;
}

export function EmergencyContactFields({ formData, setFormData }: EmergencyContactFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Contact d'urgence - Nom</Label>
          <Input
            id="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Contact d'urgence - Téléphone</Label>
          <Input
            id="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}