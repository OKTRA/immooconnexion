import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AgencyPlanConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencyId: string
  pendingPlanId: string | null
  onSuccess: () => void
}

export function AgencyPlanConfirmDialog({ 
  open, 
  onOpenChange, 
  agencyId, 
  pendingPlanId,
  onSuccess 
}: AgencyPlanConfirmDialogProps) {
  const { toast } = useToast()

  const handleConfirm = async () => {
    if (!pendingPlanId) return

    try {
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', pendingPlanId)
        .single()

      if (!plan) throw new Error("Plan not found")

      const { data: agency } = await supabase
        .from('agencies')
        .select('current_properties_count, current_tenants_count, current_profiles_count')
        .eq('id', agencyId)
        .single()

      if (!agency) throw new Error("Agency not found")

      const canDowngrade = 
        (plan.max_properties === -1 || agency.current_properties_count <= plan.max_properties) &&
        (plan.max_tenants === -1 || agency.current_tenants_count <= plan.max_tenants) &&
        (plan.max_users === -1 || agency.current_profiles_count <= plan.max_users)

      if (!canDowngrade) {
        toast({
          title: "Changement impossible",
          description: "L'agence dépasse les limites du plan sélectionné",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('agencies')
        .update({ subscription_plan_id: pendingPlanId })
        .eq('id', agencyId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le plan d'abonnement a été mis à jour",
      })
      onSuccess()
    } catch (error: any) {
      console.error('Error updating subscription plan:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du plan",
        variant: "destructive",
      })
    } finally {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer le changement de plan</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir modifier le plan d'abonnement de cette agence ? 
            Cette action peut affecter les fonctionnalités disponibles pour l'agence.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}