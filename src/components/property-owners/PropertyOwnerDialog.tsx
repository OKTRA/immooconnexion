import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PropertyOwnerForm } from "./PropertyOwnerForm"

interface PropertyOwnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner?: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone_number: string | null
    status: 'active' | 'inactive'
  }
}

export function PropertyOwnerDialog({ open, onOpenChange, owner }: PropertyOwnerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {owner ? 'Modifier le propriétaire' : 'Ajouter un propriétaire'}
          </DialogTitle>
        </DialogHeader>
        <PropertyOwnerForm owner={owner} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}