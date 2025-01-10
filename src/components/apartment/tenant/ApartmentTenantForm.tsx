import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { ContactFields } from "./form/ContactFields"
import { ProfessionalFields } from "./form/ProfessionalFields"
import { EmergencyContactFields } from "./form/EmergencyContactFields"
import { UnitSelector } from "./form/UnitSelector"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { ApartmentTenant } from "@/types/apartment"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ApartmentTenantFormProps {
  apartmentId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: ApartmentTenant
}

export function ApartmentTenantForm({
  apartmentId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  initialData
}: ApartmentTenantFormProps) {
  const { toast } = useToast()
  const [selectedUnitId, setSelectedUnitId] = useState(initialData?.unit_id || "")
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    birth_date: initialData?.birth_date || "",
    photo_id_url: initialData?.photo_id_url || "",
    employer_name: initialData?.employer_name || "",
    employer_phone: initialData?.employer_phone || "",
    employer_address: initialData?.employer_address || "",
    emergency_contact_name: initialData?.emergency_contact_name || "",
    emergency_contact_phone: initialData?.emergency_contact_phone || "",
    emergency_contact_relationship: initialData?.emergency_contact_relationship || "",
    additional_notes: initialData?.additional_notes || "",
    bank_name: initialData?.bank_name || "",
    bank_account_number: initialData?.bank_account_number || "",
    agency_fees: initialData?.agency_fees || 0,
    profession: initialData?.profession || "",
  })

  const [leaseData, setLeaseData] = useState({
    rent_amount: "",
    deposit_amount: "",
    payment_frequency: "monthly",
    payment_type: "upfront",
    start_date: "",
    end_date: "",
    duration_type: "fixed",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUnitId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une unité",
        variant: "destructive",
      })
      return
    }

    if (!leaseData.rent_amount || !leaseData.deposit_amount || !leaseData.start_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires du bail",
        variant: "destructive",
      })
      return
    }

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

      const tenantData = {
        ...formData,
        unit_id: selectedUnitId,
        agency_id: profile.agency_id,
      }

      // Create or update tenant
      let tenantId = initialData?.id
      if (initialData?.id) {
        const { error } = await supabase
          .from("apartment_tenants")
          .update(tenantData)
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        const { data: newTenant, error } = await supabase
          .from("apartment_tenants")
          .insert([tenantData])
          .select()
          .single()

        if (error) throw error
        tenantId = newTenant.id

        // Create lease
        const { error: leaseError } = await supabase
          .from("apartment_leases")
          .insert([{
            tenant_id: tenantId,
            unit_id: selectedUnitId,
            rent_amount: parseInt(leaseData.rent_amount),
            deposit_amount: parseInt(leaseData.deposit_amount),
            payment_frequency: leaseData.payment_frequency,
            payment_type: leaseData.payment_type,
            start_date: leaseData.start_date,
            end_date: leaseData.duration_type === "fixed" ? leaseData.end_date : null,
            duration_type: leaseData.duration_type,
            status: "active",
            agency_id: profile.agency_id,
          }])

        if (leaseError) throw leaseError

        // Update unit status to occupied
        const { error: unitError } = await supabase
          .from("apartment_units")
          .update({ status: "occupied" })
          .eq("id", selectedUnitId)

        if (unitError) throw unitError
      }

      toast({
        title: "Succès",
        description: initialData 
          ? "Locataire modifié avec succès"
          : "Locataire et bail ajoutés avec succès",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <UnitSelector
          apartmentId={apartmentId}
          value={selectedUnitId}
          onChange={setSelectedUnitId}
        />
        <Separator className="my-4" />
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            <ContactFields formData={formData} setFormData={setFormData} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Informations professionnelles</h3>
            <ProfessionalFields formData={formData} setFormData={setFormData} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Contact d'urgence</h3>
            <EmergencyContactFields formData={formData} setFormData={setFormData} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Informations du bail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="rent_amount">Montant du loyer</Label>
                <Input
                  id="rent_amount"
                  type="number"
                  value={leaseData.rent_amount}
                  onChange={(e) => setLeaseData({ ...leaseData, rent_amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit_amount">Montant de la caution</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  value={leaseData.deposit_amount}
                  onChange={(e) => setLeaseData({ ...leaseData, deposit_amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
                <Select
                  value={leaseData.payment_frequency}
                  onValueChange={(value) => setLeaseData({ ...leaseData, payment_frequency: value })}
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
                <Label htmlFor="payment_type">Type de paiement</Label>
                <Select
                  value={leaseData.payment_type}
                  onValueChange={(value) => setLeaseData({ ...leaseData, payment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upfront">Paiement d'avance</SelectItem>
                    <SelectItem value="end_of_period">Fin de période</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_type">Type de durée</Label>
                <Select
                  value={leaseData.duration_type}
                  onValueChange={(value) => setLeaseData({ ...leaseData, duration_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Durée déterminée</SelectItem>
                    <SelectItem value="month_to_month">Mois par mois</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={leaseData.start_date}
                  onChange={(e) => setLeaseData({ ...leaseData, start_date: e.target.value })}
                  required
                />
              </div>

              {leaseData.duration_type === "fixed" && (
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={leaseData.end_date}
                    onChange={(e) => setLeaseData({ ...leaseData, end_date: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !selectedUnitId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : initialData ? (
            "Modifier"
          ) : (
            "Ajouter"
          )}
        </Button>
      </div>
    </form>
  )
}