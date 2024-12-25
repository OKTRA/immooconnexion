import { TenantFormFields } from "./TenantFormFields";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTenantCreation } from "./form/useTenantCreation";

interface TenantCreationFormProps {
  userProfile: any;
  properties: any[];
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function TenantCreationForm({ 
  userProfile, 
  properties, 
  onSuccess, 
  onCancel,
  initialData,
  isEditing
}: TenantCreationFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.photo_id_url || "");
  
  const { 
    formData, 
    setFormData, 
    isSubmitting, 
    handleSubmit 
  } = useTenantCreation(onSuccess, initialData, isEditing);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoId: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TenantFormFields
        formData={formData}
        setFormData={setFormData}
        properties={properties}
        handlePhotoChange={handlePhotoChange}
        previewUrl={previewUrl}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : isEditing ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}