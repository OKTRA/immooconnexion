import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface UnitTenantFormProps {
  unitId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export function UnitTenantForm({
  unitId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: UnitTenantFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    rentAmount: "",
    depositAmount: "",
    startDate: "",
    endDate: "",
    paymentFrequency: "monthly" as "daily" | "weekly" | "monthly" | "quarterly" | "yearly",
    durationType: "fixed" as "fixed" | "month_to_month" | "yearly",
    status: "active" as "active" | "expired" | "terminated",
    depositReturned: false,
    depositReturnDate: "",
    depositReturnAmount: "",
    depositReturnNotes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Agency ID not found")

      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          agency_id: profile.agency_id,
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // Create lease
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenant.id,
          unit_id: unitId,
          rent_amount: parseInt(formData.rentAmount),
          deposit_amount: parseInt(formData.depositAmount),
          start_date: formData.startDate,
          end_date: formData.endDate,
          payment_frequency: formData.paymentFrequency,
          duration_type: formData.durationType,
          status: formData.status,
          deposit_returned: formData.depositReturned,
          deposit_return_date: formData.depositReturnDate || null,
          deposit_return_amount: formData.depositReturnAmount ? parseInt(formData.depositReturnAmount) : null,
          deposit_return_notes: formData.depositReturnNotes || null,
          agency_id: profile.agency_id,
        })

      if (leaseError) throw leaseError

      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Téléphone</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rentAmount">Loyer mensuel (FCFA)</Label>
          <Input
            id="rentAmount"
            type="number"
            value={formData.rentAmount}
            onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositAmount">Caution (FCFA)</Label>
          <Input
            id="depositAmount"
            type="number"
            value={formData.depositAmount}
            onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
            required
          />
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentFrequency">Fréquence de paiement</Label>
          <Select 
            value={formData.paymentFrequency}
            onValueChange={(value: "daily" | "weekly" | "monthly" | "quarterly" | "yearly") => 
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
        <div className="space-y-2">
          <Label htmlFor="durationType">Type de durée</Label>
          <Select 
            value={formData.durationType}
            onValueChange={(value: "fixed" | "month_to_month" | "yearly") => 
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

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status}
          onValueChange={(value: "active" | "expired" | "terminated") => 
            setFormData({ ...formData, status: value })
          }
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

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsSubmitting(false)} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}