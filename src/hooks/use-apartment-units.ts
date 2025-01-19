import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ApartmentUnit } from "@/types/apartment"

export function useApartmentUnits(apartmentId: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      if (!apartmentId) {
        console.error("No apartment ID provided")
        return []
      }

      console.log("Fetching units for apartment ID:", apartmentId)
      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          apartment_id,
          unit_number,
          floor_number,
          area,
          rent_amount,
          deposit_amount,
          status,
          description,
          commission_percentage,
          created_at,
          updated_at
        `)
        .eq("apartment_id", apartmentId)
        .order("unit_number")

      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }

      return data as ApartmentUnit[]
    },
    enabled: Boolean(apartmentId)
  })

  const createUnit = useMutation({
    mutationFn: async (newUnit: Omit<ApartmentUnit, "id" | "created_at" | "updated_at">) => {
      console.log("Creating new unit:", newUnit)
      const { data, error } = await supabase
        .from("apartment_units")
        .insert({
          apartment_id: apartmentId,
          unit_number: newUnit.unit_number,
          floor_number: newUnit.floor_number,
          area: newUnit.area,
          rent_amount: newUnit.rent_amount,
          deposit_amount: newUnit.deposit_amount,
          status: newUnit.status,
          description: newUnit.description,
          commission_percentage: newUnit.commission_percentage
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating unit:", error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (updatedUnit: ApartmentUnit) => {
      console.log("Updating unit:", updatedUnit)
      const { data, error } = await supabase
        .from("apartment_units")
        .update({
          unit_number: updatedUnit.unit_number,
          floor_number: updatedUnit.floor_number,
          area: updatedUnit.area,
          rent_amount: updatedUnit.rent_amount,
          deposit_amount: updatedUnit.deposit_amount,
          status: updatedUnit.status,
          description: updatedUnit.description,
          commission_percentage: updatedUnit.commission_percentage
        })
        .eq("id", updatedUnit.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating unit:", error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      console.log("Deleting unit:", unitId)
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) {
        console.error("Error deleting unit:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  return {
    ...query,
    createUnit,
    updateUnit,
    deleteUnit
  }
}