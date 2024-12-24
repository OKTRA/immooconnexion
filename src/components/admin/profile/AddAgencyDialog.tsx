import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AgencyFields } from "./AgencyFields"
import { AgencyLogoUpload } from "./form/AgencyLogoUpload"
import { useAgencyForm } from "./form/useAgencyForm"

interface AddAgencyDialogProps {
  showDialog: boolean
  setShowDialog: (show: boolean) => void
  onAgencyCreated?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddAgencyDialog({ 
  showDialog, 
  setShowDialog, 
  onAgencyCreated,
  open,
  onOpenChange 
}: AddAgencyDialogProps) {
  const isOpen = open ?? showDialog
  const handleOpenChange = onOpenChange ?? setShowDialog

  const { 
    agencyData, 
    setAgencyData, 
    handleCreateAgency 
  } = useAgencyForm(() => {
    handleOpenChange(false)
    if (onAgencyCreated) {
      onAgencyCreated()
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle agence</DialogTitle>
        </DialogHeader>
        <AgencyFields agencyData={agencyData} setAgencyData={setAgencyData} />
        <AgencyLogoUpload agencyId={null} />
        <Button onClick={handleCreateAgency} className="w-full">
          Créer l'agence
        </Button>
      </DialogContent>
    </Dialog>
  )
}