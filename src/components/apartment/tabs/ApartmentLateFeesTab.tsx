import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ApartmentLateFeesTabProps {
  apartmentId: string
}

export function ApartmentLateFeesTab({ apartmentId }: ApartmentLateFeesTabProps) {
  const { toast } = useToast()
  
  const { data: latePayments = [] } = useQuery({
    queryKey: ["late-payments", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("late_payment_fees")
        .select(`
          *,
          apartment_leases (
            tenant_id,
            apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les pénalités de retard",
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
        <CardTitle>Pénalités de retard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latePayments.map((fee) => (
            <div
              key={fee.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {fee.apartment_leases?.apartment_tenants?.first_name}{' '}
                  {fee.apartment_leases?.apartment_tenants?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Montant: {fee.amount.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  Jours de retard: {fee.days_late}
                </p>
              </div>
              <Badge variant={fee.status === "paid" ? "success" : "secondary"}>
                {fee.status}
              </Badge>
            </div>
          ))}
          {latePayments.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune pénalité de retard
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}