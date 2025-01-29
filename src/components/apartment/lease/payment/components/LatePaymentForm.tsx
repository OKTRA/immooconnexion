import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { PaymentMethod } from "@/types/payment"
import { LatePaymentFormProps } from "../types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function LatePaymentForm({
  lease,
  onSuccess,
  isSubmitting,
  setIsSubmitting
}: LatePaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")

  // Récupérer les périodes en retard
  const { data: periods = [] } = useQuery({
    queryKey: ["late-payment-periods", lease.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", lease.id)
        .in("status", ["late", "pending"])
        .order("start_date", { ascending: true })

      if (error) throw error
      return data
    }
  })

  const calculateTotal = () => {
    return periods
      .filter(p => selectedPeriods.includes(p.id))
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const handleSubmit = async () => {
    if (selectedPeriods.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une période",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.functions.invoke("handle-late-payment", {
        body: {
          leaseId: lease.id,
          periodIds: selectedPeriods,
          paymentMethod,
          paymentDate: new Date().toISOString(),
          amount: calculateTotal()
        }
      })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré"
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting payment:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Périodes en retard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periods.map((period) => (
              <div
                key={period.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedPeriods.includes(period.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPeriods([...selectedPeriods, period.id])
                      } else {
                        setSelectedPeriods(selectedPeriods.filter(id => id !== period.id))
                      }
                    }}
                  />
                  <div>
                    <p className="font-medium">
                      {format(new Date(period.start_date), "d MMMM yyyy", { locale: fr })} - {" "}
                      {format(new Date(period.end_date), "d MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {period.amount.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
                <Badge variant={period.status === "late" ? "destructive" : "secondary"}>
                  {period.status === "late" ? "En retard" : "En attente"}
                </Badge>
              </div>
            ))}
            {periods.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucune période en retard
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPeriods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-lg font-medium">
              <span>Montant total</span>
              <span>{calculateTotal().toLocaleString()} FCFA</span>
            </div>

            <PaymentMethodSelect
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || selectedPeriods.length === 0}
              className="w-full"
            >
              {isSubmitting ? "Traitement..." : "Effectuer le paiement"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}