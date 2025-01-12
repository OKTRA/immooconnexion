import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentActivities() {
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      if (!profile) throw new Error("Profil non trouvé")

      return profile
    },
    staleTime: 30 * 60 * 1000, // Cache pendant 30 minutes
  })

  const { data: recentContracts, isLoading: isLoadingContracts } = useQuery({
    queryKey: ["recent-activities", userProfile?.agency_id],
    queryFn: async () => {
      if (!userProfile?.agency_id) return []
      
      // Optimisation: Sélection uniquement des champs nécessaires
      const { data: contracts, error } = await supabase
        .from("contracts")
        .select(`
          id,
          montant,
          type,
          created_at,
          tenant_id (
            nom,
            prenom
          ),
          property_id (
            bien
          )
        `)
        .eq('agency_id', userProfile.agency_id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      return contracts
    },
    enabled: !!userProfile?.agency_id,
    staleTime: 1 * 60 * 1000, // Cache pendant 1 minute
  })

  if (isLoadingProfile || isLoadingContracts) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
                  {contract.tenant_id?.prenom} {contract.tenant_id?.nom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contract.property_id?.bien} - {contract.type}
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
                  {format(new Date(contract.created_at), "PPP", { locale: fr })}
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