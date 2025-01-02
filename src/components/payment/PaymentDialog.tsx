import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormFields } from "./PaymentFormFields"
import { paymentFormSchema, type PaymentFormData, type PaymentDialogProps } from "./types"
import { CinetPayForm } from "./CinetPayForm"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { PaymentMethodSelector } from "./PaymentMethodSelector"

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  planId, 
  planName, 
  amount,
  tempAgencyId,
  propertyId 
}: PaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cinetpay")
  const { toast } = useToast()
  const navigate = useNavigate()

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    toast({
      title: "Success",
      description: "Your payment has been processed. You can now log in to access your dashboard.",
    })
  }

  const handleClose = () => {
    if (paymentSuccess) {
      navigate('/login')
    }
    onOpenChange(false)
  }

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "cinetpay":
        return (
          <CinetPayForm 
            amount={amount || 0}
            description={planName ? `Subscription to ${planName} plan` : 'Payment'}
            agencyId={tempAgencyId}
            onSuccess={handlePaymentSuccess}
          />
        )
      case "paydunya":
        return (
          <div className="text-center p-4">
            <p className="text-sm text-gray-500">
              L'intégration PayDunya sera bientôt disponible
            </p>
          </div>
        )
      case "orange-money":
        return (
          <div className="text-center p-4">
            <p className="text-sm text-gray-500">
              L'intégration Orange Money sera bientôt disponible
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Registration Successful" 
              : planName 
                ? `Complete Registration - ${planName} Plan` 
                : 'Payment'}
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <div className="space-y-4">
            {paymentSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Your payment has been processed and your account has been created. 
                  You can now log in to access your dashboard.
                </p>
                <Button onClick={handleClose} className="w-full">
                  Go to Login
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form className="space-y-4">
                  <PaymentMethodSelector 
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                  />
                  {renderPaymentForm()}
                </form>
              </Form>
            )}
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}