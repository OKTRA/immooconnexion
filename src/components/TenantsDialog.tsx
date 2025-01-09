import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    first_name: tenant?.first_name || "",
    last_name: tenant?.last_name || "",
    birth_date: tenant?.birth_date || "",
    phone_number: tenant?.phone_number || "",
    photoId: null as File | null,
    agency_fees: tenant?.agency_fees?.toString() || "",
    propertyId: "",
    profession: tenant?.profession || "",
  });

  const { data: userProfile } = useUserProfile();
  const { data: properties = [] } = useAvailableProperties(userProfile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] md:h-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] md:h-auto pr-4">
          {!showReceipt ? (
            <TenantCreationForm
              userProfile={userProfile}
              properties={properties}
              onSuccess={() => setShowReceipt(true)}
              onCancel={() => onOpenChange(false)}
              initialData={tenant}
              isEditing={!!tenant}
            />
          ) : (
            <div className="space-y-4">
              <TenantReceipt 
                tenant={{
                  first_name: formData.first_name,
                  last_name: formData.last_name,
                  phone_number: formData.phone_number,
                  agency_fees: parseFloat(formData.agency_fees),
                  profession: formData.profession,
                  property_id: formData.propertyId,
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
                  className="w-full md:w-auto"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}