import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { PaymentPeriodSelector } from "./PaymentPeriodSelector"
import { PaymentFormFieldsProps } from "../types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function PaymentFormFields({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel,
  lease
}: PaymentFormFieldsProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Informations du bail</Label>
        <div className="text-sm space-y-1">
          <p>Locataire: {lease.tenant.first_name} {lease.tenant.last_name}</p>
          <p>Montant du loyer: {lease.rent_amount.toLocaleString()} FCFA</p>
          <p>Fréquence: {lease.payment_frequency}</p>
          <p>Date de début: {format(new Date(lease.start_date), 'PP', { locale: fr })}</p>
        </div>
      </div>

      <PaymentPeriodSelector
        leaseId={lease.id}
        onPeriodsChange={(periods) => {
          setFormData({
            ...formData,
            paymentPeriods: periods
          })
        }}
      />

      <div className="space-y-4">
        <div>
          <Label>Mode de paiement</Label>
          <PaymentMethodSelect
            value={formData.paymentMethod}
            onChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          />
        </div>

        <div>
          <Label>Date de paiement</Label>
          <Input
            type="date"
            value={formData.paymentDate}
            onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1"
          />
        </div>

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
            disabled={isSubmitting || formData.paymentPeriods.length === 0}
          >
            {isSubmitting ? "Chargement..." : "Enregistrer le paiement"}
          </Button>
        </div>
      </div>
    </form>
  )
}