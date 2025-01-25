import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "../PaymentMethodSelect"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PaymentFormData } from "@/types/payment"

interface LatePaymentFormProps {
  onSubmit: (data: PaymentFormData) => void
  isSubmitting: boolean
  totalAmount: number
}

export function LatePaymentForm({ onSubmit, isSubmitting, totalAmount }: LatePaymentFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      amount: totalAmount,
      paymentMethod: "cash",
      notes: "",
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PaymentMethodSelect
        value={watch("paymentMethod")}
        onChange={(value) => setValue("paymentMethod", value)}
      />

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          {...register("notes")}
          placeholder="Ajouter des notes sur le paiement..."
          className="min-h-[100px]"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Traitement en cours..." : "Effectuer le paiement"}
      </Button>
    </form>
  )
}