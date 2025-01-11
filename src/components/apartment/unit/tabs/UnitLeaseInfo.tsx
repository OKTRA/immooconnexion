import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface UnitLeaseInfoProps {
  unitId: string
}

export function UnitLeaseInfo({ unitId }: UnitLeaseInfoProps) {
  const { data: currentLease } = useQuery({
    queryKey: ["unit-lease", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants (
            first_name,
            last_name,
            phone_number
          )
        `)
        .eq("unit_id", unitId)
        .eq("status", "active")
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  if (!currentLease) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bail actuel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Aucun bail actif
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bail actuel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Locataire</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.tenant?.first_name} {currentLease.tenant?.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Contact</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.tenant?.phone_number || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Date de début</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(currentLease.start_date), "PP", { locale: fr })}
            </p>
          </div>
          {currentLease.end_date && (
            <div>
              <p className="text-sm font-medium">Date de fin</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(currentLease.end_date), "PP", { locale: fr })}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Fréquence de paiement</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.payment_frequency === "monthly" ? "Mensuel" : 
               currentLease.payment_frequency === "quarterly" ? "Trimestriel" : 
               currentLease.payment_frequency === "yearly" ? "Annuel" : 
               currentLease.payment_frequency}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Type de durée</p>
            <p className="text-sm text-muted-foreground">
              {currentLease.duration_type === "fixed" ? "Durée déterminée" :
               currentLease.duration_type === "month_to_month" ? "Mois par mois" :
               currentLease.duration_type === "yearly" ? "Annuel" :
               currentLease.duration_type}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}