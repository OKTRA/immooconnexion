import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function usePropertyUnits(propertyId: string, filterStatus?: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Ajout d'une requête pour vérifier la catégorie de la propriété
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('property_category')
        .eq('id', propertyId)
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['property-units', propertyId, filterStatus],
    queryFn: async () => {
      // Vérifier si la propriété est de type apartment
      if (property?.property_category !== 'apartment') {
        throw new Error('Cette propriété n\'est pas un appartement')
      }

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
    enabled: !!property, // N'exécute la requête que si nous avons les données de la propriété
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Vérifier à nouveau la catégorie avant la mutation
      if (property?.property_category !== 'apartment') {
        throw new Error('Cette propriété n\'est pas un appartement')
      }

      const { id, photo, ...unitData } = data
      let photoUrl = unitData.photo_url

      // Convertir les champs numériques
      const numericFields = {
        ...unitData,
        area: unitData.area ? Number(unitData.area) : null,
        rent: unitData.rent ? Number(unitData.rent) : null,
        deposit: unitData.deposit ? Number(unitData.deposit) : null,
        floor_number: unitData.floor_number ? Number(unitData.floor_number) : null
      }

      if (photo) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${propertyId}/${fileName}`

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('property_photos')
          .upload(filePath, photo)

        if (uploadError) throw uploadError

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('property_photos')
            .getPublicUrl(filePath)
          
          photoUrl = publicUrl
        }
      }
      
      if (id) {
        const { error } = await supabase
          .from('property_units')
          .update({ ...numericFields, photo_url: photoUrl })
          .eq('id', id)

        if (error) throw error
        return { ...data, id }
      } else {
        const { data: newUnit, error } = await supabase
          .from('property_units')
          .insert({ ...numericFields, photo_url: photoUrl })
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
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde",
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