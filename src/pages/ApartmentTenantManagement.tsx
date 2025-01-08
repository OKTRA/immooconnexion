import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab"
import { Loader2 } from "lucide-react"

export default function ApartmentTenantManagement() {
  const { id: apartmentId } = useParams<{ id: string }>()

  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("apartment_id", apartmentId)

      if (error) throw error
      return data || []
    },
    enabled: !!apartmentId
  })

  if (!apartmentId) {
    return <div>Apartment ID is required</div>
  }

  if (tenantsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartmentTenantsTab
          apartmentId={apartmentId}
          tenants={tenants}
          onDeleteTenant={async (id) => {
            await supabase
              .from("apartment_tenants")
              .delete()
              .eq("id", id)
          }}
          onEditTenant={() => {}}
        />
      </div>
    </AgencyLayout>
  )
}