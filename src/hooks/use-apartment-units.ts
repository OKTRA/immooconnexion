import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ApartmentUnit } from "@/types/apartment"

export function useApartmentUnits(apartmentId: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      if (!apartmentId) {
        console.error("No apartment ID provided")
        throw new Error("Apartment ID is required")
      }

      console.log("Fetching units for apartment ID:", apartmentId)
      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          floor_number,
          area,
          rent_amount,
          deposit_amount,
          status,
          description
        `)
        .eq("apartment_id", apartmentId)
        .order("unit_number")

      if (error) {
        console.error("Error fetching units:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les unités",
          variant: "destructive",
        })
        throw error
      }

      return (data || []) as ApartmentUnit[]
    },
    enabled: Boolean(apartmentId) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apartmentId),
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    gcTime: 30 * 60 * 1000 // Garde en cache pendant 30 minutes
  })

  const createUnit = useMutation({
    mutationFn: async (newUnit: Omit<ApartmentUnit, 'id' | 'created_at' | 'updated_at' | 'apartment_id'>) => {
      if (!apartmentId) throw new Error("Apartment ID is required")

      const { data, error } = await supabase
        .from("apartment_units")
        .insert({
          ...newUnit,
          apartment_id: apartmentId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
      toast({
        title: "Succès",
        description: "Unité créée avec succès",
      })
    },
    onError: (error) => {
      console.error("Error creating unit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer l'unité",
        variant: "destructive",
      })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (updatedUnit: Partial<ApartmentUnit> & { id: string }) => {
      const { data, error } = await supabase
        .from("apartment_units")
        .update(updatedUnit)
        .eq("id", updatedUnit.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
      toast({
        title: "Succès",
        description: "Unité mise à jour avec succès",
      })
    },
    onError: (error) => {
      console.error("Error updating unit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'unité",
        variant: "destructive",
      })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
      toast({
        title: "Succès",
        description: "Unité supprimée avec succès",
      })
    },
    onError: (error) => {
      console.error("Error deleting unit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'unité",
        variant: "destructive",
      })
    }
  })

  return {
    ...query,
    createUnit,
    updateUnit,
    deleteUnit
  }
}