import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PaymentFormFields } from "./components/PaymentFormFields"
import { usePaymentForm } from "./hooks/usePaymentForm"
import { toast } from "@/components/ui/use-toast"
import { useLeaseQueries } from "../lease/hooks/useLeaseQueries"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
}

export function PaymentDialog({
  open,
  onOpenChange,
  leaseId
}: PaymentDialogProps) {
  const { leases } = useLeaseQueries()
  const lease = leases.find(l => l.id === leaseId)

  const {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  } = usePaymentForm({
    onSuccess: () => {
      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
      })
      onOpenChange(false)
    }
  })

  if (!lease) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau paiement</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <PaymentFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            lease={lease}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}