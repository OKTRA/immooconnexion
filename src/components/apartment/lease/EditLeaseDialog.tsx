import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LeaseForm } from "./LeaseForm"
import { ApartmentLease } from "@/types/apartment"

interface EditLeaseDialogProps {
  lease: ApartmentLease
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLeaseDialog({ lease, open, onOpenChange }: EditLeaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le bail</DialogTitle>
        </DialogHeader>
        <LeaseForm 
          initialData={lease}
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}