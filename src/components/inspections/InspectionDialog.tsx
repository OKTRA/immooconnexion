import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InspectionForm } from "./InspectionForm"
import { Contract } from "@/integrations/supabase/types/contracts"
import { cn } from "@/lib/utils"

interface InspectionDialogProps {
  contract: Contract
  onOpenChange?: (open: boolean) => void
  open?: boolean
  className?: string
}

export function InspectionDialog({ contract, onOpenChange, open, className }: InspectionDialogProps) {
  const dialogContent = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Inspection de fin de bail</DialogTitle>
      </DialogHeader>
      <InspectionForm contract={contract} onSuccess={() => onOpenChange?.(false)} />
    </DialogContent>
  )

  if (onOpenChange) {
    return <Dialog open={open} onOpenChange={onOpenChange}>{dialogContent}</Dialog>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("whitespace-nowrap", className)}>
          Effectuer une inspection
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}