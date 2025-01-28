import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { TenantSelect } from "./form/TenantSelect"
import { UnitSelect } from "./form/UnitSelect"
import { LeaseBasicFields } from "./form/LeaseBasicFields"
import { LeaseFrequencyFields } from "./form/LeaseFrequencyFields"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface SimpleLeaseFormProps {
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
  tenantId?: string;
  unitId?: string;
}

export function SimpleLeaseForm({
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  tenantId: initialTenantId,
  unitId: initialUnitId
}: SimpleLeaseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    tenant_id: "",
    unit_id: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "month_to_month",
    payment_type: "upfront",
    status: "active"
  })

  const { data: availableUnits = [] } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Agency ID not found")

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          rent_amount,
          deposit_amount,
          apartment:apartments (
            name,
            address
          )
        `)
        .eq("status", "available")

      if (error) throw error
      console.log("Available units:", data)
      return data || []
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Récupérer l'agency_id
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Agency ID not found")

      // Vérifier si l'association tenant_units existe déjà
      const { data: existingTenantUnit } = await supabase
        .from('tenant_units')
        .select('*')
        .eq('tenant_id', formData.tenant_id)
        .eq('unit_id', formData.unit_id)
        .single()

      // Si elle existe, la mettre à jour
      if (existingTenantUnit) {
        const { error: updateError } = await supabase
          .from('tenant_units')
          .update({ status: 'active' })
          .eq('tenant_id', formData.tenant_id)
          .eq('unit_id', formData.unit_id)

        if (updateError) throw updateError
      } else {
        // Sinon, créer une nouvelle association
        const { error: tenantUnitError } = await supabase
          .from('tenant_units')
          .insert({
            tenant_id: formData.tenant_id,
            unit_id: formData.unit_id,
            status: 'active'
          })

        if (tenantUnitError) throw tenantUnitError
      }

      // Insertion du bail
      const { data: lease, error } = await supabase
        .from('apartment_leases')
        .insert({
          tenant_id: formData.tenant_id,
          unit_id: formData.unit_id,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          rent_amount: formData.rent_amount,
          deposit_amount: formData.deposit_amount,
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          payment_type: formData.payment_type,
          status: 'active',
          agency_id: userProfile.agency_id
        })
        .select()
        .single()

      if (error) throw error

      // Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from('apartment_units')
        .update({ status: 'occupied' })
        .eq('id', formData.unit_id)

      if (unitError) throw unitError

      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès",
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error creating lease:', error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du bail",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <TenantSelect
            value={formData.tenant_id}
            onChange={(value) => setFormData({ ...formData, tenant_id: value })}
          />
        </div>

        <div>
          <UnitSelect
            value={formData.unit_id}
            onChange={(unitId) => {
              const selectedUnit = availableUnits.find(unit => unit.id === unitId)
              console.log("Selected unit:", selectedUnit)
              if (selectedUnit) {
                setFormData({
                  ...formData,
                  unit_id: unitId,
                  rent_amount: selectedUnit.rent_amount,
                  deposit_amount: selectedUnit.deposit_amount || 0
                })
              }
            }}
            units={availableUnits}
          />
        </div>

        <LeaseBasicFields 
          formData={formData}
          setFormData={setFormData}
        />

        <LeaseFrequencyFields 
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le bail
        </Button>
      </div>
    </form>
  )
}