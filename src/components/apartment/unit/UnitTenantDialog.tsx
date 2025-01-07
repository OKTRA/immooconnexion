import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { UnitTenantForm } from "./UnitTenantForm"
import { useQueryClient } from "@tanstack/react-query"

interface UnitTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unitId: string
}

export function UnitTenantDialog({ open, onOpenChange, unitId }: UnitTenantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleSuccess = () => {
    toast({
      title: "Locataire ajouté",
      description: "Le locataire a été ajouté avec succès",
    })
    queryClient.invalidateQueries({ queryKey: ["unit-current-lease"] })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un locataire</DialogTitle>
        </DialogHeader>
        <UnitTenantForm
          unitId={unitId}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}