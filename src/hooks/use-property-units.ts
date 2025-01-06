import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyUnit, PropertyUnitFormData } from "@/components/admin/property/types/propertyUnit";
import { useToast } from "./use-toast";

export function usePropertyUnits(propertyId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number");

      if (error) throw error;
      return data as PropertyUnit[];
    }
  });

  const addUnit = useMutation({
    mutationFn: async (formData: PropertyUnitFormData & { property_id: string }) => {
      const { data, error } = await supabase
        .from("property_units")
        .insert([{
          ...formData,
          property_id: propertyId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units", propertyId] });
      toast({
        title: "Succès",
        description: "L'unité a été créée avec succès",
      });
    }
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
      queryClient.invalidateQueries({ queryKey: ["property-units", propertyId] });
      toast({
        title: "Succès",
        description: "L'unité a été mise à jour avec succès",
      });
    }
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
      queryClient.invalidateQueries({ queryKey: ["property-units", propertyId] });
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      });
    }
  });

  return {
    data: data || [],
    isLoading,
    addUnit,
    updateUnit,
    deleteUnit
  };
}