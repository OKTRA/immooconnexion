import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useApartment(apartmentId: string | undefined) {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["apartment", apartmentId],
    queryFn: async () => {
      if (!apartmentId) {
        console.error("No apartment ID provided")
        throw new Error("Apartment ID is required")
      }

      console.log("Fetching apartment with ID:", apartmentId)
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

      return data
    },
    enabled: Boolean(apartmentId) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apartmentId)
  })
}