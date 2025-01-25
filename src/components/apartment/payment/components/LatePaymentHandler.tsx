import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentDialog } from "../PaymentDialog"
import { toast } from "@/hooks/use-toast"

interface LatePaymentHandlerProps {
  leaseId: string
}

export function LatePaymentHandler({ leaseId }: LatePaymentHandlerProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const { data: lateFees = [] } = useQuery({
    queryKey: ["late-fees", leaseId],
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
        .eq("lease_id", leaseId)
        .order("created_at", { ascending: false })

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
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pénalités de retard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lateFees.map((fee) => (
            <div
              key={fee.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {fee.amount.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-muted-foreground">
                  {fee.days_late} jours de retard
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(fee.created_at), "PPp", { locale: fr })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant={fee.status === "paid" ? "success" : "destructive"}
                >
                  {fee.status === "paid" ? "Payé" : "Non payé"}
                </Badge>
                {fee.status !== "paid" && (
                  <Button
                    size="sm"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    Payer
                  </Button>
                )}
              </div>
            </div>
          ))}
          {lateFees.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune pénalité de retard
            </p>
          )}
        </div>
      </CardContent>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        leaseId={leaseId}
      />
    </Card>
  )
}