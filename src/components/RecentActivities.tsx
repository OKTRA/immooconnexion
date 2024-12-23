import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"

export function RecentActivities() {
  const { data: recentContracts, isLoading } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      console.log("Fetching recent activities...")
      
      // First get the current user's profile to check role
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      console.log('User ID:', user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, agency_name')
        .eq('id', user.id)
        .maybeSingle()

      console.log("User profile:", profile)

      // Build the base query for contracts
      let query = supabase
        .from("contracts")
        .select(`
          id,
          montant,
          type,
          created_at,
          tenant_id,
          property_id,
          agency_id
        `)

      // If not admin, only show agency's contracts
      if (profile?.role !== 'admin') {
        query = query.eq('agency_id', user.id)
      }

      const { data: contracts, error } = await query
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching recent activities:", error)
        throw error
      }

      console.log('Contracts before details:', contracts)

      // Fetch related tenant and property information
      const contractsWithDetails = await Promise.all(
        contracts.map(async (contract) => {
          const [tenantResult, propertyResult] = await Promise.all([
            contract.tenant_id
              ? supabase
                  .from('tenants')
                  .select('nom, prenom')
                  .eq('id', contract.tenant_id)
                  .single()
              : { data: null },
            supabase
              .from('properties')
              .select('bien')
              .eq('id', contract.property_id)
              .single()
          ])

          return {
            ...contract,
            tenant_nom: tenantResult.data?.nom,
            tenant_prenom: tenantResult.data?.prenom,
            property_name: propertyResult.data?.bien
          }
        })
      )

      console.log("Recent activities data:", contractsWithDetails)
      return contractsWithDetails
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentContracts?.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">
                  {contract.tenant_nom && contract.tenant_prenom 
                    ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                    : 'Non renseigné'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {contract.property_name || 'Non renseigné'} - {contract.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                  }).format(contract.montant || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contract.created_at
                    ? format(new Date(contract.created_at), "PPP", { locale: fr })
                    : "Date inconnue"}
                </p>
              </div>
            </div>
          ))}
          {(!recentContracts || recentContracts.length === 0) && (
            <p className="text-center text-muted-foreground">
              Aucune activité récente
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}