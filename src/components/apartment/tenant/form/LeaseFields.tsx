import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentFrequency, DurationType } from "../../lease/types"

interface LeaseFieldsProps {
  formData: {
    start_date: string;
    end_date?: string;
    payment_frequency: PaymentFrequency;
    duration_type: DurationType;
  };
  setFormData: (data: any) => void;
}

export function LeaseFields({ formData, setFormData }: LeaseFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
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
          <Label htmlFor="duration_type">Type de durée</Label>
          <Select
            value={formData.duration_type}
            onValueChange={(value: DurationType) => 
              setFormData({ ...formData, duration_type: value })
            }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        {formData.duration_type === "fixed" && (
          <div className="space-y-2">
            <Label htmlFor="end_date">Date de fin</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
          </div>
        )}
      </div>
    </div>
  )
}