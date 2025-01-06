import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAgencies } from "@/hooks/useAgencies";

const apartmentFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  description: z.string().optional(),
});

type ApartmentFormData = z.infer<typeof apartmentFormSchema>;

interface ApartmentFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name: string;
    address: string;
    description?: string;
  };
  isEditing?: boolean;
}

export function ApartmentForm({ onSuccess, initialData, isEditing = false }: ApartmentFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { agencyId } = useAgencies();

  const form = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      description: "",
    },
  });

  async function onSubmit(data: ApartmentFormData) {
    try {
      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from("apartments")
          .update({
            name: data.name,
            address: data.address,
            description: data.description,
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Appartement modifié",
          description: "L'appartement a été modifié avec succès",
        });
      } else {
        const { error } = await supabase
          .from("apartments")
          .insert([{
            name: data.name,
            address: data.address,
            description: data.description,
            agency_id: agencyId,
          }]);

        if (error) throw error;

        toast({
          title: "Appartement créé",
          description: "L'appartement a été créé avec succès",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      onSuccess?.();
      if (!isEditing) {
        navigate("/agence/appartements");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'appartement</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Résidence Les Palmiers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123 Rue de la Paix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de l'appartement..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isEditing ? "Modifier" : "Créer"} l'appartement
        </Button>
      </form>
    </Form>
  )
}