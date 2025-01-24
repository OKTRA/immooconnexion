import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FrequencyFieldsProps {
  formData: any
  setFormData: (data: any) => void
  onDurationTypeChange: (value: string) => void
}

export function FrequencyFields({ 
  formData, 
  setFormData,
  onDurationTypeChange
}: FrequencyFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
        <Select
          value={formData.payment_frequency}
          onValueChange={(value) => setFormData({ ...formData, payment_frequency: value })}
        >
          <SelectTrigger id="payment_frequency">
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
        <Label htmlFor="duration_type">Type de durée</Label>
        <Select
          value={formData.duration_type}
          onValueChange={onDurationTypeChange}
        >
          <SelectTrigger id="duration_type">
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