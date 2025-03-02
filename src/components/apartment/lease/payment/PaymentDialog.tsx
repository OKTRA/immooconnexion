
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "./PaymentForm"
import { PaymentDialogProps } from "./types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export function PaymentDialog({
  open,
  onOpenChange,
  leaseId,
  lease
}: PaymentDialogProps) {
  const { data: leaseData, isLoading } = useQuery({
    queryKey: ["lease-for-payment", leaseId],
    queryFn: async () => {
      // Skip fetch if lease is already provided
      if (lease) return lease
      
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants(*),
          unit:apartment_units(
            *,
            apartment:apartments(*)
          )
        `)
        .eq("id", leaseId)
        .single()

      if (error) throw error
      return data
    },
    enabled: open && !lease && !!leaseId
  })

  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestion des Paiements</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : leaseData ? (
          <PaymentForm 
            leaseId={leaseId}
            lease={leaseData}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Impossible de charger les informations du bail
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
