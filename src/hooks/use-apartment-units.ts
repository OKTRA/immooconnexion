import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentUnit, ApartmentUnitFormData } from "@/components/apartment/types";
import { useToast } from "@/hooks/use-toast";

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
    deleteUnit,
  };
}