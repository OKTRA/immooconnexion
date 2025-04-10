import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LeaseForm } from "./LeaseForm"

interface CreateLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateLeaseDialog({ open, onOpenChange }: CreateLeaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau bail</DialogTitle>
        </DialogHeader>
        <LeaseForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}