import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ApartmentUnit } from "@/types/apartment"

// Helper function to validate UUID format
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function useApartmentUnits(apartmentId: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      if (!apartmentId) {
        console.error("No apartment ID provided")
        return []
      }

      if (!isValidUUID(apartmentId)) {
        console.error("Invalid apartment ID format:", apartmentId)
        return []
      }

      console.log("Fetching units for apartment ID:", apartmentId)
      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          apartment_id,
          unit_number,
          floor_number,
          area,
          rent_amount,
          deposit_amount,
          status,
          description,
          created_at,
          updated_at,
          commission_percentage,
          current_lease:apartment_leases!apartment_leases_unit_id_fkey (
            id,
            tenant_id,
            unit_id,
            start_date,
            end_date,
            rent_amount,
            deposit_amount,
            status,
            tenant:apartment_tenants (
              id,
              first_name,
              last_name,
              email,
              phone_number,
              birth_date,
              profession
            )
          )
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

      // Transform the data to match ApartmentUnit type
      const transformedData = data.map(unit => ({
        ...unit,
        current_lease: unit.current_lease?.[0]
      })) as ApartmentUnit[]

      return transformedData
    },
    enabled: Boolean(apartmentId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
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