import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { CinetPayForm } from "../payment/CinetPayForm"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

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

      setTempAgencyId(agency.id)
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
    try {
      if (!tempAgencyId) return

      // Activer l'agence après le paiement réussi
      const { error: updateError } = await supabase
        .from('agencies')
        .update({ status: 'active' })
        .eq('id', tempAgencyId)

      if (updateError) throw updateError

      // Activer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('agency_id', tempAgencyId)

      if (profileError) throw profileError

      // Déconnexion pour que l'utilisateur puisse se connecter proprement
      await supabase.auth.signOut()

      setPaymentSuccess(true)
      toast({
        title: "Paiement réussi",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      })
    } catch (error: any) {
      console.error('Error finalizing account:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la finalisation du compte",
        variant: "destructive",
      })
    }
  }

  const handlePaymentError = async (error: any) => {
    console.error('Error during payment:', error)
    
    // En cas d'erreur, supprimer l'agence temporaire et le profil utilisateur
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
      navigate('/login')
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
          <Card className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Après validation du paiement, vous pourrez vous connecter à votre compte.
              </p>
              <CinetPayForm 
                amount={1000}
                description={`Abonnement au plan ${planName}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                agencyId={tempAgencyId}
              />
            </div>
          </Card>
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