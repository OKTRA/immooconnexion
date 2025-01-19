import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment"

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['apartment-units', apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select('*')
        .eq('apartment_id', apartmentId)
        .order('unit_number', { ascending: true })

      if (error) throw error
      return data as ApartmentUnit[]
    }
  })

  const createUnit = useMutation({
    mutationFn: async (unit: Omit<ApartmentUnitFormData, 'id'>) => {
      const { data, error } = await supabase
        .from('apartment_units')
        .insert([{
          apartment_id: unit.apartment_id,
          unit_number: unit.unit_number,
          floor_level: unit.floor_level,
          area: unit.area,
          rent_amount: unit.rent_amount,
          deposit_amount: unit.deposit_amount,
          status: unit.status,
          description: unit.description,
          commission_percentage: unit.commission_percentage,
          unit_name: unit.unit_name,
          living_rooms: unit.living_rooms,
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          store_count: unit.store_count,
          has_pool: unit.has_pool,
          kitchen_count: unit.kitchen_count
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unit: ApartmentUnit) => {
      const { data, error } = await supabase
        .from('apartment_units')
        .update({
          unit_number: unit.unit_number,
          floor_level: unit.floor_level,
          area: unit.area,
          rent_amount: unit.rent_amount,
          deposit_amount: unit.deposit_amount,
          status: unit.status,
          description: unit.description,
          commission_percentage: unit.commission_percentage,
          unit_name: unit.unit_name,
          living_rooms: unit.living_rooms,
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          store_count: unit.store_count,
          has_pool: unit.has_pool,
          kitchen_count: unit.kitchen_count
        })
        .eq('id', unit.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from('apartment_units')
        .delete()
        .eq('id', unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
    }
  })

  return {
    units,
    isLoading,
    createUnit,
    updateUnit,
    deleteUnit
  }
}