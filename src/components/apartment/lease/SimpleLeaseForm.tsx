import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TenantSelect } from "./form/TenantSelect"
import { UnitSelect } from "./form/UnitSelect"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimpleLeaseFormProps {
  onSuccess?: () => void
  isSubmitting?: boolean
  setIsSubmitting?: (value: boolean) => void
  tenantId?: string
  unitId?: string
}

export function SimpleLeaseForm({
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  tenantId: initialTenantId,
  unitId: initialUnitId
}: SimpleLeaseFormProps) {
  const queryClient = useQueryClient()
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId || '')

  const { data: units = [] } = useQuery({
    queryKey: ['apartment-units'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data, error } = await supabase
        .from('apartment_units')
        .select(`
          id,
          unit_number,
          rent_amount,
          deposit_amount,
          apartment:apartments (
            id,
            name,
            address
          )
        `)
        .eq('status', 'available')

      if (error) throw error
      return data
    }
  })

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      tenant_id: initialTenantId || '',
      unit_id: initialUnitId || '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      rent_amount: 0,
      deposit_amount: 0,
      payment_frequency: 'monthly' as const,
      duration_type: 'month_to_month' as const,
      payment_type: 'upfront' as const
    }
  })

  const createLease = useMutation({
    mutationFn: async (formData: any) => {
      // Validate required dates
      if (!formData.start_date) {
        throw new Error("La date de début est requise")
      }

      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      // Utiliser la fonction RPC create_lease_with_periods
      const { data: lease, error: leaseError } = await supabase.rpc(
        'create_lease_with_periods',
        {
          p_tenant_id: formData.tenant_id,
          p_unit_id: formData.unit_id,
          p_start_date: formData.start_date,
          p_end_date: formData.end_date || null,
          p_rent_amount: formData.rent_amount,
          p_deposit_amount: formData.deposit_amount,
          p_payment_frequency: formData.payment_frequency,
          p_duration_type: formData.duration_type,
          p_payment_type: formData.payment_type,
          p_agency_id: userProfile.agency_id
        }
      )

      if (leaseError) throw leaseError

      return lease
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès",
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Error creating lease:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du bail",
        variant: "destructive",
      })
    }
  })

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find(unit => unit.id === unitId)
    if (selectedUnit) {
      setValue('unit_id', unitId)
      setValue('rent_amount', selectedUnit.rent_amount)
      setValue('deposit_amount', selectedUnit.deposit_amount || 0)
      setSelectedUnitId(unitId)
    }
  }

  return (
    <form onSubmit={handleSubmit((data) => createLease.mutate(data))} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Locataire</Label>
          <TenantSelect
            value={watch('tenant_id')}
            onChange={(value) => setValue('tenant_id', value)}
          />
        </div>

        <div>
          <Label>Unité</Label>
          <UnitSelect
            value={selectedUnitId}
            onChange={handleUnitChange}
            units={units}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date de début</Label>
            <Input 
              type="date" 
              {...register('start_date', { required: "La date de début est requise" })} 
            />
            {errors.start_date && (
              <p className="text-sm text-red-500 mt-1">{errors.start_date.message}</p>
            )}
          </div>
          <div>
            <Label>Date de fin (optionnel)</Label>
            <Input type="date" {...register('end_date')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Loyer</Label>
            <Input type="number" {...register('rent_amount')} />
          </div>
          <div>
            <Label>Caution</Label>
            <Input type="number" {...register('deposit_amount')} />
          </div>
        </div>

        <div>
          <Label>Fréquence de paiement</Label>
          <Select
            value={watch('payment_frequency')}
            onValueChange={(value) => setValue('payment_frequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Quotidien</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="monthly">Mensuel</SelectItem>
              <SelectItem value="quarterly">Trimestriel</SelectItem>
              <SelectItem value="biannual">Semestriel</SelectItem>
              <SelectItem value="yearly">Annuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type de durée</Label>
          <Select
            value={watch('duration_type')}
            onValueChange={(value) => setValue('duration_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Durée fixe</SelectItem>
              <SelectItem value="month_to_month">Mois par mois</SelectItem>
              <SelectItem value="yearly">Annuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type de paiement</Label>
          <Select
            value={watch('payment_type')}
            onValueChange={(value) => setValue('payment_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upfront">Début de période</SelectItem>
              <SelectItem value="end_of_period">Fin de période</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={createLease.isPending}
          className="w-full sm:w-auto"
        >
          {createLease.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le bail
        </Button>
      </div>
    </form>
  )
}
