import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit } from "@/types/apartment"

export function useUnitMutations(apartmentId: string) {
  const queryClient = useQueryClient()

  const createUnit = useMutation({
    mutationFn: async (unitData: Omit<ApartmentUnit, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert({
          apartment_id: apartmentId,
          unit_number: unitData.unit_number,
          floor_level: unitData.floor_level,
          area: unitData.area,
          rent_amount: unitData.rent_amount,
          deposit_amount: unitData.deposit_amount,
          status: unitData.status,
          description: unitData.description,
          commission_percentage: unitData.commission_percentage,
          unit_name: unitData.unit_name,
          living_rooms: unitData.living_rooms,
          bedrooms: unitData.bedrooms,
          bathrooms: unitData.bathrooms,
          store_count: unitData.store_count,
          has_pool: unitData.has_pool,
          kitchen_count: unitData.kitchen_count
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unitData: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .update({
          unit_number: unitData.unit_number,
          floor_level: unitData.floor_level,
          area: unitData.area,
          rent_amount: unitData.rent_amount,
          deposit_amount: unitData.deposit_amount,
          status: unitData.status,
          description: unitData.description,
          commission_percentage: unitData.commission_percentage,
          unit_name: unitData.unit_name,
          living_rooms: unitData.living_rooms,
          bedrooms: unitData.bedrooms,
          bathrooms: unitData.bathrooms,
          store_count: unitData.store_count,
          has_pool: unitData.has_pool,
          kitchen_count: unitData.kitchen_count
        })
        .eq("id", unitData.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  return {
    createUnit,
    updateUnit,
    deleteUnit
  }
}