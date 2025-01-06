import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyUnit } from "@/components/admin/property/types/propertyUnit";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyUnits(propertyId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: units = [], isLoading, error } = useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: async () => {
      console.log("Fetching units for property:", propertyId);
      
      const { data: propertyUnits, error } = await supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number");

      if (error) {
        console.error("Error fetching property units:", error);
        throw error;
      }

      return propertyUnits;
    },
    enabled: !!propertyId,
  });

  const createUnit = useMutation({
    mutationFn: async (unit: Omit<PropertyUnit, "id">) => {
      const { data, error } = await supabase
        .from("property_units")
        .insert([unit])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] });
      toast({
        title: "Unité créée",
        description: "L'unité a été créée avec succès",
      });
    },
    onError: (error) => {
      console.error("Error creating unit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'unité",
        variant: "destructive",
      });
    },
  });

  const updateUnit = useMutation({
    mutationFn: async (unit: PropertyUnit) => {
      const { data, error } = await supabase
        .from("property_units")
        .update(unit)
        .eq("id", unit.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] });
      toast({
        title: "Unité mise à jour",
        description: "L'unité a été mise à jour avec succès",
      });
    },
    onError: (error) => {
      console.error("Error updating unit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'unité",
        variant: "destructive",
      });
    },
  });

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("property_units")
        .delete()
        .eq("id", unitId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] });
      toast({
        title: "Unité supprimée",
        description: "L'unité a été supprimée avec succès",
      });
    },
    onError: (error) => {
      console.error("Error deleting unit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'unité",
        variant: "destructive",
      });
    },
  });

  return {
    units,
    isLoading,
    error,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}