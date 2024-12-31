import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { PaymentDialog } from "../payment/PaymentDialog"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
}

export function PricingDialog({ open, onOpenChange, planId, planName }: PricingDialogProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [tempAgencyId, setTempAgencyId] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)

  const handleStartSubscription = async () => {
    try {
      setIsLoading(true)
      
      // Créer une agence temporaire
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: `Nouvelle Agence - ${new Date().toISOString()}`,
          subscription_plan_id: planId,
          status: 'pending'
        })
        .select()
        .single()

      if (agencyError) throw agencyError

      // Récupérer le montant du plan
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('price')
        .eq('id', planId)
        .single()

      if (planError) throw planError

      setTempAgencyId(agency.id)
      setAmount(plan.price)
      setShowPayment(true)
    } catch (error: any) {
      console.error('Error creating temporary agency:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de l'agence",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true)
    toast({
      title: "Paiement réussi",
      description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
    })
  }

  const handlePaymentError = async (error: any) => {
    console.error('Error during payment:', error)
    
    // En cas d'erreur, supprimer l'agence temporaire
    if (tempAgencyId) {
      await supabase
        .from('agencies')
        .delete()
        .eq('id', tempAgencyId)
    }

    toast({
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors du paiement",
      variant: "destructive",
    })
  }

  const handleClose = () => {
    if (paymentSuccess) {
      navigate('/agence/login')
    }
    onOpenChange(false)
    setShowPayment(false)
    setPaymentSuccess(false)
    setTempAgencyId(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentSuccess 
              ? "Inscription réussie" 
              : showPayment 
                ? "Finaliser l'inscription" 
                : `Inscription - Plan ${planName}`}
          </DialogTitle>
          <DialogDescription>
            {paymentSuccess 
              ? "Votre compte est en cours d'examen par notre équipe."
              : showPayment 
                ? "Pour finaliser votre inscription, veuillez créer votre compte et procéder au paiement."
                : "Cliquez sur Commencer pour créer votre compte."}
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Nous avons bien reçu votre paiement et votre demande d'inscription. 
              Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Aller à la page de connexion
              </Button>
            </div>
          </div>
        ) : showPayment ? (
          <PaymentDialog 
            open={showPayment}
            onOpenChange={setShowPayment}
            planId={planId}
            planName={planName}
            amount={amount}
            tempAgencyId={tempAgencyId}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              En cliquant sur Commencer, vous allez créer votre compte et choisir votre abonnement.
            </p>
            <Button 
              onClick={handleStartSubscription} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Commencer"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}