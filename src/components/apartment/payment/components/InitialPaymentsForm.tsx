import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

interface InitialPaymentsFormProps {
  leaseId: string
  depositAmount: number
  rentAmount: number
  onSuccess?: () => void
  agencyId?: string | null
}

export function InitialPaymentsForm({
  leaseId,
  depositAmount,
  rentAmount,
  onSuccess,
  agencyId
}: InitialPaymentsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Calculer les frais d'agence (50% du loyer par défaut)
      const agencyFees = rentAmount * 0.5

      // Créer les paiements initiaux
      const { error: paymentsError } = await supabase.rpc(
        'handle_initial_payments',
        {
          p_lease_id: leaseId,
          p_deposit_amount: depositAmount,
          p_agency_fees: agencyFees
        }
      )

      if (paymentsError) {
        console.error('Erreur lors de la création des paiements:', paymentsError)
        throw paymentsError
      }

      // Mettre à jour le statut du bail
      const { error: leaseError } = await supabase
        .from('apartment_leases')
        .update({
          initial_payments_completed: true,
          initial_fees_paid: true
        })
        .eq('id', leaseId)

      if (leaseError) {
        console.error('Erreur lors de la mise à jour du bail:', leaseError)
        throw leaseError
      }

      toast({
        title: "Paiements initiaux enregistrés",
        description: "Les paiements initiaux ont été enregistrés avec succès",
      })

      // Rediriger vers la même page sans paramètres
      const currentPath = window.location.pathname
      navigate(currentPath)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement des paiements",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <h3 className="font-semibold">Paiements initiaux requis</h3>
        <p className="text-sm text-muted-foreground">
          Veuillez effectuer les paiements initiaux pour activer le bail
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Caution</span>
          <span className="font-medium">{depositAmount?.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Frais d'agence (50% du loyer)</span>
          <span className="font-medium">{(rentAmount * 0.5)?.toLocaleString()} FCFA</span>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          "Enregistrer les paiements initiaux"
        )}
      </Button>
    </div>
  )
}