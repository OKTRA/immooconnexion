import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { initializeCinetPay } from "@/utils/cinetpay"
import { Loader2 } from "lucide-react"
import { PaymentFormData, CinetPayFormProps } from "./types"

interface ExtendedCinetPayFormProps extends CinetPayFormProps {
  formData: PaymentFormData
}

export function CinetPayForm({ 
  amount, 
  description, 
  agencyId,
  onSuccess,
  onError,
  formData 
}: ExtendedCinetPayFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      console.log("Initializing payment with:", { amount, description, formData })

      // Structure the metadata
      const metadata = {
        user_data: {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone_number
        },
        agency_data: {
          name: formData.agency_name,
          address: formData.agency_address,
          country: formData.country,
          city: formData.city,
          phone: formData.phone_number,
          email: formData.email
        },
        subscription_plan_id: agencyId
      }

      // Initialize payment attempt in database
      const { data, error } = await initializeCinetPay({
        amount,
        description,
        metadata
      })

      if (error) {
        console.error("Error initializing payment:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation du paiement",
          variant: "destructive",
        })
        onError?.(error)
        return
      }

      if (!data?.payment_token) {
        console.error("No payment token received")
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation du paiement",
          variant: "destructive",
        })
        return
      }

      // Initialize CinetPay widget
      const CinetPay = window.CinetPay
      CinetPay.setConfig({
        apikey: '12912847765bc0db748fdd44.40081707',
        site_id: '445160',
        notify_url: 'https://apidxwaaogboeoctlhtz.supabase.co/functions/v1/handle-payment-webhook',
        mode: 'PRODUCTION',
        return_url: window.location.origin + '/payment-success'
      })

      CinetPay.getCheckout({
        transaction_id: data.payment_token,
        amount,
        currency: 'XOF',
        channels: 'ALL',
        description,
        customer_email: formData.email,
        customer_name: formData.first_name,
        customer_surname: formData.last_name,
        customer_phone_number: formData.phone_number,
        customer_address: formData.agency_address,
        customer_city: formData.city,
        customer_country: formData.country,
        mode: 'PRODUCTION' as const,
        lang: 'fr',
        metadata: data.metadata
      })

      onSuccess?.()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          "Payer avec CinetPay"
        )}
      </Button>
    </div>
  )
}