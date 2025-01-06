import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface PropertyUnit {
  id: string
  property_id: string
  unit_number: string
  floor_number: number
  area: number
  rent: number
  deposit: number
  photo_url: string | null
  description: string | null
  category: string | null
  amenities: string[]
  status: "available" | "occupied" | "maintenance"
}

export function usePropertyUnits(propertyId: string) {
  return useQuery({
    queryKey: ["apartment-units", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", propertyId)
        .order("unit_number")

      if (error) throw error
      return data as PropertyUnit[]
    }
  })
}

export function useAddPropertyUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUnit: Omit<PropertyUnit, "id">) => {
      const { data, error } = await supabase
        .from("apartment_units")
        .insert(newUnit)

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["apartment-units"])
    }
  })
}

export function useUpdatePropertyUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (unit: PropertyUnit) => {
      const { data, error } = await supabase
        .from("apartment_units")
        .update(unit)
        .eq("id", unit.id)

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["apartment-units"])
    }
  })
}

export function useDeletePropertyUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (unitId: string) => {
      const { data, error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["apartment-units"])
    }
  })
}
