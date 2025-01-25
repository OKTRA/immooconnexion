import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LeaseFormData, PaymentFrequency, DurationType, PaymentType } from "../types"

interface FrequencyFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
  onDurationTypeChange: (value: DurationType) => void;
}

export function FrequencyFields({ formData, setFormData, onDurationTypeChange }: FrequencyFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
        <Select
          value={formData.payment_frequency}
          onValueChange={(value: PaymentFrequency) => 
            setFormData({ ...formData, payment_frequency: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Quotidien</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
            <SelectItem value="monthly">Mensuel</SelectItem>
            <SelectItem value="quarterly">Trimestriel</SelectItem>
            <SelectItem value="biannual">Semestriel</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration_type">Type de durée</Label>
        <Select
          value={formData.duration_type}
          onValueChange={(value: DurationType) => {
            setFormData({ ...formData, duration_type: value });
            onDurationTypeChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Durée déterminée</SelectItem>
            <SelectItem value="month_to_month">Mois par mois</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_type">Type de paiement</Label>
        <Select
          value={formData.payment_type}
          onValueChange={(value: PaymentType) => 
            setFormData({ ...formData, payment_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upfront">Paiement d'avance</SelectItem>
            <SelectItem value="end_of_period">Fin de période</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}