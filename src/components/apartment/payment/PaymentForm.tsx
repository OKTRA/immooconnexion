import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { usePaymentForm } from "./hooks/usePaymentForm"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentFormData } from "./types"
import { LeaseSelector } from "./components/LeaseSelector"
import { PaymentDetails } from "./components/PaymentDetails"
import { PeriodSelector } from "./components/PeriodSelector"
import { InitialPaymentsForm } from "./components/InitialPaymentsForm"
import { useLeaseSelection } from "./hooks/useLeaseSelection"
import { usePeriodManagement } from "./hooks/usePeriodManagement"
import { usePaymentSubmission } from "./hooks/usePaymentSubmission"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

interface PaymentFormProps {
  onSuccess: () => void
  tenantId: string
  leaseId: string
  initialPayment?: boolean
}

export function PaymentForm({ onSuccess, tenantId, leaseId, initialPayment = false }: PaymentFormProps) {
  const { data: lease, isLoading: isLoadingLease } = useQuery({
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
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!leaseId
  })

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      leaseId: leaseId || "",
      amount: 0,
      paymentMethod: "cash",
      paymentPeriods: []
    }
  })

  const {
    selectedLeaseId,
    setSelectedLeaseId,
    selectedLease,
    setSelectedLease
  } = useLeaseSelection([lease].filter(Boolean), setValue, leaseId)

  const {
    periodOptions,
    selectedPeriods,
    setSelectedPeriods,
    generatePeriodOptions,
    paymentDate,
    setPaymentDate
  } = usePeriodManagement()

  const { isSubmitting, handleSubmit: submitPayment } = usePaymentSubmission(onSuccess)

  if (isLoadingLease) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!lease) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Bail non trouvé
      </div>
    )
  }

  if (initialPayment) {
    return (
      <InitialPaymentsForm
        leaseId={lease.id}
        depositAmount={lease.deposit_amount}
        rentAmount={lease.rent_amount}
        onSuccess={onSuccess}
        agencyId={lease.agency_id}
      />
    )
  }

  const onSubmit = (data: PaymentFormData) => {
    if (selectedLease) {
      submitPayment(data, selectedLease, selectedPeriods, lease.agency_id)
    }
  }

  useEffect(() => {
    if (lease) {
      generatePeriodOptions(lease.start_date, lease.payment_frequency)
    }
  }, [lease])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PaymentDetails
        selectedLease={lease}
        selectedPeriods={selectedPeriods}
      />

      <PeriodSelector
        periodOptions={periodOptions}
        selectedPeriods={selectedPeriods}
        onPeriodsChange={setSelectedPeriods}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
      />

      <div className="space-y-2">
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
    </form>
  )
}
