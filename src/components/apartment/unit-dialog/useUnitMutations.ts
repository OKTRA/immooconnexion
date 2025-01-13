import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit } from "@/types/apartment"

export function useUnitMutations(apartmentId: string) {
  const queryClient = useQueryClient()

  const createUnit = useMutation({
    mutationFn: async (data: Omit<ApartmentUnit, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert({
          apartment_id: apartmentId,
          unit_number: data.unit_number,
          floor_number: data.floor_number?.toString(),
          area: data.area?.toString(),
          rent_amount: data.rent_amount.toString(),
          deposit_amount: data.deposit_amount?.toString(),
          status: data.status,
          description: data.description,
          commission_percentage: data.commission_percentage?.toString()
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (data: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .update({
          unit_number: data.unit_number,
          floor_number: data.floor_number?.toString(),
          area: data.area?.toString(),
          rent_amount: data.rent_amount.toString(),
          deposit_amount: data.deposit_amount?.toString(),
          status: data.status,
          description: data.description,
          commission_percentage: data.commission_percentage?.toString()
        })
        .eq("id", data.id)

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