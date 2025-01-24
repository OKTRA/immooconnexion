import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApartmentLease } from "@/types/apartment"
import { DateFields } from "./form/DateFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { TenantUnitFields } from "./form/TenantUnitFields"
import { useLeaseForm } from "./hooks/useLeaseForm"
import { LeaseFormData } from "./types"

interface LeaseFormProps {
  initialData?: ApartmentLease
  onSuccess?: () => void
}

export function LeaseForm({ initialData, onSuccess }: LeaseFormProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formData,
    selectedUnitId,
    tenants,
    units,
    isLoadingTenants,
    isLoadingUnits,
    isSubmitting,
    createLease,
  } = useLeaseForm(initialData, onSuccess)

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find(unit => unit.id === unitId)
    if (selectedUnit) {
      setValue("unit_id", unitId)
      setValue("rent_amount", selectedUnit.rent_amount)
      setValue("deposit_amount", selectedUnit.deposit_amount || selectedUnit.rent_amount)
    }
  }

  const onSubmit = async (data: LeaseFormData) => {
    await createLease.mutateAsync(data)
  }

  if (isLoadingTenants || isLoadingUnits) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TenantUnitFields 
        tenants={tenants}
        units={units}
        formData={formData}
        onUnitChange={handleUnitChange}
        setValue={setValue}
      />
      
      <DateFields 
        formData={formData} 
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }} 
      />
      
      <PaymentFields 
        formData={formData} 
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
        selectedUnitId={selectedUnitId}
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

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  )
}