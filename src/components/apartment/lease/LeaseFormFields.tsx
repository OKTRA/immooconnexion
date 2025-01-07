import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { LeaseFormData, PaymentFrequency, DurationType, LeaseStatus } from "./types"

interface LeaseFormFieldsProps {
  formData: LeaseFormData
  setFormData: (data: LeaseFormData) => void
}

export function LeaseFormFields({
  formData,
  setFormData,
}: LeaseFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rentAmount">Montant du loyer</Label>
          <Input
            id="rentAmount"
            type="number"
            value={formData.rentAmount}
            onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
            placeholder="Montant en FCFA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositAmount">Montant de la caution</Label>
          <Input
            id="depositAmount"
            type="number"
            value={formData.depositAmount}
            onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
            placeholder="Montant en FCFA"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentFrequency">Fréquence de paiement</Label>
          <Select 
            value={formData.paymentFrequency} 
            onValueChange={(value: PaymentFrequency) => setFormData({ ...formData, paymentFrequency: value })}
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
          <Label htmlFor="durationType">Type de durée</Label>
          <Select 
            value={formData.durationType} 
            onValueChange={(value: DurationType) => setFormData({ ...formData, durationType: value })}
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

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="depositReturned"
            checked={formData.depositReturned}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, depositReturned: checked as boolean })
            }
          />
          <Label htmlFor="depositReturned">Caution remboursée</Label>
        </div>

        {formData.depositReturned && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depositReturnDate">Date de remboursement</Label>
                <Input
                  id="depositReturnDate"
                  type="date"
                  value={formData.depositReturnDate}
                  onChange={(e) => setFormData({ ...formData, depositReturnDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositReturnAmount">Montant remboursé</Label>
                <Input
                  id="depositReturnAmount"
                  type="number"
                  value={formData.depositReturnAmount}
                  onChange={(e) => setFormData({ ...formData, depositReturnAmount: e.target.value })}
                  placeholder="Montant en FCFA"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositReturnNotes">Notes sur le remboursement</Label>
              <Textarea
                id="depositReturnNotes"
                value={formData.depositReturnNotes}
                onChange={(e) => setFormData({ ...formData, depositReturnNotes: e.target.value })}
                placeholder="Commentaires sur le remboursement de la caution"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}