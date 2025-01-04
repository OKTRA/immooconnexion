import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyUnit } from "../types/propertyUnit"
import { useToast } from "@/components/ui/use-toast"

export function usePropertyUnits(propertyId: string, filterStatus?: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["property-units", propertyId, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number")

      if (filterStatus) {
        query = query.eq("status", filterStatus)
      }

      const { data, error } = await query
      if (error) throw error
      return data as PropertyUnit[]
    },
  })

  const mutation = useMutation({
    mutationFn: async (unit: PropertyUnit) => {
      if (unit.id) {
        const { error } = await supabase
          .from("property_units")
          .update({
            unit_number: unit.unit_number,
            floor_number: unit.floor_number,
            area: unit.area,
          })
          .eq("id", unit.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("property_units")
          .insert({
            property_id: propertyId,
            unit_number: unit.unit_number,
            floor_number: unit.floor_number,
            area: unit.area,
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
      toast({
        title: "Succès",
        description: "L'unité a été mise à jour avec succès",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue: " + error.message,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("property_units")
        .delete()
        .eq("id", unitId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
      toast({
        title: "Unité supprimée",
        description: "L'unité a été supprimée avec succès",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue: " + error.message,
        variant: "destructive",
      })
    },
  })

  return {
    units,
    isLoading,
    mutation,
    deleteMutation,
  }
}