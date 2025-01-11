import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { TenantPersonalInfoTab } from "@/components/apartment/tenant/tabs/TenantPersonalInfoTab"
import { TenantLeaseTab } from "@/components/apartment/tenant/tabs/TenantLeaseTab"
import { TenantDocumentsTab } from "@/components/apartment/tenant/tabs/TenantDocumentsTab"
import { TenantInspectionsTab } from "@/components/apartment/tenant/tabs/TenantInspectionsTab"
import { TenantHeader } from "@/components/apartment/tenant/TenantHeader"

export default function ApartmentTenantDetails() {
  const { tenantId } = useParams()

  const { data: tenant, isLoading } = useQuery({
    queryKey: ["apartment-tenant", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments (
              name
            )
          ),
          apartment_leases (
            *
          )
        `)
        .eq("id", tenantId)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!tenantId
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (!tenant) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Locataire non trouvé
            </p>
          </Card>
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6 space-y-6">
        <TenantHeader tenant={tenant} />

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="lease">Bail et paiements</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <TenantPersonalInfoTab tenant={tenant} />
          </TabsContent>

          <TabsContent value="lease" className="space-y-6">
            <TenantLeaseTab tenant={tenant} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <TenantDocumentsTab tenant={tenant} />
          </TabsContent>

          <TabsContent value="inspections" className="space-y-6">
            <TenantInspectionsTab tenant={tenant} />
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}