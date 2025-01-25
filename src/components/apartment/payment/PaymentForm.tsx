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

interface PaymentFormProps {
  onSuccess: () => void
  tenantId: string
  leaseId?: string
}

export function PaymentForm({ onSuccess, tenantId, leaseId }: PaymentFormProps) {
  const {
    leases,
    isLoadingLeases,
    agencyId,
    refetchLeases
  } = usePaymentForm(onSuccess)

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
  } = useLeaseSelection(leases || [], setValue, leaseId)

  const {
    periodOptions,
    selectedPeriods,
    setSelectedPeriods,
    generatePeriodOptions
  } = usePeriodManagement()

  const { isSubmitting, handleSubmit: submitPayment } = usePaymentSubmission(onSuccess)

  const handleInitialPaymentsSuccess = async () => {
    await refetchLeases()
    const updatedLease = leases?.find(l => l.id === selectedLeaseId)
    if (updatedLease) {
      setSelectedLease(updatedLease)
    }
  }

  const onSubmit = (data: PaymentFormData) => {
    if (selectedLease) {
      submitPayment(data, selectedLease, selectedPeriods, agencyId)
    }
  }

  const filteredLeases = leases?.filter(lease => lease.tenant_id === tenantId) || []

  if (isLoadingLeases) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <LeaseSelector
        leases={filteredLeases}
        selectedLeaseId={selectedLeaseId}
        onLeaseSelect={setSelectedLeaseId}
        isLoading={isLoadingLeases}
      />

      {selectedLease && !selectedLease.initial_payments_completed && (
        <InitialPaymentsForm
          leaseId={selectedLease.id}
          depositAmount={selectedLease.deposit_amount}
          rentAmount={selectedLease.rent_amount}
          onSuccess={handleInitialPaymentsSuccess}
          agencyId={agencyId}
        />
      )}

      {selectedLease && selectedLease.initial_payments_completed && (
        <>
          <PaymentDetails
            selectedLease={selectedLease}
            selectedPeriods={selectedPeriods}
          />

          <PeriodSelector
            periodOptions={periodOptions}
            selectedPeriods={selectedPeriods}
            onPeriodsChange={setSelectedPeriods}
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
        </>
      )}
    </form>
  )
}