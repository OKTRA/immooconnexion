import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function useApartUnits(apartmentId: string, filterStatus?: string) {
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['apartment-units', apartmentId, filterStatus],
    queryFn: async () => {
      console.log('Fetching units for apartment:', apartmentId)
      let query = supabase
        .from('property_units')
        .select('*')
        .eq('apartment_id', apartmentId)

      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query.order('unit_number')

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
          .from('property_units')
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
          .from('property_units')
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
      queryClient.invalidateQueries({ queryKey: ['apartment-units', apartmentId] })
    },
  })

  return {
    units,
    isLoading,
    mutation,
    deleteMutation,
  }
}