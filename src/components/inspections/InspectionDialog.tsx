import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InspectionForm } from "./InspectionForm"
import { Contract } from "@/integrations/supabase/types/contracts"

export interface InspectionDialogProps {
  lease?: any;
  contract?: Contract;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InspectionDialog({ lease, contract, className, open, onOpenChange }: InspectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && !onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="outline" className={className}>
            État des lieux
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>État des lieux</DialogTitle>
        </DialogHeader>
        <InspectionForm lease={lease} contract={contract} />
      </DialogContent>
    </Dialog>
  )
}