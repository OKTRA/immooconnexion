import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TenantFormFields } from "./tenants/TenantFormFields";
import { TenantReceipt } from "./tenants/TenantReceipt";

interface TenantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: any;
}

export function TenantsDialog({ open, onOpenChange, tenant }: TenantsDialogProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    photoId: null as File | null,
    fraisAgence: "",
    propertyId: "",
  });
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, agency_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile;
    }
  });

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!userProfile) return [];

      let query = supabase
        .from('properties')
        .select('*')
        .eq('statut', 'disponible');

      if (userProfile.role !== 'admin') {
        query = query.eq('agency_id', userProfile.agency_id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        ...tenant,
        photoId: null,
        propertyId: tenant.propertyId || "",
      });
      if (tenant.photoIdUrl) {
        setPreviewUrl(tenant.photoIdUrl);
      }
    } else {
      setFormData({
        nom: "",
        prenom: "",
        dateNaissance: "",
        telephone: "",
        photoId: null,
        fraisAgence: "",
        propertyId: "",
      });
      setPreviewUrl("");
    }
  }, [tenant]);

  useEffect(() => {
    if (formData.propertyId && properties) {
      const property = properties.find(p => p.id === formData.propertyId);
      setSelectedProperty(property);
    }
  }, [formData.propertyId, properties]);

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Créer l'utilisateur dans auth.users
      const email = `${formData.nom.toLowerCase()}.${formData.prenom.toLowerCase()}@tenant.local`;
      const password = Math.random().toString(36).slice(-8);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: formData.prenom,
            last_name: formData.nom,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Mettre à jour le profil pour indiquer que c'est un locataire
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_tenant: true,
          first_name: formData.prenom,
          last_name: formData.nom,
          agency_id: userProfile?.agency_id // Ajouter l'ID de l'agence au profil
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Créer l'entrée dans la table tenants avec l'ID de l'agence
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          id: authData.user.id,
          nom: formData.nom,
          prenom: formData.prenom,
          birth_date: formData.dateNaissance,
          phone_number: formData.telephone,
          agency_fees: parseFloat(formData.fraisAgence),
          photo_id_url: previewUrl || null,
          user_id: user.id,
          agency_id: userProfile?.agency_id // Ajouter l'ID de l'agence
        });

      if (tenantError) throw tenantError;

      toast({
        title: tenant ? "Locataire modifié" : "Locataire ajouté",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        {!showReceipt ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TenantFormFields
              formData={formData}
              setFormData={setFormData}
              properties={properties || []}
              handlePhotoChange={handlePhotoChange}
              previewUrl={previewUrl}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Chargement..." : (tenant ? "Modifier" : "Ajouter")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <TenantReceipt 
              tenant={{
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                fraisAgence: formData.fraisAgence,
                propertyId: formData.propertyId,
              }}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReceipt(false);
                  onOpenChange(false);
                }}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}