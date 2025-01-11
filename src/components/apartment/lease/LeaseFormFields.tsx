import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LeaseFormData, PaymentFrequency, DurationType, LeaseStatus, PaymentType } from "./types"

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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rent_amount">Montant du loyer</Label>
          <Input
            id="rent_amount"
            type="number"
            value={formData.rent_amount}
            onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
            placeholder="Montant en FCFA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deposit_amount">Montant de la caution</Label>
          <Input
            id="deposit_amount"
            type="number"
            value={formData.deposit_amount}
            onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
            placeholder="Montant en FCFA"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
          <Select 
            value={formData.payment_frequency} 
            onValueChange={(value: PaymentFrequency) => setFormData({ ...formData, payment_frequency: value })}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payment_type">Type de paiement</Label>
          <Select
            value={formData.payment_type}
            onValueChange={(value: PaymentType) => setFormData({ ...formData, payment_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upfront">Paiement d'avance</SelectItem>
              <SelectItem value="end_of_period">Paiement en fin de période</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: LeaseStatus) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
              <SelectItem value="terminated">Résilié</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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