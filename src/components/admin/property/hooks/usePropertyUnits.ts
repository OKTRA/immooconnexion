import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function usePropertyUnits(propertyId: string, filterStatus?: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['property-units', propertyId, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('property_units')
        .select('*')
        .eq('property_id', propertyId)
        .order('unit_number')

      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching units:', error)
        throw error
      }

      return data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const { id, ...unitData } = data
      
      if (id) {
        const { error } = await supabase
          .from('property_units')
          .update(unitData)
          .eq('id', id)

        if (error) throw error
        return { ...data, id }
      } else {
        const { data: newUnit, error } = await supabase
          .from('property_units')
          .insert(unitData)
          .select()
          .single()

        if (error) throw error
        return newUnit
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-units', propertyId] })
      toast({
        title: "Succès",
        description: "L'unité a été sauvegardée avec succès",
      })
    },
    onError: (error) => {
      console.error('Error saving unit:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from('property_units')
        .delete()
        .eq('id', unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-units', propertyId] })
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      })
    },
    onError: (error) => {
      console.error('Error deleting unit:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    },
  })

  return {
    units,
    isLoading,
    mutation,
    deleteMutation,
  }
}