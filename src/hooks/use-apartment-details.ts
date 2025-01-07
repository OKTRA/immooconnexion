import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Apartment, ApartmentUnit } from "@/types/apartment"
import { useToast } from "@/hooks/use-toast"

export function useApartmentDetails(apartmentId: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: apartment, isLoading: apartmentLoading } = useQuery({
    queryKey: ["apartment", apartmentId],
    queryFn: async () => {
      if (!apartmentId) {
        console.error("No apartment ID provided")
        return null
      }

      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("id", apartmentId)
        .maybeSingle()

      if (error) {
        console.error("Error fetching apartment:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'appartement",
          variant: "destructive",
        })
        throw error
      }

      if (!data) {
        toast({
          title: "Erreur",
          description: "Appartement non trouvé",
          variant: "destructive",
        })
        return null
      }

      return data as Apartment
    },
    enabled: Boolean(apartmentId)
  })

  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      if (!apartmentId) {
        console.error("No apartment ID provided")
        return []
      }

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
    mutationFn: async (unitData: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert([unitData])

      if (error) throw error
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

      if (error) throw error
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

      if (error) throw error
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
    apartment,
    apartmentLoading,
    units,
    unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  }
}