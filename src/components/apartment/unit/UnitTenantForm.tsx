import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get agency_id from user profile
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
          status: "active",
          payment_frequency: "monthly",
          duration_type: "fixed",
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