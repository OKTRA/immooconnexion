import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function LatePaymentFees() {
  const { data: fees = [], refetch } = useQuery({
    queryKey: ["late-payment-fees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("late_payment_fees")
        .select(`
          *,
          lease:apartment_leases(
            tenant:tenants(nom, prenom),
            unit:apartment_units(
              unit_number,
              apartment:apartments(name)
            )
          )
        `)
        .order("created_at", { ascending: false })
        .eq("status", "pending")

      if (error) throw error
      return data
    },
  })

  const updateFeeStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("late_payment_fees")
        .update({ status })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la pénalité a été mis à jour avec succès",
      })

      refetch()
    } catch (error) {
      console.error("Error updating fee status:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pénalités de retard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  {fee.lease?.tenant?.prenom} {fee.lease?.tenant?.nom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {fee.lease?.unit?.apartment?.name} - Unité{" "}
                  {fee.lease?.unit?.unit_number}
                </p>
                <p className="text-sm">
                  Montant: {fee.amount.toLocaleString()} FCFA
                </p>
                <p className="text-sm">Jours de retard: {fee.days_late}</p>
                <p className="text-xs text-muted-foreground">
                  Date:{" "}
                  {format(new Date(fee.created_at), "Pp", { locale: fr })}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFeeStatus(fee.id, "paid")}
                >
                  Marquer comme payé
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFeeStatus(fee.id, "cancelled")}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ))}
          {fees.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Aucune pénalité de retard
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}