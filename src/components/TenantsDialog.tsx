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

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('statut', 'disponible');
      
      if (error) throw error;
      return data;
    }
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
      // First create a new user in auth.users
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

      // Now we can create the tenant record using the new user's ID
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          id: authData.user.id,
          birth_date: formData.dateNaissance,
          phone_number: formData.telephone,
          agency_fees: parseFloat(formData.fraisAgence),
          photo_id_url: previewUrl || null,
        });

      if (tenantError) {
        console.error("Tenant creation error:", tenantError);
        throw tenantError;
      }

      toast({
        title: tenant ? "Locataire modifié" : "Locataire ajouté",
        description: "Le locataire a été ajouté avec succès.",
      });
      onOpenChange(false);
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
      </DialogContent>
    </Dialog>
  );
}