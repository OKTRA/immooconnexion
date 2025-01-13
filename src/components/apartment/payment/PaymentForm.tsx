import { useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: "cash" | "bank_transfer" | "mobile_money"
  paymentPeriods: string[]
}

interface LeaseData {
  id: string
  rent_amount: number
  tenant_id: string
  unit_id: string
  apartment_tenants: {
    first_name: string
    last_name: string
  }
  apartment_units: {
    unit_number: string
    apartment: {
      name: string
    }
  }
}

export function PaymentForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, watch, setValue } = useForm<PaymentFormData>()

  // Fetch active leases
  const { data: leases = [], isLoading: isLoadingLeases } = useQuery({
    queryKey: ["active-leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          id,
          rent_amount,
          tenant_id,
          unit_id,
          apartment_tenants (
            first_name,
            last_name
          ),
          apartment_units (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `)
        .eq("status", "active")

      if (error) throw error
      return data as LeaseData[]
    }
  })

  // Fetch payment periods for selected lease
  const selectedLeaseId = watch("leaseId")
  const { data: paymentPeriods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ["payment-periods", selectedLeaseId],
    queryFn: async () => {
      if (!selectedLeaseId) return []

      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", selectedLeaseId)
        .eq("status", "pending")
        .order("start_date", { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!selectedLeaseId
  })

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setIsSubmitting(true)

      // Create payment record
      const { error: paymentError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: data.leaseId,
          amount: data.amount,
          payment_method: data.paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString() // This should be set based on the payment period
        })

      if (paymentError) throw paymentError

      // Update payment period status
      if (data.paymentPeriods.length > 0) {
        const { error: periodError } = await supabase
          .from("apartment_payment_periods")
          .update({ status: "paid" })
          .in("id", data.paymentPeriods)

        if (periodError) throw periodError
      }

      toast({
        title: "Paiement effectué",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingLeases) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Contrat de location</Label>
        <Select
          onValueChange={(value) => setValue("leaseId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un contrat" />
          </SelectTrigger>
          <SelectContent>
            {leases.map((lease) => (
              <SelectItem key={lease.id} value={lease.id}>
                {lease.apartment_tenants.first_name} {lease.apartment_tenants.last_name} - {lease.apartment_units.apartment.name} (Unité {lease.apartment_units.unit_number})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLeaseId && (
        <>
          <div className="space-y-2">
            <Label>Périodes de paiement</Label>
            {isLoadingPeriods ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {paymentPeriods.map((period) => (
                  <label key={period.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={period.id}
                      {...register("paymentPeriods")}
                      className="rounded border-gray-300"
                    />
                    <span>
                      {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()} ({period.amount.toLocaleString()} FCFA)
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { required: true, min: 0 })}
              placeholder="Montant en FCFA"
            />
          </div>

          <div className="space-y-2">
            <Label>Mode de paiement</Label>
            <Select
              onValueChange={(value: "cash" | "bank_transfer" | "mobile_money") => 
                setValue("paymentMethod", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Effectuer le paiement"
            )}
          </Button>
        </>
      )}
    </form>
  )
}