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

interface PaymentDialogProps {
  propertyId: string
}

export function PaymentDialog({ propertyId }: PaymentDialogProps) {
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
        <PaymentFormFields propertyId={propertyId} />
      </DialogContent>
    </Dialog>
  )
}