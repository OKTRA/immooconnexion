import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment";
import { useToast } from "./use-toast";

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
    }
  });

  const createUnit = useMutation({
    mutationFn: async (formData: ApartmentUnitFormData & { apartment_id: string }) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert([{
          apartment_id: apartmentId,
          unit_number: formData.unit_number,
          floor_number: formData.floor_number,
          area: formData.area,
          rent_amount: formData.rent_amount,
          deposit_amount: formData.deposit_amount,
          description: formData.description,
          status: formData.status,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] });
      toast({
        title: "Succès",
        description: "L'unité a été créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'unité",
        variant: "destructive",
      });
      console.error("Error creating unit:", error);
    }
  });

  return {
    data: units,
    isLoading,
    createUnit
  };
}