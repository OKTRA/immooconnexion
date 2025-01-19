import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyUnit, PropertyUnitFormData } from "@/types/property"

export function usePropertyUnits(propertyId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: async () => {
      if (!propertyId) {
        console.error("Property ID is required")
        return []
      }

      const { data, error } = await supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number")

      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }

      return data as PropertyUnit[]
    },
    enabled: Boolean(propertyId)
  })

  const addUnit = useMutation({
    mutationFn: async (formData: Omit<PropertyUnitFormData, 'id'> & { property_id: string }) => {
      console.log("Adding unit with data:", formData)
      const { data, error } = await supabase
        .from("property_units")
        .insert([{
          ...formData,
          property_id: propertyId
        }])
        .select()
        .single()

      if (error) {
        console.error("Error adding unit:", error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units", propertyId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unit: PropertyUnitFormData & { property_id: string; id: string }) => {
      console.log("Updating unit with data:", unit)
      const { data, error } = await supabase
        .from("property_units")
        .update(unit)
        .eq("id", unit.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating unit:", error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units", propertyId] })
    }
  })

  return {
    data: data || [],
    isLoading,
    addUnit,
    updateUnit
  }
}