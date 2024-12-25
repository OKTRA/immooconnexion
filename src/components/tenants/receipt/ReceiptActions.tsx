import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ReceiptActionsProps {
  onPrint: () => void;
}

export function ReceiptActions({ onPrint }: ReceiptActionsProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onPrint} className="w-full">
        <FileText className="w-4 h-4 mr-2" />
        Imprimer le reçu
      </Button>
    </div>
  );
}