import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSubscriptionLimits } from "@/utils/subscriptionLimits";
import { useTenantPhoto } from "./useTenantPhoto";
import { useInitialPayments } from "./useInitialPayments";
import { useQueryClient } from "@tanstack/react-query";

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

export const useTenantCreation = (
  onSuccess: () => void, 
  initialData?: any,
  isEditing?: boolean
) => {
  const [formData, setFormData] = useState<TenantFormData>({
    nom: initialData?.nom || "",
    prenom: initialData?.prenom || "",
    dateNaissance: initialData?.birth_date || "",
    telephone: initialData?.phone_number || "",
    photoId: null,
    fraisAgence: initialData?.agency_fees?.toString() || "",
    propertyId: initialData?.property_id || "",
    profession: initialData?.profession || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { checkAndNotifyLimits } = useSubscriptionLimits();
  const { uploadTenantPhoto } = useTenantPhoto();
  const { createInitialPayments } = useInitialPayments();
  const queryClient = useQueryClient();

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

      // Only check limits for new tenants
      if (!isEditing) {
        if (!(await checkAndNotifyLimits(profile.agency_id, 'tenant'))) {
          setIsSubmitting(false);
          return;
        }
      }

      let photo_id_url = initialData?.photo_id_url;
      if (formData.photoId) {
        photo_id_url = await uploadTenantPhoto(formData.photoId);
      }

      const tenantData = {
        nom: formData.nom,
        prenom: formData.prenom,
        birth_date: formData.dateNaissance,
        phone_number: formData.telephone,
        photo_id_url,
        agency_fees: parseFloat(formData.fraisAgence),
        profession: formData.profession,
        agency_id: profile.agency_id
      };

      let result;
      if (isEditing && initialData?.id) {
        // Update existing tenant
        result = await supabase
          .from('tenants')
          .update(tenantData)
          .eq('id', initialData.id)
          .select()
          .single();
      } else {
        // Create new tenant
        result = await supabase
          .from('tenants')
          .insert(tenantData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (!isEditing) {
        await createInitialPayments(
          result.data.id,
          profile.agency_id,
          formData.propertyId,
          formData.fraisAgence
        );
      }

      queryClient.invalidateQueries({ queryKey: ['tenants'] });

      toast({
        title: isEditing ? "Locataire modifié" : "Locataire ajouté",
        description: isEditing 
          ? "Le locataire a été modifié avec succès."
          : "Le locataire et ses paiements initiaux ont été enregistrés avec succès.",
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