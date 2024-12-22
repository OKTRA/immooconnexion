import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReceiptActionsProps {
  onPrint: () => void;
  contractId?: string;
  isEndOfContract?: boolean;
}

export function ReceiptActions({ onPrint, contractId, isEndOfContract }: ReceiptActionsProps) {
  const navigate = useNavigate();

  const handleEndContract = () => {
    if (contractId) {
      navigate(`/inspections/${contractId}`);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={onPrint} className="w-full">
        Imprimer le reçu
      </Button>
      
      {!isEndOfContract && contractId && (
        <Button onClick={handleEndContract} variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Mettre fin au contrat
        </Button>
      )}
    </div>
  );
}