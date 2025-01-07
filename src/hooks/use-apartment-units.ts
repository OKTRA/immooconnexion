import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment";
import { useToast } from "./use-toast";

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data = [], isLoading } = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("unit_number");

      if (error) throw error;
      return data as ApartmentUnit[];
    }
  });

  const createUnit = useMutation({
    mutationFn: async (formData: ApartmentUnitFormData) => {
      const newUnit = {
        apartment_id: apartmentId,
        unit_number: formData.unit_number,
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        rent_amount: parseInt(formData.rent_amount),
        deposit_amount: formData.deposit_amount ? parseInt(formData.deposit_amount) : null,
        status: formData.status,
        description: formData.description || null
      };

      const { error } = await supabase
        .from("apartment_units")
        .insert([newUnit]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "L'unité a été créée avec succès",
      });
    }
  });

  const updateUnit = useMutation({
    mutationFn: async (unit: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .update(unit)
        .eq("id", unit.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "L'unité a été mise à jour avec succès",
      });
    }
  });

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      });
    }
  });

  return {
    data,
    isLoading,
    createUnit,
    updateUnit,
    deleteUnit
  };
}