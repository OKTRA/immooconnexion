import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      console.log("Submitting initial payments for lease:", leaseId)

      const { data, error } = await supabase.rpc('handle_initial_payments', {
        p_lease_id: leaseId,
        p_deposit_amount: depositAmount,
        p_agency_fees: rentAmount * 0.5
      })

      if (error) {
        console.error('Error handling initial payments:', error)
        throw error
      }

      console.log("Initial payments response:", data)

      toast({
        title: "Paiements initiaux enregistrés",
        description: "Les paiements ont été enregistrés avec succès",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error:', error)
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