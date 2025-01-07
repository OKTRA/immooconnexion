import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit } from "@/types/apartment"
import { useToast } from "@/hooks/use-toast"

export function useApartmentUnits(apartmentId: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      if (!apartmentId) return []

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

      return data as ApartmentUnit[]
    },
    enabled: Boolean(apartmentId)
  })

  const createUnit = useMutation({
    mutationFn: async (unitData: Omit<ApartmentUnit, "id" | "apartment_id">) => {
      if (!apartmentId) throw new Error("Apartment ID is required")

      const { error } = await supabase
        .from("apartment_units")
        .insert([{ ...unitData, apartment_id: apartmentId }])

      if (error) {
        console.error("Error creating unit:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
      toast({
        title: "Succès",
        description: "L'unité a été créée avec succès"
      })
    },
    onError: (error) => {
      console.error("Error creating unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'unité",
        variant: "destructive"
      })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unitData: ApartmentUnit) => {
      if (!unitData.id) throw new Error("Unit ID is required")

      const { error } = await supabase
        .from("apartment_units")
        .update({
          unit_number: unitData.unit_number,
          floor_number: unitData.floor_number,
          area: unitData.area,
          rent_amount: unitData.rent_amount,
          deposit_amount: unitData.deposit_amount,
          status: unitData.status,
          description: unitData.description
        })
        .eq("id", unitData.id)

      if (error) {
        console.error("Error updating unit:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
      toast({
        title: "Succès",
        description: "L'unité a été mise à jour avec succès"
      })
    },
    onError: (error) => {
      console.error("Error updating unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'unité",
        variant: "destructive"
      })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) {
        console.error("Error deleting unit:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", apartmentId] })
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès"
      })
    },
    onError: (error) => {
      console.error("Error deleting unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'unité",
        variant: "destructive"
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