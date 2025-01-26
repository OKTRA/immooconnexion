import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DurationType, LeaseFormData } from "../types"

interface FrequencyFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
  onDurationTypeChange?: (value: DurationType) => void;
}

export function FrequencyFields({
  formData,
  setFormData,
  onDurationTypeChange,
}: FrequencyFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Fréquence de paiement</Label>
        <Select
          value={formData.payment_frequency}
          onValueChange={(value: any) =>
            setFormData({ ...formData, payment_frequency: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner la fréquence" />
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

      <div>
        <Label>Type de durée</Label>
        <Select
          value={formData.duration_type}
          onValueChange={(value: DurationType) => {
            setFormData({ ...formData, duration_type: value });
            if (onDurationTypeChange) {
              onDurationTypeChange(value);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type de durée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Durée fixe</SelectItem>
            <SelectItem value="month_to_month">Mois par mois</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Type de paiement</Label>
        <Select
          value={formData.payment_type}
          onValueChange={(value: any) =>
            setFormData({ ...formData, payment_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type de paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upfront">Début de période</SelectItem>
            <SelectItem value="end_of_period">Fin de période</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}