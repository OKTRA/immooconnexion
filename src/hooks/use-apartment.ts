import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Apartment } from "@/types/apartment"
import { useToast } from "@/hooks/use-toast"

export function useApartment(apartmentId: string | undefined) {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["apartment", apartmentId],
    queryFn: async () => {
      if (!apartmentId) return null

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

      return data as Apartment
    },
    enabled: Boolean(apartmentId)
  })
}