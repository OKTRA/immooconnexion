import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentFormData } from "./types"
import { PeriodSelector } from "./components/PeriodSelector"
import { usePaymentSubmission } from "./hooks/usePaymentSubmission"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LeaseData } from "@/components/apartment/lease/payment/types"

interface PaymentFormProps {
  onSuccess?: () => void;
  leaseId: string;
  lease: LeaseData;
  isHistorical?: boolean;
}

export function PaymentForm({ 
  onSuccess, 
  leaseId,
  lease,
  isHistorical = false
}: PaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      leaseId,
      amount: 0,
      paymentMethod: "cash",
      paymentPeriods: [],
      paymentDate: new Date(),
      notes: "",
      isHistorical
    }
  })

  const { data: periods = [] } = useQuery({
    queryKey: ["lease-periods", leaseId],
    queryFn: async () => {
      console.log("Fetching payment periods for lease:", leaseId)
      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", leaseId)
        .eq("status", "pending")
        .order("start_date", { ascending: true })

      if (error) {
        console.error("Error fetching periods:", error)
        throw error
      }
      console.log("Fetched periods:", data)
      return data
    },
    enabled: !!leaseId
  })

  useEffect(() => {
    if (lease && selectedPeriods.length > 0) {
      const totalAmount = selectedPeriods.length * lease.rent_amount
      console.log("Calculating total amount:", totalAmount, "for periods:", selectedPeriods.length)
      setValue('amount', totalAmount)
      setValue('paymentPeriods', selectedPeriods)
      setValue('paymentDate', paymentDate)
    }
  }, [selectedPeriods, lease, setValue, paymentDate])

  const { isSubmitting, handleSubmit: submitPayment } = usePaymentSubmission(onSuccess)

  const onSubmit = async (data: PaymentFormData) => {
    if (!lease) return
    console.log("Submitting payment:", data)
    await submitPayment(data, lease, selectedPeriods.length, lease.agency_id)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PaymentMethodSelect
        value={watch("paymentMethod")}
        onChange={(value) => setValue("paymentMethod", value)}
      />

      <PeriodSelector
        periods={periods}
        selectedPeriods={selectedPeriods}
        onPeriodsChange={setSelectedPeriods}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
      />

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          {...register("notes")}
          placeholder="Ajouter des notes sur le paiement..."
          className="min-h-[100px]"
        />
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