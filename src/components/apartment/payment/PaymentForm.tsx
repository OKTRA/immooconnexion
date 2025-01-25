import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentFormData, PaymentFormProps } from "./types"
import { PaymentDetails } from "./components/PaymentDetails"
import { PeriodSelector } from "./components/PeriodSelector"
import { usePaymentSubmission } from "./hooks/usePaymentSubmission"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function PaymentForm({ 
  onSuccess, 
  leaseId,
  isHistorical = false
}: PaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())

  const { data: lease } = useQuery({
    queryKey: ["lease-details", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:tenant_id (
            id,
            first_name,
            last_name
          ),
          unit:unit_id (
            id,
            unit_number,
            apartment:apartments (
              id,
              name
            )
          )
        `)
        .eq("id", leaseId)
        .single()

      if (error) throw error
      return data
    }
  })

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      leaseId,
      amount: 0,
      paymentMethod: "cash",
      selectedPeriods: [],
      paymentDate: new Date(),
      notes: "",
      isHistorical
    }
  })

  const { isSubmitting, handleSubmit: submitPayment } = usePaymentSubmission(onSuccess)

  useEffect(() => {
    if (lease && selectedPeriods.length > 0) {
      const totalAmount = selectedPeriods.length * lease.rent_amount
      setValue('amount', totalAmount)
    }
  }, [selectedPeriods, lease, setValue])

  const onSubmit = async (data: PaymentFormData) => {
    await submitPayment(data)
  }

  if (!lease) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PaymentDetails
        lease={lease}
        selectedPeriods={selectedPeriods}
        totalAmount={watch('amount')}
      />

      <PeriodSelector
        leaseId={leaseId}
        selectedPeriods={selectedPeriods}
        onPeriodsChange={setSelectedPeriods}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Méthode de paiement</Label>
          <PaymentMethodSelect
            value={watch("paymentMethod")}
            onChange={(value) => setValue("paymentMethod", value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            {...register("notes")}
            placeholder="Ajouter des notes sur le paiement..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || selectedPeriods.length === 0}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          "Effectuer le paiement"
        )}
      </Button>
    </form>
  )
}