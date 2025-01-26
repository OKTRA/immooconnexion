import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { TenantSelect } from "./form/TenantSelect"
import { UnitSelect } from "./form/UnitSelect"
import { LeaseBasicFields } from "./form/LeaseBasicFields"
import { LeaseFrequencyFields } from "./form/LeaseFrequencyFields"
import { useSimpleLease } from "./hooks/useSimpleLease"

interface SimpleLeaseFormProps {
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
  tenantId?: string;
  unitId?: string;
}

export function SimpleLeaseForm({
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  tenantId: initialTenantId,
  unitId: initialUnitId
}: SimpleLeaseFormProps) {
  const { formData, setFormData, createLease } = useSimpleLease(onSuccess)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createLease.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <TenantSelect
            value={formData.tenant_id}
            onChange={(value) => setFormData({ ...formData, tenant_id: value })}
          />
        </div>

        <div>
          <UnitSelect
            value={formData.unit_id}
            onChange={(unitId) => {
              const selectedUnit = units.find(unit => unit.id === unitId)
              if (selectedUnit) {
                setFormData({
                  ...formData,
                  unit_id: unitId,
                  rent_amount: selectedUnit.rent_amount,
                  deposit_amount: selectedUnit.deposit_amount || 0
                })
              }
            }}
            units={units}
          />
        </div>

        <LeaseBasicFields 
          formData={formData}
          setFormData={setFormData}
        />

        <LeaseFrequencyFields 
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={createLease.isPending}
          className="w-full sm:w-auto"
        >
          {createLease.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le bail
        </Button>
      </div>
    </form>
  )
}