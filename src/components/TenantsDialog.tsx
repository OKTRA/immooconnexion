import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TenantCreationForm } from "./tenants/TenantCreationForm";
import { TenantReceipt } from "./tenants/TenantReceipt";
import { useUserProfile } from "./tenants/hooks/useUserProfile";
import { useAvailableProperties } from "./tenants/hooks/useAvailableProperties";

interface TenantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: any;
}

export function TenantsDialog({ open, onOpenChange, tenant }: TenantsDialogProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    photoId: null as File | null,
    fraisAgence: "",
    propertyId: "",
  });

  const { data: userProfile } = useUserProfile();
  const { data: properties = [] } = useAvailableProperties(userProfile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        {!showReceipt ? (
          <TenantCreationForm
            userProfile={userProfile}
            properties={properties}
            onSuccess={() => setShowReceipt(true)}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <div className="space-y-4">
            <TenantReceipt 
              tenant={{
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                fraisAgence: formData.fraisAgence,
                propertyId: formData.propertyId,
              }}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReceipt(false);
                  onOpenChange(false);
                }}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}