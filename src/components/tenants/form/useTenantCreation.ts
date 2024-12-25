import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSubscriptionLimits } from "@/utils/subscriptionLimits";
import { useTenantPhoto } from "./useTenantPhoto";
import { useInitialPayments } from "./useInitialPayments";

export interface TenantFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  photoId: File | null;
  fraisAgence: string;
  propertyId: string;
  profession: string;
}

export const useTenantCreation = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<TenantFormData>({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    photoId: null,
    fraisAgence: "",
    propertyId: "",
    profession: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { checkAndNotifyLimits } = useSubscriptionLimits();
  const { uploadTenantPhoto } = useTenantPhoto();
  const { createInitialPayments } = useInitialPayments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      if (!profile?.agency_id) throw new Error("Aucune agence associée à ce profil");

      if (!(await checkAndNotifyLimits(profile.agency_id, 'tenant'))) {
        setIsSubmitting(false);
        return;
      }

      const photo_id_url = await uploadTenantPhoto(formData.photoId);

      const { data: newTenant, error: tenantError } = await supabase
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
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      await createInitialPayments(
        newTenant.id,
        profile.agency_id,
        formData.propertyId,
        formData.fraisAgence
      );

      toast({
        title: "Locataire ajouté",
        description: "Le locataire et ses paiements initiaux ont été enregistrés avec succès.",
      });
      
      onSuccess();
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

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit
  };
};