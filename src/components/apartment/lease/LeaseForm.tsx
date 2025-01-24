import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { ApartmentLease } from "@/types/apartment"
import { DateFields } from "./form/DateFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { TenantUnitFields } from "./form/TenantUnitFields"
import { LeaseFormData } from "./types"

interface LeaseFormProps {
  initialData?: ApartmentLease
  onSuccess?: () => void
}

export function LeaseForm({ initialData, onSuccess }: LeaseFormProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<LeaseFormData>({
    defaultValues: initialData || {
      tenant_id: "",
      unit_id: "",
      start_date: "",
      end_date: "",
      rent_amount: 0,
      deposit_amount: 0,
      payment_frequency: "monthly",
      duration_type: "month_to_month",
      payment_type: "upfront",
      status: "active"
    }
  })

  const selectedUnitId = watch("unit_id")
  const formData = watch()

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
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

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find(unit => unit.id === unitId)
    if (selectedUnit) {
      setValue("unit_id", unitId)
      setValue("rent_amount", selectedUnit.rent_amount)
      setValue("deposit_amount", selectedUnit.deposit_amount || selectedUnit.rent_amount)
    }
  }

  const generatePaymentPeriods = (leaseData: LeaseFormData) => {
    const periods = []
    let periodInterval: number
    
    switch (leaseData.payment_frequency) {
      case 'daily': periodInterval = 1; break;
      case 'weekly': periodInterval = 7; break;
      case 'monthly': periodInterval = 30; break;
      case 'quarterly': periodInterval = 90; break;
      case 'yearly': periodInterval = 365; break;
      default: periodInterval = 30;
    }

    let currentStart = new Date(leaseData.start_date)
    const endDate = leaseData.end_date ? new Date(leaseData.end_date) : new Date(currentStart.getTime() + 365 * 24 * 60 * 60 * 1000)
    
    while (currentStart < endDate) {
      const periodEnd = new Date(currentStart.getTime() + (periodInterval * 24 * 60 * 60 * 1000))
      
      periods.push({
        start_date: currentStart.toISOString().split('T')[0],
        end_date: periodEnd.toISOString().split('T')[0],
        amount: leaseData.rent_amount,
        status: 'pending'
      })
      
      currentStart = new Date(periodEnd.getTime() + 24 * 60 * 60 * 1000)
    }

    return periods
  }

  const createLease = useMutation({
    mutationFn: async (data: LeaseFormData) => {
      if (!data.start_date) {
        throw new Error("La date de début est requise")
      }

      const leaseData = {
        ...data,
        end_date: data.duration_type === "fixed" ? data.end_date : null,
        status: "active",
        agency_id: (await supabase.auth.getUser()).data.user?.id
      }

      // Insérer le bail
      const { data: lease, error: leaseError } = await supabase
        .from("apartment_leases")
        .insert([leaseData])
        .select()
        .single()

      if (leaseError) throw leaseError

      // Générer et insérer les périodes de paiement
      const paymentPeriods = generatePaymentPeriods(data).map(period => ({
        ...period,
        lease_id: lease.id
      }))

      const { error: periodsError } = await supabase
        .from("apartment_payment_periods")
        .insert(paymentPeriods)

      if (periodsError) throw periodsError

      // Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", data.unit_id)

      if (unitError) throw unitError

      return lease
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      queryClient.invalidateQueries({ queryKey: ["available-units"] })
      toast({
        title: "Bail créé",
        description: "Le bail a été créé avec succès",
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Error creating lease:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du bail",
        variant: "destructive",
      })
    }
  })

  const updateLease = useMutation({
    mutationFn: async (data: LeaseFormData) => {
      if (!data.start_date) {
        throw new Error("La date de début est requise")
      }

      const leaseData = {
        ...data,
        end_date: data.duration_type === "fixed" ? data.end_date : null
      }

      const { error } = await supabase
        .from("apartment_leases")
        .update(leaseData)
        .eq("id", initialData?.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Bail modifié",
        description: "Le bail a été modifié avec succès",
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Error updating lease:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du bail",
        variant: "destructive",
      })
    }
  })

  const onSubmit = async (data: LeaseFormData) => {
    if (initialData) {
      await updateLease.mutateAsync(data)
    } else {
      await createLease.mutateAsync(data)
    }
  }

  if (isLoadingTenants || isLoadingUnits) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TenantUnitFields 
        tenants={tenants}
        units={units}
        formData={formData}
        onUnitChange={handleUnitChange}
        setValue={setValue}
      />
      
      <DateFields 
        formData={formData} 
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }} 
      />
      
      <PaymentFields 
        formData={formData} 
        setFormData={(data) => {
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as keyof LeaseFormData, value)
          })
        }}
        selectedUnitId={selectedUnitId}
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

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  )
}