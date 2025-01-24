import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { ApartmentLease } from "@/types/apartment"
import { LeaseFormData } from "../types"

export function useLeaseForm(initialData?: ApartmentLease, onSuccess?: () => void) {
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

  const createLease = useMutation({
    mutationFn: async (data: LeaseFormData) => {
      if (!data.start_date) {
        throw new Error("La date de début est requise")
      }

      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      // First, create the lease
      const { data: lease, error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: data.tenant_id,
          unit_id: data.unit_id,
          start_date: data.start_date,
          end_date: data.duration_type === "fixed" ? data.end_date : null,
          rent_amount: data.rent_amount,
          deposit_amount: data.deposit_amount,
          payment_frequency: data.payment_frequency,
          duration_type: data.duration_type,
          payment_type: data.payment_type,
          agency_id: userProfile.agency_id,
          status: "active"
        })
        .select()
        .single()

      if (leaseError) {
        console.error("Error creating lease:", leaseError)
        throw leaseError
      }

      if (!lease) {
        throw new Error("Failed to create lease")
      }

      // Then, generate payment periods
      const { error: periodsError } = await supabase
        .rpc('generate_lease_payment_periods', {
          p_lease_id: lease.id,
          p_start_date: data.start_date,
          p_end_date: data.duration_type === "fixed" ? data.end_date : null,
          p_rent_amount: data.rent_amount,
          p_payment_frequency: data.payment_frequency
        })

      if (periodsError) {
        console.error("Error generating periods:", periodsError)
        throw periodsError
      }

      // Update unit status
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", data.unit_id)

      if (unitError) {
        console.error("Error updating unit:", unitError)
        throw unitError
      }

      // Create tenant_units association
      const { error: tenantUnitError } = await supabase
        .from("tenant_units")
        .insert({
          tenant_id: data.tenant_id,
          unit_id: data.unit_id
        })
        .select()
        .single()

      if (tenantUnitError && tenantUnitError.code !== '23505') { // Ignore unique constraint violations
        console.error("Error creating tenant_unit:", tenantUnitError)
        throw tenantUnitError
      }

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
    onError: (error: any) => {
      console.error("Error creating lease:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du bail",
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
    onError: (error: any) => {
      console.error("Error updating lease:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la modification du bail",
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
    createLease,
    updateLease
  }
}