import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentList } from "@/components/apartment/ApartmentList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export default function Apartments() {
  const navigate = useNavigate()
  
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
          id,
          name,
          address,
          total_units,
          apartment_units (count)
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error

      return data.map(apartment => ({
        id: apartment.id,
        name: apartment.name,
        address: apartment.address,
        unit_count: apartment.total_units
      }))
    }
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartmentHeader />
        <ApartmentList 
          apartments={apartments}
          isLoading={isLoading}
          onViewUnits={(id) => navigate(`/agence/appartements/${id}/details`)}
        />
      </div>
    </AgencyLayout>
  )
}