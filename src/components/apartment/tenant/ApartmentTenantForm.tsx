import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { ApartmentUnit } from "@/types/apartment"

interface ApartmentTenantFormProps {
  tenant?: any
  apartmentId: string
  availableUnits: ApartmentUnit[]
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export function ApartmentTenantForm({
  tenant,
  apartmentId,
  availableUnits,
  onSuccess,
  isSubmitting,
  setIsSubmitting
}: ApartmentTenantFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    first_name: tenant?.first_name || "",
    last_name: tenant?.last_name || "",
    email: tenant?.email || "",
    phone_number: tenant?.phone_number || "",
    birth_date: tenant?.birth_date || "",
    unit_id: tenant?.unit_id || "",
    agency_fees: tenant?.agency_fees?.toString() || "",
    deposit_amount: "",
    rent_amount: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      // Create or update tenant
      const tenantData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        birth_date: formData.birth_date,
        unit_id: formData.unit_id,
        agency_id: userProfile.agency_id
      }

      let tenantResult
      if (tenant) {
        const { data, error } = await supabase
          .from("apartment_tenants")
          .update(tenantData)
          .eq("id", tenant.id)
          .select()
          .single()

        if (error) throw error
        tenantResult = data
      } else {
        const { data, error } = await supabase
          .from("apartment_tenants")
          .insert(tenantData)
          .select()
          .single()

        if (error) throw error
        tenantResult = data

        // Create lease
        const { error: leaseError } = await supabase
          .from("apartment_leases")
          .insert({
            tenant_id: tenantResult.id,
            unit_id: formData.unit_id,
            rent_amount: parseInt(formData.rent_amount),
            deposit_amount: parseInt(formData.deposit_amount),
            agency_id: userProfile.agency_id,
            start_date: new Date().toISOString(),
            payment_frequency: "monthly",
            duration_type: "month_to_month",
            status: "active"
          })

        if (leaseError) throw leaseError

        // Update unit status
        const { error: unitError } = await supabase
          .from("apartment_units")
          .update({ status: "occupied" })
          .eq("id", formData.unit_id)

        if (unitError) throw unitError
      }

      toast({
        title: tenant ? "Locataire modifié" : "Locataire ajouté",
        description: "L'opération a été effectuée avec succès.",
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
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
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Date de naissance</Label>
        <Input
          id="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unité</Label>
        <Select
          value={formData.unit_id}
          onValueChange={(value) => setFormData({ ...formData, unit_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une unité" />
          </SelectTrigger>
          <SelectContent>
            {availableUnits
              .filter((unit) => unit.status === "available" || unit.id === tenant?.unit_id)
              .map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  Unité {unit.unit_number}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {!tenant && (
        <>
          <div className="space-y-2">
            <Label htmlFor="rent_amount">Montant du loyer</Label>
            <Input
              id="rent_amount"
              type="number"
              value={formData.rent_amount}
              onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit_amount">Montant de la caution</Label>
            <Input
              id="deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agency_fees">Frais d'agence</Label>
            <Input
              id="agency_fees"
              type="number"
              value={formData.agency_fees}
              onChange={(e) => setFormData({ ...formData, agency_fees: e.target.value })}
              required
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsSubmitting(false)}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : tenant ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}