import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { TenantUnitFields } from "./form/TenantUnitFields"
import { LeaseFormData } from "./types"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { DateFields } from "./form/DateFields"

interface SimpleLeaseFormProps {
  onSuccess?: () => void
}

export function SimpleLeaseForm({ onSuccess }: SimpleLeaseFormProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<LeaseFormData>({
    defaultValues: {
      tenant_id: "",
      unit_id: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
      rent_amount: 0,
      deposit_amount: 0,
      payment_frequency: "monthly",
      duration_type: "month_to_month",
      payment_type: "upfront",
      status: "pending" // Changé de 'active' à 'pending'
    }
  })

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("agency_id", userProfile.agency_id)
        .eq("status", "active")

      if (error) throw error
      return data
    }
  })

  const { data: units = [], isLoading: isLoadingUnits } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          *,
          apartment:apartments(
            id,
            name
          )
        `)
        .eq("status", "available")

      if (error) throw error
      return data
    }
  })

  const createLease = useMutation({
    mutationFn: async (data: LeaseFormData) => {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      // Vérifier si une association tenant_units existe déjà
      const { data: existingTenantUnit } = await supabase
        .from('tenant_units')
        .select('*')
        .eq('tenant_id', data.tenant_id)
        .eq('unit_id', data.unit_id)
        .single()

      // Si l'association existe, la mettre à jour
      if (existingTenantUnit) {
        const { error: updateError } = await supabase
          .from('tenant_units')
          .update({ status: 'active' })
          .eq('tenant_id', data.tenant_id)
          .eq('unit_id', data.unit_id)

        if (updateError) throw updateError
      } else {
        // Sinon, créer une nouvelle association
        const { error: tenantUnitError } = await supabase
          .from('tenant_units')
          .insert({
            tenant_id: data.tenant_id,
            unit_id: data.unit_id,
            status: 'active'
          })

        if (tenantUnitError) throw tenantUnitError
      }

      // Créer le bail avec le statut 'pending'
      const { data: lease, error: leaseError } = await supabase
        .from('apartment_leases')
        .insert({
          tenant_id: data.tenant_id,
          unit_id: data.unit_id,
          start_date: data.start_date,
          end_date: data.end_date || null,
          rent_amount: data.rent_amount,
          deposit_amount: data.deposit_amount,
          payment_frequency: data.payment_frequency,
          duration_type: data.duration_type,
          payment_type: data.payment_type,
          agency_id: userProfile.agency_id,
          status: 'pending' // Changé de 'active' à 'pending'
        })
        .select()
        .single()

      if (leaseError) throw leaseError

      // Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from('apartment_units')
        .update({ status: 'occupied' })
        .eq('id', data.unit_id)

      if (unitError) throw unitError

      return lease
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      queryClient.invalidateQueries({ queryKey: ["available-units"] })
      toast({
        title: "Bail créé",
        description: "Le bail a été créé avec succès. N'oubliez pas de générer les périodes de paiement.",
      })
      onSuccess?.()
    },
    onError: (error: any) => {
      console.error("Error creating lease:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du bail",
        variant: "destructive",
      })
    }
  })

  const generatePaymentPeriods = useMutation({
    mutationFn: async (leaseId: string) => {
      const formData = watch()
      const { data, error } = await supabase.rpc('generate_lease_payment_periods', {
        p_lease_id: leaseId,
        p_start_date: formData.start_date,
        p_end_date: formData.end_date || null,
        p_rent_amount: formData.rent_amount,
        p_payment_frequency: formData.payment_frequency
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Périodes générées",
        description: "Les périodes de paiement ont été générées avec succès",
      })
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
    },
    onError: (error) => {
      console.error("Error generating payment periods:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des périodes de paiement",
        variant: "destructive",
      })
    }
  })

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find(unit => unit.id === unitId)
    if (selectedUnit) {
      setValue("unit_id", unitId)
      setValue("rent_amount", selectedUnit.rent_amount)
      setValue("deposit_amount", selectedUnit.deposit_amount || selectedUnit.rent_amount)
    }
  }

  if (isLoadingTenants || isLoadingUnits) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const formData = watch()

  return (
    <form onSubmit={handleSubmit(data => createLease.mutateAsync(data))} className="space-y-6">
      <TenantUnitFields 
        tenants={tenants}
        units={units}
        formData={formData}
        onUnitChange={handleUnitChange}
        setValue={setValue}
      />

      <PaymentFields 
        formData={formData}
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
        selectedUnitId={formData.unit_id}
      />

      <FrequencyFields 
        formData={formData}
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
        onDurationTypeChange={(value) => {
          setValue("duration_type", value)
          if (value !== "fixed") {
            setValue("end_date", "")
          }
        }}
      />

      <DateFields 
        formData={formData}
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le bail
        </Button>
      </div>

      {createLease.data && (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            onClick={() => generatePaymentPeriods.mutate(createLease.data.id)}
            disabled={generatePaymentPeriods.isPending}
            variant="secondary"
          >
            {generatePaymentPeriods.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Générer les périodes de paiement
          </Button>
        </div>
      )}
    </form>
  )
}
