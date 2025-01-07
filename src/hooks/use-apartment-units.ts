import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useApartmentUnits(apartmentId: string | undefined) {
  const { toast } = useToast()

  return useQuery({
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

      return data || []
    },
    enabled: Boolean(apartmentId)
  })
}