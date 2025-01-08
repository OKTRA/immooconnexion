import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab"
import { ApartmentPaymentsTab } from "@/components/apartment/tabs/ApartmentPaymentsTab"

export default function ApartmentTenantManagement() {
  const { id } = useParams<{ id: string }>()

  const { data: apartment, isLoading } = useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from("apartments")
        .select(`
          *,
          apartment_units (*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    },
    enabled: Boolean(id)
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <div>Chargement...</div>
        </div>
      </AgencyLayout>
    )
  }

  if (!apartment) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <div>Appartement non trouvé</div>
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">{apartment.name}</h1>

        <Tabs defaultValue="tenants" className="mt-6">
          <TabsList>
            <TabsTrigger value="tenants">Locataires</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <ApartmentTenantsTab 
              apartmentId={id} 
              units={apartment.apartment_units} 
            />
          </TabsContent>

          <TabsContent value="payments">
            <ApartmentPaymentsTab apartmentId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}