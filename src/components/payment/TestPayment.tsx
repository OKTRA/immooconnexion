import { CinetPayForm } from "./CinetPayForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function TestPayment() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tester le paiement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test de paiement CinetPay</DialogTitle>
        </DialogHeader>
        <CinetPayForm 
          amount={1000}
          description="Test de paiement CinetPay"
          onSuccess={() => {
            console.log("Paiement réussi")
          }}
          onError={(error) => {
            console.error("Erreur de paiement:", error)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}