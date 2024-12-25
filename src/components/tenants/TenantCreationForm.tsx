import { TenantFormFields } from "./TenantFormFields";
import { Button } from "@/components/ui/button";
import { TenantReceipt } from "./TenantReceipt";
import { useState } from "react";
import { useTenantCreation } from "./form/useTenantCreation";

interface TenantCreationFormProps {
  userProfile: any;
  properties: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function TenantCreationForm({ 
  userProfile, 
  properties, 
  onSuccess, 
  onCancel 
}: TenantCreationFormProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const { 
    formData, 
    setFormData, 
    isSubmitting, 
    handleSubmit 
  } = useTenantCreation(() => setShowReceipt(true));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoId: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  if (showReceipt) {
    return (
      <div className="space-y-4">
        <TenantReceipt 
          tenant={{
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            fraisAgence: formData.fraisAgence,
            propertyId: formData.propertyId,
            profession: formData.profession
          }}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={() => {
            setShowReceipt(false);
            onSuccess();
          }}>
            Fermer
          </Button>
        </div>
      </div>
    );
  }

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
          {isSubmitting ? "Chargement..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}