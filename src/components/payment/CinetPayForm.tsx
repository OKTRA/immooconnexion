import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { initializeCinetPay } from "@/utils/cinetpay"
import { Loader2 } from "lucide-react"
import { PaymentFormData, CinetPayFormProps } from "./types"
import { getCountryCode } from "@/utils/countryUtils"

interface ExtendedCinetPayFormProps extends CinetPayFormProps {
  formData: PaymentFormData
}

declare global {
  interface Window {
    CinetPay: any
  }
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

      // Validate required fields
      if (!formData.email || !formData.agency_phone || !formData.country || !formData.first_name || !formData.last_name) {
        toast({
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        })
        return
      }

      // Format phone number
      const phoneNumber = formData.agency_phone.startsWith('+') 
        ? formData.agency_phone 
        : `+${formData.agency_phone}`

      // Get country code
      const countryCode = getCountryCode(formData.country)
      if (!countryCode) {
        toast({
          title: "Erreur de validation",
          description: "Pays non reconnu",
          variant: "destructive",
        })
        return
      }

      // Structure the metadata
      const metadata = {
        user_data: {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: phoneNumber
        },
        agency_data: {
          name: formData.agency_name,
          address: formData.agency_address,
          country: countryCode,
          city: formData.city,
          phone: phoneNumber,
          email: formData.email
        },
        subscription_plan_id: agencyId
      }

      // Initialize payment attempt in database
      const response = await initializeCinetPay({
        amount,
        description,
        metadata
      })

      if (!response || !response.data || response.error) {
        console.error("Error initializing payment:", response?.error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation du paiement",
          variant: "destructive",
        })
        onError?.(response?.error)
        return
      }

      if (!response.data.payment_token) {
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
        transaction_id: response.data.payment_token,
        amount,
        currency: 'XOF',
        channels: 'ALL',
        description,
        customer_email: formData.email,
        customer_name: formData.first_name,
        customer_surname: formData.last_name,
        customer_phone_number: phoneNumber,
        customer_address: formData.agency_address,
        customer_city: formData.city,
        customer_country: countryCode,
        mode: 'PRODUCTION' as const,
        lang: 'fr',
        metadata: response.data.metadata,
        onClose: () => {
          console.log("Widget closed")
        },
        onError: (error: any) => {
          console.error("Payment error:", error)
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors du paiement",
            variant: "destructive",
          })
          onError?.(error)
        },
        onSuccess: (data: any) => {
          console.log("Payment successful:", data)
          onSuccess?.()
        }
      })

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