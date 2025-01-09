import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ContactFields } from "./form/ContactFields";
import { ProfessionalFields } from "./form/ProfessionalFields";
import { EmergencyContactFields } from "./form/EmergencyContactFields";
import { useTenantForm } from "./hooks/useTenantForm";
import { ApartmentTenant } from "@/types/apartment";

interface ApartmentTenantFormProps {
  unitId: string;
  onSuccess: () => void;
  initialData?: ApartmentTenant;
}

export function ApartmentTenantForm({
  unitId,
  onSuccess,
  initialData
}: ApartmentTenantFormProps) {
  const {
    formData,
    setFormData,
    previewUrl,
    handlePhotoChange,
    handleSubmit,
    isSubmitting
  } = useTenantForm({ onSuccess, initialData, unitId });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContactFields formData={formData} setFormData={setFormData} />
      <ProfessionalFields formData={formData} setFormData={setFormData} />
      <EmergencyContactFields formData={formData} setFormData={setFormData} />

      <div className="space-y-2">
        <Label htmlFor="photo_id">Photo d'identité</Label>
        <Input
          id="photo_id"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="cursor-pointer"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Aperçu de la photo d'identité"
            className="mt-2 max-h-32 object-contain"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_notes">Notes additionnelles</Label>
        <Textarea
          id="additional_notes"
          value={formData.additional_notes}
          onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : initialData ? (
            "Modifier"
          ) : (
            "Ajouter"
          )}
        </Button>
      </div>
    </form>
  );
}