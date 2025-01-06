import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnitFormData } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useUnitMutations(apartmentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createUnit = useMutation({
    mutationFn: async (data: ApartmentUnitFormData) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert([{
          apartment_id: apartmentId,
          unit_number: data.unit_number,
          floor_number: data.floor_number ? parseInt(data.floor_number) : null,
          area: data.area ? parseFloat(data.area) : null,
          rent_amount: parseInt(data.rent_amount),
          deposit_amount: data.deposit_amount ? parseInt(data.deposit_amount) : null,
          description: data.description || null,
          status: data.status,
        }]);

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
    mutationFn: async ({ id, ...data }: ApartmentUnitFormData & { id: string }) => {
      const { error } = await supabase
        .from("apartment_units")
        .update({
          unit_number: data.unit_number,
          floor_number: data.floor_number ? parseInt(data.floor_number) : null,
          area: data.area ? parseFloat(data.area) : null,
          rent_amount: parseInt(data.rent_amount),
          deposit_amount: data.deposit_amount ? parseInt(data.deposit_amount) : null,
          description: data.description || null,
          status: data.status,
        })
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