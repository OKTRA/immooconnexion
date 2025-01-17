import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector"
import { CinetPayForm } from "@/components/payment/CinetPayForm"
import { OrangeMoneyForm } from "@/components/payment/OrangeMoneyForm"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { PaymentDialogProps } from "./types"

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  planId, 
  planName, 
  amount = 0,
  isUpgrade = false
}: PaymentDialogProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("cinetpay")
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleClose = () => {
    if (paymentSuccess) {
      navigate('/agence/dashboard')
    }
    onOpenChange(false)
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    toast({
      title: "Succès",
      description: isUpgrade 
        ? "Votre abonnement a été mis à jour avec succès" 
        : "Le paiement a été effectué avec succès",
    })
  }

  const defaultFormData = {
    email: "",
    password: "",
    confirm_password: "",
    agency_name: "",
    agency_address: "",
    agency_phone: "",
    country: "",
    city: "",
    first_name: "",
    last_name: "",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Paiement réussi" 
              : planName 
                ? `Paiement - Plan ${planName}` 
                : 'Paiement'}
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <div className="space-y-4">
            {paymentSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {isUpgrade 
                    ? "Votre abonnement a été mis à jour avec succès."
                    : "Votre paiement a été traité avec succès."}
                </p>
                <Button onClick={handleClose} className="w-full">
                  Retour au tableau de bord
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <PaymentMethodSelector 
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
                {paymentMethod === "orange_money" && (
                  <OrangeMoneyForm 
                    amount={amount}
                    description={`${isUpgrade ? "Mise à niveau vers" : "Paiement pour"} ${planName}`}
                    planId={planId}
                    onSuccess={handlePaymentSuccess}
                    formData={defaultFormData}
                  />
                )}
                {paymentMethod === "cinetpay" && (
                  <CinetPayForm 
                    amount={amount}
                    description={`${isUpgrade ? "Mise à niveau vers" : "Paiement pour"} ${planName}`}
                    agencyId={planId}
                    onSuccess={handlePaymentSuccess}
                    formData={defaultFormData}
                  />
                )}
              </div>
            )}
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}