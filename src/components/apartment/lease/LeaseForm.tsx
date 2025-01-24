import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { ApartmentLease } from "@/types/apartment"

interface LeaseFormProps {
  initialData?: ApartmentLease
  onSuccess?: () => void
}

export function LeaseForm({ initialData, onSuccess }: LeaseFormProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      tenant_id: "",
      unit_id: "",
      start_date: "",
      end_date: "",
      rent_amount: "",
      deposit_amount: "",
      payment_frequency: "monthly",
      duration_type: "month_to_month",
      payment_type: "upfront",
    }
  })

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
    mutationFn: async (data: any) => {
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert([{
          ...data,
          status: "active",
          agency_id: (await supabase.auth.getUser()).data.user?.id
        }])

      if (leaseError) throw leaseError

      // Update unit status
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", data.unit_id)

      if (unitError) throw unitError
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
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("apartment_leases")
        .update(data)
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

  const onSubmit = async (data: any) => {
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenant_id">Locataire</Label>
          <Select
            value={watch("tenant_id")}
            onValueChange={(value) => setValue("tenant_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un locataire" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.first_name} {tenant.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_id">Unité</Label>
          <Select
            value={watch("unit_id")}
            onValueChange={(value) => setValue("unit_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une unité" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.apartment?.name} - Unité {unit.unit_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            type="date"
            {...register("start_date", { required: true })}
          />
        </div>

        {watch("duration_type") === "fixed" && (
          <div className="space-y-2">
            <Label htmlFor="end_date">Date de fin</Label>
            <Input
              type="date"
              {...register("end_date")}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rent_amount">Montant du loyer</Label>
          <Input
            type="number"
            {...register("rent_amount", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deposit_amount">Montant de la caution</Label>
          <Input
            type="number"
            {...register("deposit_amount", { required: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
          <Select
            value={watch("payment_frequency")}
            onValueChange={(value) => setValue("payment_frequency", value)}
          >
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="duration_type">Type de durée</Label>
          <Select
            value={watch("duration_type")}
            onValueChange={(value) => setValue("duration_type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Durée déterminée</SelectItem>
              <SelectItem value="month_to_month">Mois par mois</SelectItem>
              <SelectItem value="yearly">Annuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_type">Type de paiement</Label>
          <Select
            value={watch("payment_type")}
            onValueChange={(value) => setValue("payment_type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upfront">Paiement d'avance</SelectItem>
              <SelectItem value="end_of_period">Fin de période</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  )
}