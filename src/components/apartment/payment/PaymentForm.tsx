import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { usePaymentForm, PaymentFormData } from "./hooks/usePaymentForm"
import { LeaseSelect } from "./components/LeaseSelect"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { supabase } from "@/integrations/supabase/client"

export function PaymentForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const {
    leases,
    isLoadingLeases,
    paymentPeriods,
    isLoadingPeriods,
    selectedLeaseId,
    setSelectedLeaseId,
    isSubmitting,
    setIsSubmitting
  } = usePaymentForm(onSuccess)

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      leaseId: "",
      amount: 0,
      paymentMethod: "cash",
      paymentPeriods: []
    }
  })

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    try {
      // Create payment record
      const { error: paymentError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: data.leaseId,
          amount: data.amount,
          payment_method: data.paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString() // This should be set based on the payment period
        })

      if (paymentError) throw paymentError

      // Update payment period status
      if (data.paymentPeriods.length > 0) {
        const { error: periodError } = await supabase
          .from("apartment_payment_periods")
          .update({ status: "paid" })
          .in("id", data.paymentPeriods)

        if (periodError) throw periodError
      }

      toast({
        title: "Paiement effectué",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingLeases) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Contrat de location</Label>
        <LeaseSelect
          leases={leases}
          selectedLeaseId={selectedLeaseId}
          onLeaseSelect={(value) => {
            setSelectedLeaseId(value)
            setValue("leaseId", value)
          }}
        />
      </div>

      {selectedLeaseId && (
        <>
          <div className="space-y-2">
            <Label>Périodes de paiement</Label>
            {isLoadingPeriods ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {paymentPeriods.map((period) => (
                  <label key={period.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={period.id}
                      {...register("paymentPeriods")}
                      className="rounded border-gray-300"
                    />
                    <span>
                      {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()} ({period.amount.toLocaleString()} FCFA)
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { required: true, min: 0 })}
              placeholder="Montant en FCFA"
            />
          </div>

          <div className="space-y-2">
            <Label>Mode de paiement</Label>
            <PaymentMethodSelect
              value={watch("paymentMethod")}
              onChange={(value) => setValue("paymentMethod", value)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Effectuer le paiement"
            )}
          </Button>
        </>
      )}
    </form>
  )
}

