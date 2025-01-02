import { CinetPayForm } from "./CinetPayForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaymentFormData } from "./types"

export function TestPayment() {
  const defaultFormData: PaymentFormData = {
    email: "",
    password: "",
    confirm_password: "",
    agency_name: "",
    agency_address: "",
    country: "",
    city: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  }

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
          formData={defaultFormData}
        />
      </DialogContent>
    </Dialog>
  )
}