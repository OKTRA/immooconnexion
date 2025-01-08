import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab"

export default function ApartmentTenants() {
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
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
        .from("apartment_tenants")
        .select("*")
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error
      return data
    }
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Locataires d'appartements</h1>
        
        <ApartmentTenantsTab
          apartmentId=""
          onDeleteTenant={async () => {}}
          onEditTenant={() => {}}
        />
      </div>
    </AgencyLayout>
  )
}