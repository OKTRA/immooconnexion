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
      console.log("Fetching units for property:", propertyId)
      let query = supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number")

      if (filterStatus) {
        query = query.eq("status", filterStatus)
      }

      const { data, error } = await query
      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }
      console.log("Fetched units:", data)
      return data as PropertyUnit[]
    },
  })

  const mutation = useMutation({
    mutationFn: async (unit: PropertyUnit) => {
      console.log("Mutating unit:", unit)
      if (unit.id) {
        const { error } = await supabase
          .from("property_units")
          .update({
            unit_number: unit.unit_number,
            floor_number: unit.floor_number,
            area: unit.area,
            rent: unit.rent,
            deposit: unit.deposit,
            description: unit.description,
            category: unit.category,
            amenities: unit.amenities,
            photo_url: unit.photo_url
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
            rent: unit.rent,
            deposit: unit.deposit,
            description: unit.description,
            category: unit.category,
            amenities: unit.amenities,
            photo_url: unit.photo_url
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (unitId: string) => {
      console.log("Deleting unit:", unitId)
      const { error } = await supabase
        .from("property_units")
        .delete()
        .eq("id", unitId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
    }
  })

  return {
    units,
    isLoading,
    mutation,
    deleteMutation,
  }
}