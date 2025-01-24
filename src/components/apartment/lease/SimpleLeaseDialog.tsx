import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SimpleLeaseForm } from "./SimpleLeaseForm"

interface SimpleLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SimpleLeaseDialog({ open, onOpenChange }: SimpleLeaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un bail simple</DialogTitle>
        </DialogHeader>
        <SimpleLeaseForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}