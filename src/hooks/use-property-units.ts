import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyUnit, PropertyUnitFormData } from "@/types/property"

export function usePropertyUnits(propertyId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number")

      if (error) throw error
      return data as PropertyUnit[]
    }
  })

  const addUnit = useMutation({
    mutationFn: async (formData: PropertyUnitFormData & { property_id: string }) => {
      const { data, error } = await supabase
        .from("property_units")
        .insert([formData])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units", propertyId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (formData: PropertyUnitFormData & { property_id: string }) => {
      const { data, error } = await supabase
        .from("property_units")
        .update(formData)
        .eq("property_id", propertyId)
        .select()
        .single()

      if (error) throw error
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