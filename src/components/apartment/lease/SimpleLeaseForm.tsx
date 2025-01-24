import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { TenantUnitFields } from "./form/TenantUnitFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { DateFields } from "./form/DateFields"
import { useSimpleLeaseForm } from "./hooks/useSimpleLeaseForm"
import { LeaseFormData } from "./types"

interface SimpleLeaseFormProps {
  onSuccess?: () => void
}

export function SimpleLeaseForm({ onSuccess }: SimpleLeaseFormProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    tenants,
    units,
    isLoadingTenants,
    isLoadingUnits,
    isSubmitting,
    createLease,
    generatePaymentPeriods,
    handleUnitChange
  } = useSimpleLeaseForm({ onSuccess })

  if (isLoadingTenants || isLoadingUnits) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const formData = watch()

  return (
    <form onSubmit={handleSubmit(data => createLease.mutateAsync(data))} className="space-y-6">
      <TenantUnitFields 
        tenants={tenants}
        units={units}
        formData={formData}
        onUnitChange={handleUnitChange}
        setValue={setValue}
      />

      <PaymentFields 
        formData={formData}
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
        selectedUnitId={formData.unit_id}
      />

      <FrequencyFields 
        formData={formData}
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
        onDurationTypeChange={(value) => {
          setValue("duration_type", value)
          if (value !== "fixed") {
            setValue("end_date", "")
          }
        }}
      />

      <DateFields 
        formData={formData}
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le bail
        </Button>
      </div>

      {createLease.data && (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            onClick={() => generatePaymentPeriods.mutate(createLease.data.id)}
            disabled={generatePaymentPeriods.isPending}
            variant="secondary"
          >
            {generatePaymentPeriods.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Générer les périodes de paiement
          </Button>
        </div>
      )}
    </form>
  )
}