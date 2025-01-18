import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminAccountFields } from "./registration/AdminAccountFields";
import { AgencyInfoFields } from "./registration/AgencyInfoFields";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, formSchema, AgencyRegistrationDialogProps } from "./types";
import { Form } from "@/components/ui/form";

export function AgencyRegistrationDialog({
  open,
  onOpenChange,
  planId,
  planName,
  amount
}: AgencyRegistrationDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      // Create the agency first
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .insert([
          {
            name: data.agency_name,
            address: data.agency_address,
            phone: data.agency_phone,
            country: data.country,
            city: data.city,
            subscription_plan_id: planId
          }
        ])
        .select()
        .single();

      if (agencyError) throw agencyError;

      // Create the user account
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          }
        }
      });

      if (authError) throw authError;

      // Update the profile with agency_id and role
      if (userData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AdminAccountFields form={form} />
            <AgencyInfoFields form={form} />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}