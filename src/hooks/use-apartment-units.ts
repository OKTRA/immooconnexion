import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit } from "@/components/apartment/types";

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
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
    mutationFn: async (newUnit: Omit<ApartmentUnit, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("apartment_units")
        .insert([newUnit])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
    },
  });

  const updateUnit = useMutation({
    mutationFn: async (unit: ApartmentUnit) => {
      const { data, error } = await supabase
        .from("apartment_units")
        .update(unit)
        .eq("id", unit.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
    },
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
    },
  });

  return {
    ...query,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}