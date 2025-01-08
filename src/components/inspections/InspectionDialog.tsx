import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InspectionForm } from "./InspectionForm"

export interface InspectionDialogProps {
  lease?: {
    id: string;
    deposit_amount?: number | null;
  };
  contract?: {
    id: string;
    montant: number;
    type: string;
    property_id: string;
    tenant_id: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function InspectionDialog({ 
  lease,
  contract,
  onOpenChange, 
  open,
  className 
}: InspectionDialogProps) {
  // Use either lease or contract based on what's provided
  const inspectionData = lease || contract;

  if (!inspectionData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>Inspection de fin de bail</DialogTitle>
        </DialogHeader>
        <InspectionForm lease={inspectionData} onSuccess={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  )
}