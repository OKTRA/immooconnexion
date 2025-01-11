import { Button } from "@/components/ui/button"
import { LeaseFormData } from "./types"
import { PaymentFields } from "./form/PaymentFields"
import { DateFields } from "./form/DateFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { DurationType } from "./types"

interface LeaseFormFieldsProps {
  formData: LeaseFormData
  setFormData: (data: LeaseFormData) => void
  onSubmit: () => void
  isSubmitting: boolean
  onCancel: () => void
}

export function LeaseFormFields({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel
}: LeaseFormFieldsProps) {
  const handleDurationTypeChange = (value: DurationType) => {
    console.log('Duration type changed to:', value)
    setFormData({ 
      ...formData, 
      duration_type: value,
      ...(value !== 'fixed' && { end_date: '' })
    })
  }

  return (
    <div className="space-y-4">
      <DateFields formData={formData} setFormData={setFormData} />
      <PaymentFields formData={formData} setFormData={setFormData} />
      <FrequencyFields 
        formData={formData} 
        setFormData={setFormData}
        onDurationTypeChange={handleDurationTypeChange}
      />

      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  )
}