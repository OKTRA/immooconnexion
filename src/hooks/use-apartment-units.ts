import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit, ApartmentUnitFormData } from "@/components/apartment/types";
import { toast } from "@/hooks/use-toast";

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient();

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("unit_number");

      if (error) throw error;
      return data as ApartmentUnit[];
    },
  });

  const createUnit = useMutation({
    mutationFn: async (formData: ApartmentUnitFormData) => {
      const unitData = {
        apartment_id: apartmentId,
        unit_number: formData.unit_number,
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        rent_amount: parseInt(formData.rent_amount),
        deposit_amount: formData.deposit_amount ? parseInt(formData.deposit_amount) : null,
        description: formData.description || null,
        status: formData.status,
      };

      const { error } = await supabase
        .from("apartment_units")
        .insert([unitData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "Unité créée avec succès",
      });
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
    mutationFn: async ({ id, ...formData }: ApartmentUnitFormData & { id: string }) => {
      const unitData = {
        unit_number: formData.unit_number,
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        rent_amount: parseInt(formData.rent_amount),
        deposit_amount: formData.deposit_amount ? parseInt(formData.deposit_amount) : null,
        description: formData.description || null,
        status: formData.status,
      };

      const { error } = await supabase
        .from("apartment_units")
        .update(unitData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "Unité mise à jour avec succès",
      });
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

  const deleteUnit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "Unité supprimée avec succès",
      });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    },
  });

  return {
    units,
    isLoading,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}