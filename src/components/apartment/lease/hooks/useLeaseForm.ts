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
      const { data: lease, error } = await supabase
        .rpc('create_lease_with_periods', {
          p_tenant_id: data.tenant_id,
          p_unit_id: data.unit_id,
          p_start_date: data.start_date,
          p_end_date: data.duration_type === "fixed" ? data.end_date : null,
          p_rent_amount: data.rent_amount,
          p_deposit_amount: data.deposit_amount,
          p_payment_frequency: data.payment_frequency,
          p_duration_type: data.duration_type,
          p_payment_type: data.payment_type,
          p_agency_id: units.find(unit => unit.id === data.unit_id)?.apartment?.agency_id
        })

      if (error) {
        console.error("Error creating lease:", error)
        throw error
      }

      return lease
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      queryClient.invalidateQueries({ queryKey: ["available-units"] })
      toast({
        title: "Bail créé",
        description: "Le bail a été créé avec succès.",
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