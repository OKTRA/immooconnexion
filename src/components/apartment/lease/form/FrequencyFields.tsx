import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeaseFormData, PaymentFrequency, DurationType } from "../types"

interface FrequencyFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
  onDurationTypeChange?: (value: DurationType) => void;
}

export function FrequencyFields({ 
  formData, 
  setFormData,
  onDurationTypeChange 
}: FrequencyFieldsProps) {
  const handleDurationTypeChange = (value: DurationType) => {
    onDurationTypeChange?.(value);
    setFormData({ 
      ...formData, 
      duration_type: value,
      ...(value !== 'fixed' && { end_date: '' })
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="payment_frequency" className="text-sm font-medium">
          Fréquence de paiement
        </label>
        <Select
          value={formData.payment_frequency}
          onValueChange={(value: PaymentFrequency) => 
            setFormData({ ...formData, payment_frequency: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une fréquence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Quotidien</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
            <SelectItem value="monthly">Mensuel</SelectItem>
            <SelectItem value="quarterly">Trimestriel</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="duration_type" className="text-sm font-medium">
          Type de durée
        </label>
        <Select
          value={formData.duration_type}
          onValueChange={handleDurationTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Durée déterminée</SelectItem>
            <SelectItem value="month_to_month">Mois par mois</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}