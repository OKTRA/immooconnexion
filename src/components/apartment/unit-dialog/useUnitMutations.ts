import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit, ApartmentUnitFormData } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useUnitMutations(apartmentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createUnit = useMutation({
    mutationFn: async (data: ApartmentUnitFormData) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert([{ ...data, apartment_id: apartmentId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({ title: "Unité créée avec succès" });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création",
        variant: "destructive",
      });
    },
  });

  const updateUnit = useMutation({
    mutationFn: async ({ id, ...data }: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({ title: "Unité mise à jour avec succès" });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  return { createUnit, updateUnit };
}