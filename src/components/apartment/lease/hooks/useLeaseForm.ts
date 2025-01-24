import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { ApartmentLease } from "@/types/apartment"
import { LeaseFormData } from "../types"

export function useLeaseForm(initialData?: ApartmentLease | null, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const defaultValues: LeaseFormData = {
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

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<LeaseFormData>({
    defaultValues: initialData ? {
      tenant_id: initialData.tenant_id,
      unit_id: initialData.unit_id,
      start_date: initialData.start_date,
      end_date: initialData.end_date || "",
      rent_amount: initialData.rent_amount,
      deposit_amount: initialData.deposit_amount || 0,
      payment_frequency: initialData.payment_frequency as LeaseFormData["payment_frequency"],
      duration_type: initialData.duration_type as LeaseFormData["duration_type"],
      payment_type: initialData.payment_type as LeaseFormData["payment_type"],
      status: initialData.status as LeaseFormData["status"]
    } : defaultValues
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

      const { data: lease, error } = await supabase
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
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      // Update unit status
      const { error: unitError } = await supabase
        .from('apartment_units')
        .update({ status: 'occupied' })
        .eq('id', data.unit_id)

      if (unitError) throw unitError

      // Create tenant_units association
      const { error: tenantUnitError } = await supabase
        .from('tenant_units')
        .insert({
          tenant_id: data.tenant_id,
          unit_id: data.unit_id
        })

      if (tenantUnitError) throw tenantUnitError

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

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    formData,
    selectedUnitId,
    tenants,
    units,
    isLoadingTenants,
    isLoadingUnits,
    isSubmitting,
    createLease
  }
}
