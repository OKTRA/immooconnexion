import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminAccountFields } from "./registration/AdminAccountFields";
import { AgencyInfoFields } from "./registration/AgencyInfoFields";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgencyRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = {
  email: string;
  password: string;
  confirm_password: string;
  agency_name: string;
  agency_address: string;
  agency_phone: string;
  country: string;
  city: string;
  first_name: string;
  last_name: string;
}

export function AgencyRegistrationDialog({
  open,
  onOpenChange,
}: AgencyRegistrationDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirm_password: "",
    agency_name: "",
    agency_address: "",
    agency_phone: "",
    country: "",
    city: "",
    first_name: "",
    last_name: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirm_password) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      // Create the agency first
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .insert([
          {
            name: formData.agency_name,
            address: formData.agency_address,
            phone: formData.agency_phone,
            country: formData.country,
            city: formData.city,
          }
        ])
        .select()
        .single();

      if (agencyError) throw agencyError;

      // Create the user account
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
          }
        }
      });

      if (authError) throw authError;

      // Update the profile with agency_id and role
      if (userData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            agency_id: agencyData.id,
            role: 'admin'
          })
          .eq('id', userData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inscription de l'agence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <AdminAccountFields
            formData={formData}
            setFormData={setFormData}
          />
          <AgencyInfoFields
            formData={formData}
            setFormData={setFormData}
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Chargement..." : "S'inscrire"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}