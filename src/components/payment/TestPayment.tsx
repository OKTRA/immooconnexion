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
          amount={100} 
          description="Test de paiement"
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