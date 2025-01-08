import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentList } from "@/components/apartment/ApartmentList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function Apartments() {
  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data, error } = await supabase
        .from("apartments")
        .select(`
          *,
          apartment_units (
            count
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error
      return data
    }
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartmentHeader />
        <ApartmentList 
          apartments={apartments}
          isLoading={isLoading}
          onViewUnits={(id) => console.log("View units", id)}
        />
      </div>
    </AgencyLayout>
  )
}