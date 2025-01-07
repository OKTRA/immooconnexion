import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ApartmentDepositsTabProps {
  apartmentId: string
}

export function ApartmentDepositsTab({ apartmentId }: ApartmentDepositsTabProps) {
  const { toast } = useToast()

  const { data: deposits = [] } = useQuery({
    queryKey: ["deposits", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          apartment_tenants (
            first_name,
            last_name
          )
        `)
        .eq('status', 'expired')
        .is('deposit_returned', false)
        .order('end_date', { ascending: false })

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les cautions",
          variant: "destructive",
        })
        throw error
      }
      return data
    },
    enabled: Boolean(apartmentId)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des cautions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deposits.map((lease) => (
            <div
              key={lease.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {lease.apartment_tenants?.first_name}{' '}
                  {lease.apartment_tenants?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Caution: {lease.deposit_amount?.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  Fin du bail: {format(new Date(lease.end_date), "PPp", { locale: fr })}
                </p>
              </div>
              <Badge variant="secondary">
                En attente de remboursement
              </Badge>
            </div>
          ))}
          {deposits.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune caution à rembourser
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}