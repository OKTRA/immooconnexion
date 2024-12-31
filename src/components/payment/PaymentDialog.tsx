import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { PaymentFormFields } from "./PaymentFormFields"
import { useForm } from "react-hook-form"
import { PaymentFormData } from "./types"

interface PaymentDialogProps {
  propertyId: string
}

export function PaymentDialog({ propertyId }: PaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (data: PaymentFormData) => {
    console.log("Payment form submitted:", data)
    // Handle payment submission logic here
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Enregistrer un paiement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Enregistrez un paiement pour ce bien
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <PaymentFormFields form={form} />
          <Button type="submit" className="mt-4 w-full">
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}