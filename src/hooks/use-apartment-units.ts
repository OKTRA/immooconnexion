import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit } from "@/types/apartment"
import { useToast } from "@/hooks/use-toast"

export function useApartmentUnits(apartmentId: string | null) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Validate UUID format
  const isValidUUID = apartmentId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apartmentId)

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['apartment-units', apartmentId],
    queryFn: async () => {
      if (!apartmentId || !isValidUUID) {
        console.error('Invalid apartment ID:', apartmentId)
        return []
      }

      const { data, error } = await supabase
        .from('apartment_units')
        .select('*')
        .eq('apartment_id', apartmentId)
        .order('unit_number', { ascending: true })

      if (error) {
        console.error('Error fetching units:', error)
        toast({
          title: "Error",
          description: "Failed to fetch apartment units",
          variant: "destructive"
        })
        throw error
      }

      return data as ApartmentUnit[]
    },
    enabled: Boolean(apartmentId) && isValidUUID
  })

  const createUnit = useMutation({
    mutationFn: async (unit: Omit<ApartmentUnit, 'id' | 'created_at' | 'updated_at'>) => {
      if (!apartmentId || !isValidUUID) {
        throw new Error('Invalid apartment ID')
      }

      const { data, error } = await supabase
        .from('apartment_units')
        .insert([{
          apartment_id: apartmentId,
          ...unit
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
      toast({
        title: "Success",
        description: "Unit created successfully"
      })
    },
    onError: (error) => {
      console.error('Error creating unit:', error)
      toast({
        title: "Error",
        description: "Failed to create unit",
        variant: "destructive"
      })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unit: ApartmentUnit) => {
      if (!apartmentId || !isValidUUID) {
        throw new Error('Invalid apartment ID')
      }

      const { data, error } = await supabase
        .from('apartment_units')
        .update(unit)
        .eq('id', unit.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
      toast({
        title: "Success",
        description: "Unit updated successfully"
      })
    },
    onError: (error) => {
      console.error('Error updating unit:', error)
      toast({
        title: "Error",
        description: "Failed to update unit",
        variant: "destructive"
      })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      if (!apartmentId || !isValidUUID) {
        throw new Error('Invalid apartment ID')
      }

      const { error } = await supabase
        .from('apartment_units')
        .delete()
        .eq('id', unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
      toast({
        title: "Success",
        description: "Unit deleted successfully"
      })
    },
    onError: (error) => {
      console.error('Error deleting unit:', error)
      toast({
        title: "Error",
        description: "Failed to delete unit",
        variant: "destructive"
      })
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