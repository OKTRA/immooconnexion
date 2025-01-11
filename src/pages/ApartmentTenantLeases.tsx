import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function ApartmentTenantLeases() {
  const { tenantId } = useParams<{ tenantId: string }>()

  const { data: leases, isLoading } = useQuery({
    queryKey: ["apartment-tenant-leases", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          unit:apartment_units(
            unit_number,
            apartment:apartments(name)
          )
        `)
        .eq("tenant_id", tenantId)
        .order("start_date", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!tenantId
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Contrats de location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leases?.map((lease) => (
                <div
                  key={lease.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {lease.unit.apartment.name} - Unité {lease.unit.unit_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Loyer: {lease.rent_amount.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Du {format(new Date(lease.start_date), "PP", { locale: fr })}
                      {lease.end_date && ` au ${format(new Date(lease.end_date), "PP", { locale: fr })}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Caution: {lease.deposit_amount?.toLocaleString()} FCFA
                    </p>
                  </div>
                  <Badge
                    variant={
                      lease.status === "active"
                        ? "success"
                        : lease.status === "expired"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {lease.status === "active"
                      ? "Actif"
                      : lease.status === "expired"
                      ? "Expiré"
                      : "Résilié"}
                  </Badge>
                </div>
              ))}
              {(!leases || leases.length === 0) && (
                <p className="text-center text-muted-foreground">
                  Aucun contrat trouvé
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyLayout>
  )
}