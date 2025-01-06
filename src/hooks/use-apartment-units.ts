import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment";

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient();

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", apartmentId);

      if (error) throw error;
      return data as ApartmentUnit[];
    }
  });

  const createUnit = useMutation({
    mutationFn: async (formData: ApartmentUnitFormData) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert([{
          apartment_id: apartmentId,
          unit_number: formData.unit_number,
          floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          rent_amount: parseInt(formData.rent_amount),
          deposit_amount: formData.deposit_amount ? parseInt(formData.deposit_amount) : null,
          description: formData.description || null,
          status: formData.status,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
    }
  });

  const updateUnit = useMutation({
    mutationFn: async (data: ApartmentUnitFormData & { id: string }) => {
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
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
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
    }
  });

  return { units, isLoading, createUnit, updateUnit, deleteUnit };
}