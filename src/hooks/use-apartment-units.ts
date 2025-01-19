import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit } from "@/types/apartment"
import { useToast } from "@/hooks/use-toast"

export function useApartmentUnits(apartmentId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['apartment-units', apartmentId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
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
    retry: 1,
    enabled: Boolean(apartmentId)
  })

  const createUnit = useMutation({
    mutationFn: async (unit: Omit<ApartmentUnit, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
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