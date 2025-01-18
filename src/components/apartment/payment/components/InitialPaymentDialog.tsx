import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InitialPaymentsForm } from "./InitialPaymentsForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

interface InitialPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
}

export function InitialPaymentDialog({ open, onOpenChange, tenantId }: InitialPaymentDialogProps) {
  const { data: lease } = useQuery({
    queryKey: ["tenant-lease", tenantId],
    queryFn: async () => {
      const { data } = await supabase
        .from("apartment_leases")
        .select("*")
        .eq("tenant_id", tenantId)
        .single()
      
      return data
    }
  })

  if (!lease) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Paiements Initiaux</DialogTitle>
        </DialogHeader>
        <InitialPaymentsForm
          leaseId={lease.id}
          depositAmount={lease.deposit_amount}
          rentAmount={lease.rent_amount}
          onSuccess={() => onOpenChange(false)}
          agencyId={lease.agency_id}
        />
      </DialogContent>
    </Dialog>
  )
}