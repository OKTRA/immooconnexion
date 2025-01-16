import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useInitialPayments } from "../hooks/useInitialPayments"
import { z } from "zod"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  deposit_amount: z.number().min(0, "Le montant doit être positif"),
  agency_fees: z.number().min(0, "Le montant doit être positif"),
})

type FormData = z.infer<typeof formSchema>

interface InitialPaymentFormProps {
  leaseId: string
  agencyId: string
  onSuccess?: () => void
  defaultValues?: {
    deposit_amount: number
    agency_fees: number
  }
}

export function InitialPaymentForm({ 
  leaseId, 
  agencyId, 
  onSuccess,
  defaultValues = {
    deposit_amount: 0,
    agency_fees: 0
  }
}: InitialPaymentFormProps) {
  const { handleInitialPayments, isSubmitting } = useInitialPayments({
    leaseId,
    agencyId,
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const onSubmit = async (data: FormData) => {
    const success = await handleInitialPayments({
      deposit_amount: data.deposit_amount,
      agency_fees: data.agency_fees
    })
    if (success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="deposit_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant de la caution</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agency_fees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frais d'agence</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les paiements"
          )}
        </Button>
      </form>
    </Form>
  )
}