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
          floor_number: unitData.floor_number,
          area: unitData.area,
          rent_amount: unitData.rent_amount,
          deposit_amount: unitData.deposit_amount,
          status: unitData.status,
          description: unitData.description,
          commission_percentage: unitData.commission_percentage
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
          floor_number: unitData.floor_number,
          area: unitData.area,
          rent_amount: unitData.rent_amount,
          deposit_amount: unitData.deposit_amount,
          status: unitData.status,
          description: unitData.description,
          commission_percentage: unitData.commission_percentage
        })
        .eq("id", unitData.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  return {
    createUnit,
    updateUnit
  }
}