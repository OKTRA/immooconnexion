import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfessionalFieldsProps {
  formData: {
    profession: string;
    employer_name: string;
    employer_phone: string;
  };
  setFormData: (data: any) => void;
}

export function ProfessionalFields({ formData, setFormData }: ProfessionalFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Input
          id="profession"
          value={formData.profession}
          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employer_name">Nom de l'employeur</Label>
          <Input
            id="employer_name"
            value={formData.employer_name}
            onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employer_phone">Téléphone de l'employeur</Label>
          <Input
            id="employer_phone"
            value={formData.employer_phone}
            onChange={(e) => setFormData({ ...formData, employer_phone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}