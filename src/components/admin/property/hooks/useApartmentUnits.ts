import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function useApartmentUnits(apartmentId: string, filterStatus?: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['apartment-units', apartmentId, filterStatus],
    queryFn: async () => {
      console.log('Fetching units for apartment:', apartmentId)
      let query = supabase
        .from('apartment_units')
        .select('*')
        .eq('apartment_id', apartmentId)

      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching units:', error)
        throw error
      }

      console.log('Fetched units:', data)
      return data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const { id, photo, ...unitData } = data
      let photoUrl = unitData.photo_url

      if (photo) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${apartmentId}/${fileName}`

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product_photos')
          .upload(filePath, photo)

        if (uploadError) throw uploadError

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('product_photos')
            .getPublicUrl(filePath)
          
          photoUrl = publicUrl
        }
      }

      if (id) {
        const { error } = await supabase
          .from('apartment_units')
          .update({ 
            ...unitData, 
            photo_url: photoUrl,
            apartment_id: apartmentId 
          })
          .eq('id', id)

        if (error) throw error
        return { ...data, id }
      } else {
        const { data: newUnit, error } = await supabase
          .from('apartment_units')
          .insert([{ 
            ...unitData, 
            apartment_id: apartmentId, 
            photo_url: photoUrl 
          }])
          .select()
          .single()

        if (error) throw error
        return newUnit
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
      toast({
        title: "Succès",
        description: "L'unité a été sauvegardée avec succès",
      })
    },
    onError: (error: any) => {
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
        .from('apartment_units')
        .delete()
        .eq('id', unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      })
    },
    onError: (error: any) => {
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