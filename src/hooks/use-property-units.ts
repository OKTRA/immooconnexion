import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyUnit } from "@/components/admin/property/types/propertyUnit"

export function usePropertyUnits(propertyId: string) {
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['property-units', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_units')
        .select('*')
        .eq('property_id', propertyId)
        .order('unit_number', { ascending: true })

      if (error) throw error
      return data as PropertyUnit[]
    }
  })

  const addUnit = useMutation({
    mutationFn: async (unit: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('property_units')
        .insert([{
          property_id: unit.property_id,
          unit_number: unit.unit_number,
          floor_level: unit.floor_level,
          area: unit.area,
          rent_amount: unit.rent_amount,
          deposit_amount: unit.deposit_amount,
          status: unit.status,
          description: unit.description
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-units', propertyId] })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unit: PropertyUnit) => {
      const { data, error } = await supabase
        .from('property_units')
        .update({
          unit_number: unit.unit_number,
          floor_level: unit.floor_level,
          area: unit.area,
          rent_amount: unit.rent_amount,
          deposit_amount: unit.deposit_amount,
          status: unit.status,
          description: unit.description
        })
        .eq('id', unit.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-units', propertyId] })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from('property_units')
        .delete()
        .eq('id', unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-units', propertyId] })
    }
  })

  return {
    units,
    isLoading,
    addUnit,
    updateUnit,
    deleteUnit
  }
}