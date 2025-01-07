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
        .select("*")
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

      // Convert string status to ApartmentUnitStatus
      return (data || []).map(unit => ({
        ...unit,
        status: unit.status as ApartmentUnit["status"]
      })) as ApartmentUnit[]
    },
    enabled: Boolean(apartmentId)
  })

  const createUnit = useMutation({
    mutationFn: async (newUnit: Omit<ApartmentUnit, 'id' | 'created_at' | 'updated_at' | 'apartment_id'>) => {
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
      toast({
        title: "Erreur",
        description: "Impossible de créer l'unité",
        variant: "destructive",
      })
      throw error
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
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'unité",
        variant: "destructive",
      })
      throw error
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
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'unité",
        variant: "destructive",
      })
      throw error
    }
  })

  return {
    ...query,
    createUnit,
    updateUnit,
    deleteUnit
  }
}