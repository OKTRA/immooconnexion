import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InspectionForm } from "./InspectionForm"

interface InspectionDialogProps {
  lease: {
    id: string;
    deposit_amount?: number | null;
  };
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function InspectionDialog({ lease, onOpenChange, open }: InspectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inspection de fin de bail</DialogTitle>
        </DialogHeader>
        <InspectionForm lease={lease} onSuccess={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  )
}