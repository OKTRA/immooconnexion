import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TenantFormFields } from "./TenantFormFields";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSubscriptionLimits } from "@/utils/subscriptionLimits";
import { TenantReceipt } from "./TenantReceipt";

interface TenantCreationFormProps {
  userProfile: any;
  properties: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function TenantCreationForm({ userProfile, properties, onSuccess, onCancel }: TenantCreationFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    photoId: null as File | null,
    fraisAgence: "",
    propertyId: "",
    profession: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const { toast } = useToast();
  const { checkAndNotifyLimits } = useSubscriptionLimits();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoId: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the current user's profile to get the agency_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Get the user's profile to get the agency_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      if (!profile?.agency_id) throw new Error("Aucune agence associée à ce profil");

      // Check subscription limits
      if (!(await checkAndNotifyLimits(profile.agency_id, 'tenant'))) {
        setIsSubmitting(false);
        return;
      }

      let photo_id_url = null;
      if (formData.photoId) {
        const fileExt = formData.photoId.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('tenant_photos')
          .upload(fileName, formData.photoId);

        if (uploadError) throw uploadError;
        photo_id_url = data.path;
      }

      // Create tenant record directly without auth or profile
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          nom: formData.nom,
          prenom: formData.prenom,
          birth_date: formData.dateNaissance,
          phone_number: formData.telephone,
          photo_id_url,
          agency_fees: parseFloat(formData.fraisAgence),
          profession: formData.profession,
          agency_id: profile.agency_id
        });

      if (tenantError) throw tenantError;

      toast({
        title: "Locataire ajouté",
        description: "Le locataire a été ajouté avec succès.",
      });
      
      setShowReceipt(true);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'opération.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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