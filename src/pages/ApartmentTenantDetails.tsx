import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { TenantPersonalInfoTab } from "@/components/apartment/tenant/tabs/TenantPersonalInfoTab"
import { TenantLeaseTab } from "@/components/apartment/tenant/tabs/TenantLeaseTab"
import { TenantDocumentsTab } from "@/components/apartment/tenant/tabs/TenantDocumentsTab"
import { TenantInspectionsTab } from "@/components/apartment/tenant/tabs/TenantInspectionsTab"
import { TenantHeader } from "@/components/apartment/tenant/TenantHeader"
import { useApartmentTenant } from "@/hooks/use-apartment-tenant"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export default function ApartmentTenantDetails() {
  const { tenantId } = useParams()
  const { toast } = useToast()
  
  const { data: tenant, isLoading, error } = useApartmentTenant(tenantId!)

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du locataire",
        variant: "destructive",
      })
    }
  }, [error, toast])

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