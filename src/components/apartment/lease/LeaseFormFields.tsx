import { Button } from "@/components/ui/button"
import { DateFields } from "./form/DateFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { UnitSelector } from "./form/UnitSelector"

interface LeaseFormFieldsProps {
  formData: {
    unit_id: string;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    deposit_amount: number;
    payment_frequency: string;
    duration_type: string;
    payment_type: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

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

  const isFormValid = () => {
    // Ajout de logs pour déboguer
    console.log("Form validation check:", {
      unit_id: formData.unit_id,
      start_date: formData.start_date,
      rent_amount: formData.rent_amount,
      deposit_amount: formData.deposit_amount,
      payment_frequency: formData.payment_frequency,
      duration_type: formData.duration_type,
      payment_type: formData.payment_type,
      end_date: formData.end_date,
    });

    const valid = !!(
      formData.unit_id &&
      formData.start_date &&
      formData.rent_amount &&
      formData.deposit_amount >= 0 &&
      formData.payment_frequency &&
      formData.duration_type &&
      formData.payment_type &&
      (formData.duration_type !== 'fixed' || formData.end_date)
    );

    console.log("Form is valid:", valid);
    return valid;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!formData.unit_id && (
        <UnitSelector
          value={formData.unit_id}
          onChange={(value) => setFormData({ ...formData, unit_id: value })}
        />
      )}
      
      <DateFields formData={formData} setFormData={setFormData} />
      <PaymentFields formData={formData} setFormData={setFormData} />
      <FrequencyFields 
        formData={formData} 
        setFormData={setFormData}
        onDurationTypeChange={(value) => {
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
          disabled={disabled}
        >
          {isSubmitting ? "Chargement..." : "Créer le bail"}
        </Button>
      </div>
    </form>
  )
}