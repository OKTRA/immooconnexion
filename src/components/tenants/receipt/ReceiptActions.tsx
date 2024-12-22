import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ReceiptActionsProps {
  onPrint: () => void;
  contractId?: string;
  isEndOfContract?: boolean;
}

export function ReceiptActions({ onPrint }: ReceiptActionsProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onPrint} className="w-full">
        Imprimer le reçu
      </Button>
    </div>
  );
}