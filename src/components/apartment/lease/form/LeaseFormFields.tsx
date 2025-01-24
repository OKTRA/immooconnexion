import { Button } from "@/components/ui/button"
import { DateFields } from "./DateFields"
import { PaymentFields } from "./PaymentFields"
import { FrequencyFields } from "./FrequencyFields"
import { LeaseFormData, DurationType, LeaseFormFieldsProps } from "../types"

export function LeaseFormFields({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel,
  disabled = false
}: LeaseFormFieldsProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DateFields 
        formData={formData} 
        setFormData={setFormData}
      />
      
      <PaymentFields 
        formData={formData} 
        setFormData={setFormData}
        selectedUnitId={formData.unit_id}
      />
      
      <FrequencyFields 
        formData={formData} 
        setFormData={setFormData}
        onDurationTypeChange={(value: DurationType) => {
          setFormData({ 
            ...formData, 
            duration_type: value,
            end_date: value === 'fixed' ? formData.end_date : undefined 
          })
        }}
      />
      
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || disabled || !formData.unit_id}
        >
          {isSubmitting ? "Chargement..." : "Créer le bail"}
        </Button>
      </div>
    </form>
  )
}