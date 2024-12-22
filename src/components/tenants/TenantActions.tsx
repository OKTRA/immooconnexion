import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone, MessageSquare, FileText, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TenantReceipt } from "./TenantReceipt";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TenantActionsProps {
  tenant: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    fraisAgence?: string;
  };
  onEdit: (tenant: any) => void;
  onDelete: (id: string) => void;
}

export function TenantActions({ tenant, onEdit, onDelete }: TenantActionsProps) {
  const navigate = useNavigate();
  const [showReceipt, setShowReceipt] = useState(false);

  const handleViewContracts = (tenantId: string) => {
    navigate(`/locataires/${tenantId}/contrats`);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(tenant)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.location.href = `tel:${tenant.telephone}`}
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.location.href = `sms:${tenant.telephone}`}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleViewContracts(tenant.id)}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowReceipt(true)}
        >
          <Receipt className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(tenant.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <TenantReceipt 
            tenant={{
              nom: tenant.nom,
              prenom: tenant.prenom,
              telephone: tenant.telephone,
              fraisAgence: tenant.fraisAgence || "0",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}