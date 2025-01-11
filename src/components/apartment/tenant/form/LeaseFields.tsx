import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentFrequency, DurationType, LeaseStatus } from "../../../apartment/lease/types"

interface LeaseFieldsProps {
  formData: {
    rentAmount: string
    depositAmount: string
    agencyFees: string
    startDate: string
    endDate: string
    paymentFrequency: PaymentFrequency
    durationType: DurationType
    status: LeaseStatus
  }
  setFormData: (data: any) => void
}

export function LeaseFields({ formData, setFormData }: LeaseFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rentAmount">Montant du loyer</Label>
          <Input
            id="rentAmount"
            type="number"
            value={formData.rentAmount}
            onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agencyFees">Frais d'agence</Label>
          <Input
            id="agencyFees"
            type="number"
            value={formData.agencyFees}
            onChange={(e) => setFormData({ ...formData, agencyFees: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="depositAmount">Caution</Label>
          <Input
            id="depositAmount"
            type="number"
            value={formData.depositAmount}
            onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentFrequency">Fréquence de paiement</Label>
          <Select
            value={formData.paymentFrequency}
            onValueChange={(value: PaymentFrequency) => 
              setFormData({ ...formData, paymentFrequency: value })
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationType">Type de durée</Label>
          <Select
            value={formData.durationType}
            onValueChange={(value: DurationType) => 
              setFormData({ ...formData, durationType: value })
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        {formData.durationType === "fixed" && (
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        )}
      </div>
    </div>
  )
}