import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "./PaymentForm"
import { LatePaymentForm } from "./components/LatePaymentForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
}

export function PaymentDialog({ open, onOpenChange, leaseId }: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau Paiement</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="regular">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regular">Paiement Normal</TabsTrigger>
            <TabsTrigger value="late">Paiement en Retard</TabsTrigger>
          </TabsList>
          <TabsContent value="regular">
            <PaymentForm
              onSuccess={() => onOpenChange(false)}
              leaseId={leaseId}
            />
          </TabsContent>
          <TabsContent value="late">
            <LatePaymentForm
              leaseId={leaseId}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}