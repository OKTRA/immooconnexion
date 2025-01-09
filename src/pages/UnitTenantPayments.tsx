import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export default function UnitTenantPayments() {
  const { unitId, tenantId } = useParams()

  const { data: payments, isLoading } = useQuery({
    queryKey: ["unit-tenant-payments", unitId, tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases!inner (
            tenant_id
          )
        `)
        .eq("apartment_leases.tenant_id", tenantId)

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Paiements du locataire</h1>
        {/* Add payments table here */}
      </div>
    </AgencyLayout>
  )
}